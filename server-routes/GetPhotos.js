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
								data.photos.photo.forEach(function(val) {
										if (photoCollection.pluck('photo_id').indexOf(val.id) === -1) {
												var photo = {}
												for (var key in val) {
														photo[key] = val[key]
												}
												photo.photo_id = photo.id
												delete photo.id
												photoCollection.create(photo, {
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
								if (!req.query.page || req.query.page === 1) {
										var queryVoted = new Parse.Query(Parse.Photo)
										var sevenDays = new Date() - (1000 * 60 * 60 * 24 * 7)
										queryVoted.descending('total_votes')
										queryVoted.greaterThan('dateupload', sevenDays.toString())
										queryVoted.descending('dateupload')
										queryVoted.limit(500)
										queryVoted.find({
												success: function(result) {
														result = result.map(function(val) {
																return val.attributes;
														})
														console.log(result)
														if (result.length) {
																result.forEach(function(val) {
																		if (photoCollection.pluck('photo_id').indexOf(val.photo_id) === -1) {
																				val.id = val.photo_id
																				delete val.photo_id
																				data.photos.photo.push(val)
																		}
																})
																data.photos.photo.sort(function(a, b) {
																		var num
																		if (a.total_votes > b.total_votes) return -1
																		if (b.total_votes > a.total_votes) return 1
																		if (a.dateupload > b.dateupload) return -1
																		if (b.dateupload > a.dateupload) return 1
																		return 0
																})
																data.photos.photo.slice(0, 500)
														}
														res.send(data)
												},

												error: function() {
														console.log(arguments)
														res.send(data)
												}
										})
								}
						},
						error: function() {
								console.log(arguments)
						}
				})
		})
}

module.exports = photos