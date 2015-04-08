var request = require('request')
var Parse = require('parse').Parse
var flickrApiKey = require('../flickrKey')

// when photo entry is created, add user votes, total votes, and tag votes
Parse.Photo = Parse.Object.extend('Photo', {
		initialize: function() {
				this.set('user_votes', [])
				this.set('total_votes', 0)
				this.set('tag_votes', {})
		}
})

Parse.PhotoCollection = Parse.Collection.extend({
		model: Parse.Photo
})


// handle request
function photos(req, res) {
try {
		req.query.api_key = flickrApiKey

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

				// get ids of fetched photos and change id to photo_id for consistency with Parse
				var photo_ids = []
				for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
						arr[i].photo_id = arr[i].id
						delete arr[i].id
						photo_ids.push(arr[i].photo_id)
				}

				// create object for Parse photo query to hold constraints
				var query = new Parse.Query(Parse.Photo)

				// add tags used in search to response body
				data.photos.tags = req.query.tags.slice(2)

				console.log('1st query')

				// add constraints and query
				query.containedIn('photo_id', photo_ids)
					.select('photo_id', 'tag_votes', 'user_votes', 'total_votes')
					.limit(500)
					.find({
						success: function(result) {
								// get photo_ids of result
								var resultIds = []
								for (var i = 0, arr = result, imax = arr.length; i < imax; i++) {
										resultIds.push(arr[i].attributes.photo_id)
								}

								// new array for saving photos not on Parse
								var savePhotos = []
								for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {

										// initialize votes info for photo not on Parse and add to savePhotos
										if (resultIds.indexOf(arr[i].photo_id) === -1) {
												if (arr[i].tags) arr[i].tags = arr[i].tags.split(' ')
												arr[i].user_votes = []
												arr[i].total_votes = 0
												arr[i].tag_votes = {}
												savePhotos.push(arr[i])
										}

										// if photo on parse, put vote info into respective photos in data
										else {
												arr[i].total_votes = result[resultIds.indexOf(arr[i].photo_id)].attributes.total_votes
												arr[i].user_votes = result[resultIds.indexOf(arr[i].photo_id)].attributes.user_votes
												arr[i].tag_votes = result[resultIds.indexOf(arr[i].photo_id)].attributes.tag_votes
										}
								}

								// new query for Parse -- get rankings that fit flickr request query
								var queryVoted = new Parse.Query(Parse.Photo)
								var sevenDaysAgo = new Date() - (1000 * 60 * 60 * 24 * 7)

								// only entries that match all request tags, paginated by 500
								if (data.photos.tags.length) queryVoted.containsAll('tags', data.photos.tags)
								if (req.query.page && req.query.page > 1) queryVoted.skip(500)
								queryVoted.limit(500)

								// only if has votes and uploaded in past week
									.greaterThan('total_votes', 0)
									.greaterThan('dateupload', sevenDaysAgo.toString())

								// sort by most votes, then most recent
									.descending('total_votes')
									.addAscending('dateupload')
									.find({
										success: function(results) {
												console.log('2nd query success')
												// add results to data
												if (results.length) {

														// remove photos already in data
														for (var i = 0, arr = results, imax = results.length, match; i < imax; i++) {
																arr[i] = arr[i].attributes
																if (photo_ids.indexOf(arr[i].photo_id) !== -1) arr.splice(i, 1)
														}

														Array.prototype.push.apply(data.photos.photo, results)
												}

												// set weighted votes
												for (var i = 0, arr = data.photos.photo, imax = arr.length; i < imax; i++) {
														arr[i].weighted_votes = 0

														// if request tags exist, weight the votes
														if (data.photos.tags.length) {

																// total vote holder for subtracting weighted votes
																var totalVote = arr[i].total_votes

																// check tag votes for each request tag
																for (var a = 0, arr2 = data.photos.tags, amax = arr2.length; a < amax; a++) {

																		// if photo has matching tag vote, double and subtract from total votes
																		if (arr[i].tag_votes[arr2[a]]) {
																				arr[i].weighted_votes = arr[i].tag_votes[arr2[a]] * 2
																				totalVote -= arr[i].tag_votes[arr2[a]]
																		}
																}

															// after weighting, add fifth of remaining total votes
															arr[i].weighted_votes += Math.round(totalVote / 5)
														}

														// if request tags don't exist, use total votes
														else arr[i].weighted_votes = arr[i].total_votes
												}

												// sort photos by votes
												data.photos.photo.sort(function(a, b) {
														if (a.weighted_votes > b.weighted_votes) return -1
														if (b.weighted_votes > a.weighted_votes) return 1
														if (a.total_votes > b.total_votes) return -1
														if (b.total_votes > a.total_votes) return 1
														if (a.dateupload > b.dateupload) return -1
														if (b.dateupload > a.dateupload) return 1
														return 0
												})
												data.photos.photo = data.photos.photo.slice(0, 500)
												console.log('sending')
												res.send(data)

												// save photos after response -- lots of processing time
												var photoCollection = new Parse.PhotoCollection()
												for (var i = 0, arr = savePhotos, imax = arr.length; i < imax; i++) {
														photoCollection.create(arr[i], {
																error: function() {
																		console.log('error saving new photos to Parse')
																}
														})
												}
										},

										error: function(err) {
												console.log('sending, error getting votes')
												console.log(err)
												res.send(data)

												// save photos after response -- lots of processing time
												var photoCollection = new Parse.PhotoCollection()
												for (var i = 0, arr = savePhotos, imax = arr.length; i < imax; i++) {
														photoCollection.create(arr[i], {
																error: function() {
																		console.log('error saving new photos to Parse')
																}
														})
												}
										}
								})
						},
						error: function() {
								console.log('Parse error')
								res.send(data)
						}
				})
		})
}
catch (err) {
		console.log(err)
		res.send(err)
}
}

module.exports = photos