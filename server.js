function startServer() {
		var express = require('express'),
				request = require('request'),
				app = express(),
				flickrApiKey = 'eeacdafae711c1ae98c0342fa323569a'

		app.use(express.static(__dirname + '/public'))



		app.get('/photos', function(req, res) {
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
						res.send(JSON.parse(body))
				})
		})




		app.listen(3000, function() {
				console.log('skylines w/ server')
		})
}

startServer();