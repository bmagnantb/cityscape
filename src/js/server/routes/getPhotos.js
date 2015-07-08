import request from 'request'
import Promise from 'bluebird'
import _ from 'lodash'

import connectMongo from '../utils/connectMongo'
import weightVotes from '../utils/weightVotes'
import trimPhoto from '../utils/trimPhoto'
import flickrRequestUrl from '../utils/flickrRequestUrl'

export default function photos(req, res) {

	// build flickr request url with query and route
	var flickrUrl = flickrRequestUrl(req.query, req.route)

	request.get(flickrUrl, function(err, resp, body) {
		if (err != null) {
			res.send(err)
			console.log(err)
			return
		}

		var flickrResponse = parseFlickrResponse(body, req.query)
		var mongo = connectMongo(req, flickrResponse)

		// retrieve matches of photos in flickr response and merge data
		var dbMatches = mongo.then(getDbMatches)
			.then(mergeDbData)

		// retrieve photos with votes from mongo
		var dbVoted = mongo.then(getDbVoted)

		// when matches and voted photos are retrieved, process data and send
		Promise.join(dbMatches, dbVoted, mergeVotes)
			.then(calcWeightedVotes)
			.then(sortPhotos)
			.then(truncatePhotos)
			.then(function(data) {
				res.send({photos: data.flickr.photos})
				return data
			})
			.then(savePhotos)
			.catch(handleError)
	})
}

// trim response and get photo_ids
function parseFlickrResponse(data, reqQuery) {
	var photo_ids = []
	data = JSON.parse(data)
	data.photos.tags = reqQuery.tags.slice(2)

	// get ids of fetched photos
	for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
		arr[i] = trimPhoto(arr[i])
		photo_ids.push(arr[i].photo_id)
	}

	return {photos: data.photos, photo_ids: photo_ids}

}

// query for photos from db that match photos from flickr request
function getDbMatches(data) {
	var mongoPhotos = data.mongo.collection('photos')

	var promise = new Promise(function(resolve, reject) {
		mongoPhotos.find({
			photo_id: {$in: data.flickr.photo_ids}
		})
		.toArray(function(err, docs) {
			if (err != null) reject(err)
			else {
				data.mongoData = docs
				resolve(data)
			}
		})
	})

	return promise
}

// merge db response with flickr response
function mergeDbData(data) {
	var flickrData = data.flickr.photos
	var mongoDb = data.mongoData
	var mongoIds = getMongoIds(mongoDb)

	/*
	separate arrays to keep track of photos that already and don't exist in mongo
	newPhotos gets bulk inserted
	mongo doesn't allow updating a set of documents via an array of element to document
	updatePhotos must be iterated and updated individually
	*/
	var newPhotos = []
	var updatePhotos = []

	// photos for saving to db -- initialize votes info for photos not in db
	for (var i = 0, arr = flickrData.photo, imax = arr.length, counter = 0; i < imax; i++) {
		var mongoMatchIndex = mongoIds.indexOf(arr[i].photo_id)

		// copy info so weighted votes aren't included in mongo
		if (mongoMatchIndex === -1) {
			arr[i].user_votes = []
			arr[i].total_votes = 0
			arr[i].tag_votes = {}
			newPhotos.push(_.assign({}, arr[i]))
		}
		else {
			updatePhotos.push(_.assign({}, arr[i]))
			_.merge(arr[i], mongoDb[mongoMatchIndex])
		}
	}

	return {flickr: data.flickr, updatePhotos: updatePhotos, newPhotos: newPhotos, mongo: data.mongo}
}

// get ids of photos in same order for easy matching
function getMongoIds(mongoDb) {
	var ids = []

	for (var i = 0, arr = mongoDb, imax = arr.length; i < imax; i++) {
		ids.push(arr[i].photo_id)
	}

	return ids
}

/*
get up to 500 photos not in flickr results, that have votes, match current search,
most votes first, sorted ascending votes and date uploaded if same number of votes
*/
function getDbVoted(data) {
	var mongoPhotos = data.mongo.collection('photos')
	var thirtyDaysAgo = Math.round((new Date() - (1000 * 60 * 60 * 24 * 30)) / 1000)
	var tags = data.req.query.tags.slice(2)

	var promise = new Promise(function(resolve, reject) {
		// add limit 500 & check tags syntax -- need all tags matched
		mongoPhotos.find({
			tags: {$all: tags},
			total_votes: {$gt: 0},
			date_uploaded: {$gt: thirtyDaysAgo},
			photo_ids: {$nin: data.flickr.photo_ids}
		})
		.sort({total_votes: -1, date_uploaded: 1})
		.limit(500)
		.toArray(function(err, docs) {
			if (err != null) reject(err)
			else {
				resolve(docs)
			}
		})
	})

	return promise
}

// combines flickr results and mongo results
function mergeVotes(flickr, dbVoted) {
	if (dbVoted.length) Array.prototype.push.apply(flickr.flickr.photos.photo, dbVoted)
	return flickr
}

function calcWeightedVotes(data) {
	for (var i = 0, arr = data.flickr.photos.photo, imax = arr.length; i < imax; i++) {
		arr[i].weighted_votes = weightVotes(arr[i], data.flickr.photos.tags)
	}

	return data
}

function sortPhotos(data) {
	data.flickr.photos.photo.sort(function(a, b) {
		if (a.weighted_votes > b.weighted_votes) return -1
		if (b.weighted_votes > a.weighted_votes) return 1
		if (a.total_votes > b.total_votes) return -1
		if (b.total_votes > a.total_votes) return 1
		if (a.dateupload > b.dateupload) return -1
		if (b.dateupload > a.dateupload) return 1
		return 0
	})

	return data
}

// return only 500 photos
function truncatePhotos(data) {
	data.flickr.photos.photo = data.flickr.photos.photo.slice(0, 500)
	return data
}

function savePhotos(data) {
	var counter
	var mongoPhotos = data.mongo.collection('photos')

	var photosUpdated = new Promise(function(resolve, reject) {
		for (var i = 0, arr = data.updatePhotos, imax = arr.length; i < imax; i++) {
			mongoPhotos.updateOne(
				{ photo_id: arr[i].photo_id },
				{ $set: arr[i] },
				function(err) {
					if (err != null) handleError(err)
					if (counter === imax - 1) resolve()
				}
			)
			counter++
		}
	})

	var newPhotosAdded = new Promise(function(resolve, reject) {
		if (data.newPhotos.length) {
			mongoPhotos.insertMany(
				data.newPhotos,
				resolve
			)
		}
		else {
			resolve()
		}
	})

	Promise.join(photosUpdated, newPhotosAdded, data.mongo.close)
}

// development throw error
function handleError(err) {
	throw err
}