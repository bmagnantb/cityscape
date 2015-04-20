var request = require('request')
var Promise = require('bluebird')
var Parse = require('parse').Parse

var weightVotes = require('./utils/weightVotes')
var ParseClass = require('./utils/ParseClass')


module.exports = vote


function vote(req, res) {

		console.log(req.params)

		var requestResult = getRequestInfo(req)

		getPhoto(requestResult)
			.then(addVote)
			.then(newWeightedVote)
			.then(function(data) {
				console.log(data.photo)
				res.send(data.photo)
				return data
			})
			.then(savePhoto)
			.done()
}



function getRequestInfo(req) {

	var user = req.params.user
	if (user === 'undefined') {
		res.send('user not logged in')
		return
	}

	console.log(req.params)

	var photoId = req.params.id
	var tags = req.params.tags ? req.params.tags.split(',') : []

	return {user: user, photoId: photoId, tags: tags}
}



function getPhoto(request) {

	var query = new Parse.Query('Photo')

	query.equalTo('photo_id', request.photoId)

	var promise = new Promise(function(resolve, reject) {
		query.first({
		 	success: function(result) {
		 		resolve({result: result, request: request})
		 	},
		 	error: function(err) {
		 		reject(err)
		 	}
		 })
	})

	return promise
}



function addVote(data) {

	var photo = data.result

	photo.set('total_votes', photo.get('total_votes') + 1)
	photo.attributes.user_votes.push(data.request.user)

	if (data.request.tags.length) {
		for (var i = 0, arr = data.request.tags, imax = arr.length; i < imax; i++) {
			Object.keys(photo.attributes.tag_votes).indexOf(arr[i]) !== -1
				? photo.attributes.tag_votes[arr[i]]++
				: photo.attributes.tag_votes[arr[i]] = 1
		}
	}

	data.photo = photo.toJSON()
	return data
}



function newWeightedVote(data) {

	data.photo.weighted_votes = weightVotes(data.photo, data.request.tags)

	return data
}



function savePhoto(data) {

	data.result.save(null, {
		error: handleError
	})

	return data
}



// dev -- handle error
function handleError(err) {

	console.log(err)
}

