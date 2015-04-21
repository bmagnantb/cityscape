var request = require('request')
var Promise = require('bluebird')
var _ = require('lodash')

var connectMongo = require('./utils/connectMongo')
var weightVotes = require('./utils/weightVotes')
var ParseClass = require('./utils/ParseClass')


module.exports = vote


function vote(req, res) {

	var request = getRequestInfo(req)

	connectMongo(request)
		.then(getPhoto)
		.then(addVote)
		.then(newWeightedVote)
		.then(function(data) {
			res.send(data.match)
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

	var photoId = req.params.id
	var tags = req.params.tags ? req.params.tags.split(',') : []
	console.log(req.params)

	return {user: user, photoId: photoId, tags: tags}
}



function getPhoto(data) {

	var mongoPhotos = data.mongo.collection('photos')

	var promise = new Promise(function(resolve, reject) {
		mongoPhotos.findOne(
		{ photo_id: data.req.photoId },
		function(err, doc) {
			if (err != null) reject(err)
			else {
				data.match = doc
				resolve(data)
			}
		})
	})

	return promise
}



function addVote(data) {

	data.match.total_votes++
	data.match.user_votes.push(data.req.user)

	if (data.req.tags.length) {
		for (var i = 0, arr = data.req.tags, imax = arr.length; i < imax; i++) {
			Object.keys(data.match.tag_votes).indexOf(arr[i]) !== -1
				? data.match.tag_votes[arr[i]]++
				: data.match.tag_votes[arr[i]] = 1
		}
	}

	data.save = _.assign({}, data.match)

	return data
}



function newWeightedVote(data) {

	data.match.weighted_votes = weightVotes(data.match, data.req.tags)

	return data
}



function savePhoto(data) {

	var mongoPhotos = data.mongo.collection('photos')

	mongoPhotos.update(
		{ photo_id: data.save.photo_id },
		{ $set: data.save }
	)

	return data
}



// dev -- handle error
function handleError(err) {
	console.log(err)
}

