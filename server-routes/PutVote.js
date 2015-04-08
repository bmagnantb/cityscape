var request = require('request'),
		Parse = require('parse').Parse

function vote(req, res) {
try {
		var user = req.params.user
		var photoId = req.params.id
		var tags
		req.params.tags ? tags = req.params.tags.split(',') : tags = []

		if (user === 'undefined') {
				res.send('user not logged in')
				return
		}

		console.log(req.params)

		var query = new Parse.Query('Photo')
		query.equalTo('photo_id', photoId).first({
				success: function(result) {
						if (!result.get('tag_votes')) console.log(result)
						if (result.get('user_votes').indexOf(user) === -1) {
								if (tags.length) {
										var tag_votes = result.get('tag_votes')

										for (var i = 0, arr = tags, imax = arr.length; i < imax; i++) {
												Object.keys(tag_votes).indexOf(arr[i]) !== -1 ? tag_votes[arr[i]]++ : tag_votes[arr[i]] = 1
										}
								}

								result.save({
										total_votes: result.get('total_votes') + 1,
										user_votes: result.get('user_votes').concat(user),
										tag_votes: tag_votes || result.get('tag_votes')
								}, {
										success: function(results) {
												results = results.toJSON()
												results.weighted_votes = 0
												if (tags.length) {
														var totalVote = results.total_votes
														for (var i = 0, arr = tags, imax = arr.length; i < imax; i++) {
																if (results.tag_votes[arr[i]]) {
																		results.weighted_votes = results.tag_votes[arr[i]] * 2
																		totalVote -= results.tag_votes[arr[i]]
																}
														}
														results.weighted_vote += Math.round(totalVote / 5)
												}
												else results.weighted_votes = results.total_votes
												res.send(results)
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
catch (err) {
		console.log(err)
		res.send(err)
}
}

module.exports = vote