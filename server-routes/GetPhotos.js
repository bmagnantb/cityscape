var request = require('request'),
		Parse = require('parse').Parse
		flickrApiKey = 'eeacdafae711c1ae98c0342fa323569a'

Parse.Photo = Parse.Object.extend('Photo', {
		initialize: function() {
				this.set('user_votes', [])
				this.set('total_votes', 0)
		}
})
Parse.PhotoCollection = Parse.Collection.extend({
		model: Parse.Photo
})

function photos(req, res) {
		req.query.api_key = flickrApiKey
		!req.query.tags ? req.query.tags = [] : null
		req.query.tags.indexOf('city') === -1 ? req.query.tags.push('city') : null
		req.query.tags.indexOf('buildings') === -1 ? req.query.tags.push('buildings') : null
		var url = 'https://api.flickr.com/services/rest?',
				counter = 0

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

				var data = JSON.parse(body),
						photo_ids = []
						query = new Parse.Query(Parse.Photo),
						photoCollection = {}

				data.photos.tags = req.query.tags.slice(0, -2)

				data.photos.photo.forEach(function(val) {
						photo_ids.push(val.id)
				})

				query.containedIn('photo_id', photo_ids).find({
						success: function(result) {
								photoCollection = new Parse.PhotoCollection(result)
								photo_ids.forEach(function(val) {
										if (photoCollection.pluck('photo_id').indexOf(val) === -1) {
												photoCollection.create({photo_id: val}, {
														error: function() {
																console.log(arguments[1])
														}
												})
										}
								})
								data.photos.photo.forEach(function(val) {
										var model = photoCollection.models.filter(function(m) {
												return m.get('photo_id') === val.id
										})[0]
										val.user_votes = model.get('user_votes')
										val.total_votes = model.get('total_votes')
								})
								res.send(data)
						},
						error: function() {
								console.log(arguments)
						}
				})
		})
}

module.exports = photos