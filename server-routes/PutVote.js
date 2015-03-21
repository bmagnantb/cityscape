var request = require('request'),
		Parse = require('parse').Parse

function vote(req, res) {
		console.log(req.params)
		var user = req.params.user
		var photoId = req.params.id

		var query = new Parse.Query('Photo')
		query.equalTo('photo_id', photoId).first({
				success: function(result) {
						if (result.get('user_votes').indexOf(user) === -1) {
								result.save({
										total_votes: result.get('total_votes') + 1,
										user_votes: result.get('user_votes').concat(user)
								}, {
										success: function(results) {
												res.send('vote successful')
										},
										error: function(results, err) {
												console.log('parse save vote error')
												console.log(err)
												res.send(err)
										}
								})
						} else {
								console.log('already voted for'+result.get('photo_id'))
								res.send('you have already voted for this photo')
						}
				},
				error: function(err) {
						console.log('parse find photo_id for vote error')
						console.log(err)
						res.send(err)
				}
		})

}

module.exports = vote