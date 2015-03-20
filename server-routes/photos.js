var request = require('request'),
		Parse = require('parse').Parse
		flickrApiKey = 'eeacdafae711c1ae98c0342fa323569a',
		ParsePhoto = Parse.Object.extend('Photo')

function photos(req, res) {
		req.query.api_key = flickrApiKey
		var url = 'https://api.flickr.com/services/rest?'
		var counter = 0
		for (var key in req.query) {
				if (counter > 0) url += '&'
				url+= key + '=' + req.query[key]
				counter++
		}
		request(url, function (err, resp, body) {
				if (err) {
						res.send(err)
						return
				}
				var data = JSON.parse(body)

				var photos = []

				data.photos.photo.forEach(function(val) {
						photos.push( {id: val.id} )
				})

				console.log(photos)



				res.send(data)
		})
}

module.exports = photos