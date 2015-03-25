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

		if (!req.query.tags) req.query.tags = []
		if (req.query.tags.indexOf('buildings') === -1) req.query.tags.unshift('buildings')
		if (req.query.tags.indexOf('city') === -1) req.query.tags.unshift('city')

		if (!req.query.extras) req.query.extras = []
		if (req.query.extras.indexOf('tags') === -1) req.query.extras.push('tags')

		console.log(req.query)
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

				data.photos.tags = req.query.tags.slice(2)

				data.photos.photo.forEach(function(val) {
						photo_ids.push(val.id)
				})
				console.log('1st query')
				query.containedIn('photo_id', photo_ids)
				query.limit(500).find({
						success: function(result) {
								photoCollection = new Parse.PhotoCollection(result)
								data.photos.photo.forEach(function(val) {
										var photoMatch = photoCollection.pluck('photo_id').indexOf(val.id)
										if (photoMatch === -1) {
												var photo = {}
												for (var key in val) {
														if (key === 'tags') photo[key] = val[key].split(' ')
														else photo[key] = val[key]
												}
												photo.photo_id = photo.id
												delete photo.id
												photoCollection.create(photo, {
														success: function(model) {
																val.user_votes = model.get('user_votes')
																val.total_votes = model.get('total_votes')
														},
														error: function() {
																console.log(arguments[1])
														}
												})
										}
										else {
												val.total_votes = photoCollection.models[photoMatch].get('total_votes')
												val.user_votes = photoCollection.models[photoMatch].get('user_votes')
										}
								})

								if (!req.query.page || req.query.page === '1') {
										var queryVoted = new Parse.Query(Parse.Photo)
										var sevenDays = new Date() - (1000 * 60 * 60 * 24 * 7)
										if (data.photos.tags.length) queryVoted.containsAll('tags', data.photos.tags)
										queryVoted.descending('total_votes')
										queryVoted.greaterThan('dateupload', sevenDays.toString())
										queryVoted.descending('dateupload')
										queryVoted.limit(500)
										queryVoted.find({
												success: function(results) {
														console.log('2nd query success')
														if (results.length) {
																results = results.map(function(val) {
																		return val.attributes;
																})
																results.forEach(function(val) {
																		if (photoCollection.pluck('photo_id').indexOf(val.photo_id) === -1) {
																				val.id = val.photo_id
																				delete val.photo_id
																				data.photos.photo.push(val)
																		}
																})
																data.photos.photo.sort(function(a, b) {
																		if (a.total_votes > b.total_votes) return -1
																		if (b.total_votes > a.total_votes) return 1
																		if (a.dateupload > b.dateupload) return -1
																		if (b.dateupload > a.dateupload) return 1
																		return 0
																})
														}
														data.photos.photo = data.photos.photo.slice(0, 500)
														console.log('sending')
														res.send(data)
												},

												error: function() {
														console.log(arguments)
														console.log('sending, error getting votes')
														res.send(data)
												}
										})
								}
								else res.send(data)
						},
						error: function() {
								console.log(arguments)
						}
				})
		})
}

module.exports = photos