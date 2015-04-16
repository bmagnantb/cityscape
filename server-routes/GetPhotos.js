var request = require('request')
var Promise = require('bluebird')
var Parse = require('parse').Parse

var weightVotes = require('./utils/weightVotes')
var ParseClass = require('./utils/ParseClass')
var trimPhoto = require('./utils/trimPhoto')
var flickrRequestUrl = require('./utils/flickrRequestUrl')


module.exports = photos


// handle request
function photos(req, res) {

	var url = flickrRequestUrl(req.query, req.route)

	request.get(url, function(err, resp, body) {

		if (err != null) {
			res.send(err)
			console.log(err)
			return
		}

		var reqQuery = req.query

		var flickrResponse = trimFlickrResponse(body, reqQuery)

		var dbMatches = getDbMatches(flickrResponse, reqQuery)
			.then(mergeDbMatches)
			.catch(handleError)


		var dbVotes = getDbVoted(flickrResponse.photo_ids, reqQuery)
			.catch(handleError)

		Promise.join(dbMatches, dbVotes, mergeVotes)
			.then(calcWeightedVotes)
			.then(sortPhotos)
			.then(truncatePhotos)
			.then(function(data) {
				res.send({photos: data.flickr.photos})
				return data
			})
			.then(savePhotos)
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



// query for photos from db that match photos from flickr request
function getDbMatches(flickrResponse, reqQuery) {

	var query = new Parse.Query('Photo')

	query.containedIn('photo_id', flickrResponse.photo_ids)
			 .select('photo_id', 'tag_votes', 'user_votes', 'total_votes')
			 .limit(500)

	var promise = new Promise(function(resolve, reject) {
		query.find({
			success: function(result) {
				resolve({parseDb: result, flickr: flickrResponse, reqQuery: reqQuery})
			},
			error: function(err) {
				reject(err)
			}
		})
	})

	return promise
}



// merge db response with flickr response
function mergeDbMatches(data) {

	var flickrData = data.flickr.photos
	var parseDb = data.parseDb
	var reqQuery = data.reqQuery

	var savePhotos = []
	var parseIds = getParseIds(parseDb)

	// photos for saving to db -- initialize votes info for photos not in db
	for (var i = 0, arr = flickrData.photo, imax = arr.length, counter = 0; i < imax; i++) {
		var parseMatchIndex = parseIds.indexOf(arr[i].photo_id)
		var copy = {}

		if (parseMatchIndex === -1) {
			arr[i].user_votes = []
			arr[i].total_votes = 0
			arr[i].tag_votes = {}

			for (var key in arr[i]) {
				if (arr[i].hasOwnProperty(key)) {
					copy[key] = arr[i][key]
				}
			}
			savePhotos.push(copy)
		}

		// update db entry with flickr data, add db entry to aggregate array
		else {
			for (var key in arr[i]) {
				if (arr[i].hasOwnProperty(key)) {
					parseDb[parseMatchIndex].set(key, arr[i][key])
				}
			}

			arr[i] = parseDb[parseMatchIndex].toJSON()
			savePhotos.push(parseDb[parseMatchIndex])
		}
	}

	data.savePhotos = savePhotos

	return {flickr: data.flickr, savePhotos: savePhotos}
}



function getParseIds(parseDb) {

	var ids = []

	for (var i = 0, arr = parseDb, imax = arr.length; i < imax; i++) {
		ids.push(arr[i].attributes.photo_id)
	}

	return ids
}


function getDbVoted(photo_ids, reqQuery) {

	var thirtyDaysAgo = Math.round((new Date() - (1000 * 60 * 60 * 24 * 30)) / 1000)

	var tags = reqQuery.tags.slice(2)

	// new query for Parse -- get rankings that fit flickr request query
	var queryVotes = new Parse.Query('Photo')

	if (tags.length) queryVotes.containsAll('tags', tags)
	queryVotes.notContainedIn('photo_ids', photo_ids)
		      .greaterThan('total_votes', 0)
		      .greaterThan('date_uploaded', thirtyDaysAgo)
		      .descending('total_votes')
		      .addAscending('date_uploaded')
		      .limit(500)

	var promise = new Promise(function(resolve, reject) {
		queryVotes.find({
			success: function(result) {
				resolve(result)
			},
			error: function(err) {
				reject(err)
			}
		})
	})

	return promise
}


function mergeVotes(dbMatches, dbVotes) {

	if (dbVotes.length) {
		for (var i = 0, arr = dbVotes, imax = arr.length; i < imax; i++) {
			arr[i] = arr[i].attributes
		}

		Array.prototype.push.apply(dbMatches.flickr.photos.photo, dbVotes)
	}

	return dbMatches
}



function calcWeightedVotes(data) {

	var flickrData = data.flickr.photos

	for (var i = 0, arr = flickrData.photo, imax = arr.length; i < imax; i++) {
		arr[i].weighted_votes = weightVotes(arr[i], flickrData.tags)
	}

	return data
}



function sortPhotos(data) {

	var flickrData = data.flickr.photos

	flickrData.photo.sort(function(a, b) {
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
	data.flickr.photos.photo = data.flickr.photos.photo.slice(0, 500)
	return data
}



function savePhotos(data) {

	var savePhotos = data.savePhotos

	Parse.Object.saveAll(savePhotos, {
		error: handleError
	})
}


// dev -- handle errors
function handleError(err) {
	console.log(err)
}