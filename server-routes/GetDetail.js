var request = require('request'),
		Parse = require('parse').Parse,
		flickrApiKey = 'eeacdafae711c1ae98c0342fa323569a'

function getDetail(req, res) {
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

				if (req.params.votes === 'undefined') {

				}

				res.send(data)
		})
}

module.exports = getDetail