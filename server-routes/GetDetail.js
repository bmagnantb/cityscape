var request = require('request')
var Parse = require('parse').Parse
var flickrApiKey = require('../flickrKey')
var ParseClass = require('./ParseClass')
var weightVotes = require('./weightVotes')
var trimPhoto = require('./trimPhoto')

function getDetail(req, res) {
try {
		var url = 'https://api.flickr.com/services/rest?',
				counter = 0

		req.query.api_key = flickrApiKey

		if (!req.query.photo_id) {
				console.log('photo\'s id required')
				res.send('photo\'s id required')
				return
		}

		if (!req.params.tags) req.params.tags = []
		else req.params.tags = req.params.tags.split(',')

		for (var key in req.query) {
				if (counter > 0) url += '&'
				url += key + '=' + req.query[key]
				counter++
		}

		request(url, function(err, resp, body) {
				if (err) {
						console.log(err)
						res.send(err)
						return
				}

				var data = JSON.parse(body)

				data = trimPhoto(data)

				var query = new Parse.Query('Photo')

				query.equalTo('photo_id', data.photo_id)
					.first({
						success: function(result) {
								var savePhoto
								if (result !== undefined) {
										result.set(data)

										data = result.toJSON()

										data.hello = 'hello'

										data.weighted_votes = weightVotes(data, req.params.tags)
										res.send(data)

										savePhoto = result
								}
								else {
										data.total_votes = 0
										data.user_votes = []
										data.tag_votes = {}

										savePhoto = new ParseClass.Photo(data)

										data.weighted_votes = 0
										res.send(data)
								}
								savePhoto.save({
									error: function(err) {
											console.log(err)
									}
								})
						},
						error: function(err) {
								console.log(err)
						}
					})

		})
}
catch (err) {
		console.log(err)
		res.send(err)
}
}

module.exports = getDetail