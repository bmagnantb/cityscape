var request = require('request')
var Parse = require('parse').Parse

var ParseClass = require('./utils/ParseClass')
var weightVotes = require('./utils/weightVotes')
var trimPhoto = require('./utils/trimPhoto')
var flickrRequestUrl = require('./utils/flickrRequestUrl')


module.exports = getDetail


function getDetail(req, res) {

	var url = flickrRequestUrl(req.query)

	request(url, function(err, resp, body) {

		if (err != null) {
			console.log(err)
			res.send(err)
			return
		}

		var flickrResponse = trimPhoto(JSON.parse(body))

		getDbMatch(flickrResponse, req.params)
			.then(mergeDbData)
			.then(calcWeightedVotes)
			.then(function(data) {
				res.send(data.flickr)
				return data
			})
			.then(savePhoto)
			.catch(handleError)
	})
}



function getDbMatch(flickrResponse, reqParams) {

	var query = new Parse.Query('Photo')

	query.equalTo('photo_id', flickrResponse.photo_id)

	var promise = new Promise(function(resolve, reject) {
		query.first({
			success: function(result) {
				resolve({flickr: flickrResponse, parseDb: result, req: reqParams})
			},
			error: function(err) {
				reject(err)
			}
		})
	})

	return promise
}



function mergeDbData(data) {

	if (data.parseDb) {
		data.parseDb.set(data.flickr)
		data.flickr = data.parseDb.toJSON()
	}
	else {
		data.flickr.total_votes = 0
		data.flickr.user_votes = []
		data.flickr.tag_votes = {}

		data.parseDb = new ParseClass.Photo(data.flickr)
	}

	return data
}



function calcWeightedVotes(data) {

	if (!data.req.tags) data.req.tags = []

	data.flickr.weighted_votes = weightVotes(data.flickr, data.req.tags)

	return data

}



function savePhoto(data) {

	data.parseDb.save({
		error: handleError
	})

	return data
}



function handleError(err) {
	console.log(err)
}