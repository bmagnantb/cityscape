var request = require('request')
var Parse = require('parse').Parse
var weightVotes = require('./weightVotes')
var ParseClass = require('./ParseClass')


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
			if (result) {
				var data = result.toJSON()
				if (data.user_votes.indexOf(user) === -1) {

					var tag_votes = data.tag_votes

					if (tags.length) {
						for (var i = 0, arr = tags, imax = arr.length; i < imax; i++) {
							Object.keys(tag_votes).indexOf(arr[i]) !== -1 ? tag_votes[arr[i]]++ : tag_votes[arr[i]] = 1
						}
					}

					data.total_votes += 1
					data.user_votes.push(user)
					data.tag_votes = tag_votes

					result.set(data)

					data.weighted_votes = weightVotes(data, tags)
					res.send(data)

					result.save(null, {
						error: function(results, err) {
							console.log('parse save vote error')
							console.log(err)
							res.send(err)
						}
					})
				} else {
					console.log(user + 'already voted for'+result.get('photo_id'))
					res.send('you have already voted for this photo')
				}
			} else {
				console.log('photo_id not found on Parse')
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