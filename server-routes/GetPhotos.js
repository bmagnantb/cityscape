var request = require('request')
var MongoClient = require('mongodb').MongoClient
var flickrApiKey = require('../flickrKey')
var weightVotes = require('./weightVotes')
var ParseClass = require('./ParseClass')
var trimPhoto = require('./trimPhoto')

var mongoUrl = 'mongodb://localhost:27017/photos'


// handle request
function photos(req, res) {
	req.query.api_key = flickrApiKey

	var sevenDaysAgo = Math.round((new Date() - (1000 * 60 * 60 * 24 * 7)) / 1000)

	if (!req.query.min_upload_date) req.query.min_upload_date = sevenDaysAgo
	if (!req.query.tags) req.query.tags = []
	if (req.query.tags.indexOf('buildings') === -1) req.query.tags.unshift('buildings')
	if (req.query.tags.indexOf('city') === -1) req.query.tags.unshift('city')

	if (!req.query.extras) req.query.extras = []
	if (req.query.extras.indexOf('tags') === -1) req.query.extras.push('tags')

	console.log(req.query)
	var url = 'https://api.flickr.com/services/rest?'
	var counter = 0

	for (var key in req.query) {
		if (counter > 0) url += '&'
		url+= key + '=' + req.query[key]
		counter++
	}

	// request to flickr with params
	request(url, function (err, resp, body) {
		if (err) {
			res.send(err)
			return
		}

		// parse data
		var data = JSON.parse(body)

		// get ids of fetched photos and trim photo info for Parse
		var photo_ids = []
		for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
			arr[i] = trimPhoto(arr[i])
			photo_ids.push(arr[i].photo_id)
		}

		// add tags used in search to response body
		data.photos.tags = req.query.tags.slice(2)

		console.log('1st query')

		var dbMatches = getDbPhotoMatches(photo_ids)

		function getDbPhotoMatches(photo_ids) {
			MongoClient.connect(mongoUrl, function(err, db) {
				if (err != null) {
					console.log(err)
					return
				}

				var photoCollection = db.collection('photos', {strict: true}, getCollection)

				var matchingPhotos = photoCollection.find({photo_id: { $in: photo_ids } }, { _id: 0 }, getResults)

				console.log(matchingPhotos)

				db.close()
			})

			function getCollection(err, collection) {
				if (err != null) {
					return err
				}
				console.log(collection)
				return collection
			}

			function getResults(err, result) {
				if (err != null) {
					return err
				}
				return result
			}
		}

		// // add constraints and query
		// query.containedIn('photo_id', photo_ids)
		// .select('photo_id', 'tag_votes', 'user_votes', 'total_votes')
		// .limit(500)
		// .find({
		// 	success: function(result) {
		// 		// get photo_ids of result
		// 		var newPhotos = []
		// 		var savePhotos = []
		// 		var resultIds = []
		// 		for (var i = 0, arr = result, imax = arr.length; i < imax; i++) {
		// 			resultIds.push(arr[i].attributes.photo_id)
		// 		}

		// 		// new array for saving photos not on Parse
		// 		for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
		// 			var resultMatchIndex = resultIds.indexOf(arr[i].photo_id)
		// 			var copy = {}
		// 			// initialize votes info for photo not on Parse and add to newPhotos
		// 			if (resultMatchIndex === -1) {
		// 				arr[i].user_votes = []
		// 				arr[i].total_votes = 0
		// 				arr[i].tag_votes = {}
		// 				for (var key in arr[i]) {
		// 					copy[key] = arr[i][key]
		// 				}
		// 				newPhotos.push(copy)
		// 			}

		// 			// update parse info, put votes
		// 			else {
		// 				for (var key in arr[i]) {
		// 					result[resultMatchIndex].set(key, arr[i][key])
		// 				}
		// 				arr[i] = result[resultMatchIndex].toJSON()
		// 				savePhotos.push(result[resultMatchIndex])
		// 			}
		// 		}

		// 		// new query for Parse -- get rankings that fit flickr request query
		// 		var queryVoted = new Parse.Query('Photo')

		// 		// only entries that match all request tags, paginated by 500
		// 		if (data.photos.tags.length) queryVoted.containsAll('tags', data.photos.tags)
		// 		if (req.query.page && req.query.page > 1) queryVoted.skip(500)
		// 		queryVoted.limit(500)

		// 		// only if has votes and uploaded in past week
		// 			.greaterThan('total_votes', 0)
		// 			.greaterThan('date_uploaded', sevenDaysAgo)

		// 		// sort by most votes, then most recent
		// 			.descending('total_votes')
		// 			.addAscending('date_uploaded')
		// 			.find({
		// 				success: function(results) {
		// 					console.log('2nd query success')
		// 					// add results to data
		// 					if (results.length) {

		// 						// remove photos already in data
		// 						for (var i = 0, arr = results, imax = results.length, match; i < imax; i++) {
		// 							if (photo_ids.indexOf(arr[i].photo_id) !== -1) arr.splice(i, 1)
		// 							else arr[i] = arr[i].attributes
		// 						}

		// 						Array.prototype.push.apply(data.photos.photo, results)
		// 					}

		// 					// get votes
		// 					for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
		// 						arr[i].weighted_votes = weightVotes(arr[i], data.photos.tags)
		// 					}

		// 					// sort photos by votes
		// 					data.photos.photo.sort(function(a, b) {
		// 						if (a.weighted_votes > b.weighted_votes) return -1
		// 						if (b.weighted_votes > a.weighted_votes) return 1
		// 						if (a.total_votes > b.total_votes) return -1
		// 						if (b.total_votes > a.total_votes) return 1
		// 						if (a.dateupload > b.dateupload) return -1
		// 						if (b.dateupload > a.dateupload) return 1
		// 						return 0
		// 					})
		// 					data.photos.photo = data.photos.photo.slice(0, 500)
		// 					console.log('sending')
		// 					res.send(data)

		// 					// save photos after response -- lots of processing time
		// 					for (var i = 0, arr = newPhotos, imax = arr.length; i < imax; i++) {
		// 						arr[i] = new ParseClass.Photo(arr[i])
		// 					}

		// 					Parse.Object.saveAll(newPhotos, {
		// 						error: function(err) {
		// 							console.log(err)
		// 						}
		// 					})

		// 					Parse.Object.saveAll(savePhotos, {
		// 						error: function(err) {
		// 							console.log(err)
		// 						}
		// 					})
		// 				},
		// 			error: function(err) {
		// 				console.log('sending, error getting votes')
		// 				console.log(err)
		// 				res.send(data)

		// 				// save photos after response -- lots of processing time
		// 				for (var i = 0, arr = savePhotos, imax = arr.length; i < imax; i++) {
		// 					arr[i] = new ParseClass.Photo(arr[i])
		// 				}
		// 				Parse.Object.saveAll(newPhotos, {
		// 					error: function(err) {
		// 							console.log(err)
		// 					}
		// 				})

		// 				Parse.Object.saveAll(savePhotos, {
		// 					error: function(err) {
		// 						console.log(err)
		// 					}
		// 				})
		// 			}
		// 		})
		// 	},
		// 	error: function() {
		// 			console.log('Parse error')
		// 			res.send(data)
		// 	}
		// })
	})
}

module.exports = photos