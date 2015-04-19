var request = require('request')
var Promise = require('bluebird')
var Parse = require('parse').Parse

var weightVotes = require('./utils/weightVotes')
var ParseClass = require('./utils/ParseClass')


module.exports = vote


function vote(req, res) {

		var requestResult = getRequestInfo(req)

		getPhoto(requestResult)
			.then(addVote)
			.then(newWeightedVote)
			.then(function(data) {
				res.send(data.photo)
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

	var photoId = req.params.id
	var tags = req.params.tags ? req.params.tags.split(',') : []
	console.log(req.params)

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

	photo.total_votes++
	photo.user_votes.push(user)

	if (request.tags.length) {
		for (var i = 0, arr = request.tags, imax = arr.length; i < imax; i++) {
			Object.keys(photo.tag_votes).indexOf(arr[i]) !== -1
				? photo.tag_votes[arr[i]]++
				: photo.tag_votes[arr[i]] = 1
		}
	}

	return data
}



function newWeightedVote(data) {

	var photo = data.result.toJSON()

	photo.weighted_votes = weightVotes(photo, data.request.tags)
	data.photo = photo

	return data
}



function savePhoto(data) {

	var savePhoto = data.result

	savePhoto.save(null, {
		error: handleError
	})

	return data
}



// dev -- handle error
function handleError(err) {

	console.log(err)
}

