var request = require('request')
var Parse = require('parse').Parse
var flickrApiKey = require('../flickrKey')

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

				res.send(data)
		})
}
catch (err) {
		console.log(err)
		res.send(err)
}
}

module.exports = getDetail