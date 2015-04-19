var request = require('request')
var Promise = require('bluebird')
var _ = require('lodash')
var MongoClient = require('mongodb').MongoClient

var weightVotes = require('./utils/weightVotes')
var ParseClass = require('./utils/ParseClass')
var trimPhoto = require('./utils/trimPhoto')
var flickrRequestUrl = require('./utils/flickrRequestUrl')


module.exports = photos


// handle request
function photos(req, res) {

	var flickrUrl = flickrRequestUrl(req.query, req.route)
	var mongoUrl = 'mongodb://localhost:27017/cityscape'

	request.get(flickrUrl, function(err, resp, body) {

		if (err != null) {
			res.send(err)
			console.log(err)
			return
		}

		var reqQuery = req.query
		var flickrResponse = trimFlickrResponse(body, reqQuery)

		var mongo = connectMongo(mongoUrl, flickrResponse, req)

		var getDbMatches = mongo.then(getDbMatches)
			.then(mergeDbData)

		var getDbVoted = mongo.then(getDbVoted)

		Promise.join(getDbMatches, getDbVoted, mergeVotes)
			.then(calcWeightedVotes)
			.then(sortPhotos)
			.then(truncatePhotos)
			.then(function(data) {
				res.send({photos: data.aggregate.photos})
				return data.flickr
			})
			.then(savePhotos)
			.catch(handleError)
	})
}


// get photos from Flickr
function trimFlickrResponse(data, reqQuery) {

	var photos
	var photo_ids = []
	data = JSON.parse(data)

	data.photos.tags = reqQuery.tags.slice(2)

	// get ids of fetched photos and trim photo info for Parse
	for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
		arr[i] = trimPhoto(arr[i])
		photo_ids.push(arr[i].photo_id)
	}

	return {photos: data.photos, photo_ids: photo_ids}

}


function connectMongo(url, flickrResponse, req) {

	var promise = new Promise(function(resolve, reject) {

		MongoClient.connect(url, function(err, db) {
			if (err != null) {
				reject(err)
			}
			resolve({mongo: db, flickr: flickrResponse, req: req})
		})
	})

	return promise
}



// query for photos from db that match photos from flickr request
function getDbMatches(data) {

	var mongoPhotos = data.mongo.collection('photos')

	var promise = new Promise(function(resolve, reject) {
		mongoPhotos.find({
			photo_id: {$in: data.flickr.photo_ids}
		})
		.toArray(function(err, docs) {
			if (err != null) {
				console.log(err)
				promise.reject(err)
			}
			else {
				console.log('------------docs------------\n', docs)
				data.mongo = docs
				promise.resolve(data)
			}
		})
	})

	return promise
}



// merge db response with flickr response
function mergeDbData(data) {

	var flickrData = data.flickr.photos
	var mongoDb = data.mongo

	var mongoIds = getMongoIds(mongoDb)

	// photos for saving to db -- initialize votes info for photos not in db
	for (var i = 0, arr = flickrData.photo, imax = arr.length, counter = 0; i < imax; i++) {

		var mongoMatchIndex = mongoIds.indexOf(arr[i].photo_id)

		if (mongoMatchIndex === -1) {
			arr[i].user_votes = []
			arr[i].total_votes = 0
			arr[i].tag_votes = {}
		}
		else {
			_.merge(arr[i], mongoDb[mongoMatchIndex])
		}
	}

	return {flickr: data.flickr}
}



function getMongoIds(mongoDb) {

	var ids = []

	for (var i = 0, arr = mongoDb, imax = arr.length; i < imax; i++) {
		ids.push(arr[i].photo_id)
	}

	return ids
}


function getDbVoted(data) {

	var mongoPhotos = data.mongo.collection('photos')

	var thirtyDaysAgo = Math.round((new Date() - (1000 * 60 * 60 * 24 * 30)) / 1000)
	var tags = data.req.tags.slice(2)

	var promise = new Promise(function(resolve, reject) {

		// add limit 500 & check tags syntax -- need all tags matched
		mongoPhotos.find({
			tags: {$all: tags},
			total_votes: {$gt: 0},
			date_uploaded: {$gt: thirtyDaysAgo},
			photo_ids: {$nin: data.flickr.photo_ids}
		})
		.toArray(function(err, docs) {
			if (err != null) promise.reject(err)
			else {
				docs.sort(function(a, b) {
					if (a.total_votes > b.total_votes) return -1
					if (a.total_votes < b.total_votes) return 1
					if (a.date_uploaded > b.date_uploaded) return -1
					if (a.date_uploaded < b.date_uploaded) return 1
				})
				promise.resolve(docs)
			}
		})
	})

	return promise
}



function mergeVotes(dbMatches, dbVotes) {

	if (dbVotes.length) Array.prototype.push.apply(dbMatches.flickr.photos.photo, dbVotes)

	return dbMatches
}



function calcWeightedVotes(data) {

	data.aggregate = _.assign({}, data.flickr)

	for (var i = 0, arr = data.aggregate.photos.photo, imax = arr.length; i < imax; i++) {
		arr[i].weighted_votes = weightVotes(arr[i], data.flickr.photos.tags)
	}

	return data
}



function sortPhotos(data) {

	data.aggregate.photos.photo.sort(function(a, b) {
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



function truncatePhotos(data) {
	data.aggregate.photos.photo = data.aggregate.photos.photo.slice(0, 500)
	return data
}



function savePhotos(data) {

	// data.
}



// dev -- handle errors
function handleError(err) {
	console.log(err)
}