import request from 'request'
import Promise from 'bluebird'
import _ from 'lodash'

import connectMongo from '../utils/connectMongo'
import weightVotes from '../utils/weightVotes'
import trimPhoto from '../utils/trimPhoto'
import flickrRequestUrl from '../utils/flickrRequestUrl'

export default function getDetail(req, res) {

	console.log(req.path)

	var url = flickrRequestUrl(req.query)

	request(url, function(err, resp, body) {
		if (err != null) {
			console.log(err)
			res.send(err)
			return
		}

		var flickrResponse = trimPhoto(JSON.parse(body))

		connectMongo(req.params, flickrResponse)
			.then(getDbMatch)
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

function getDbMatch(data) {
	var mongoPhotos = data.mongo.collection('photos')
	var promise = new Promise(function(resolve, reject) {
		mongoPhotos.findOne(
			{ photo_id: data.flickr.photo_id },
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

function mergeDbData(data) {
	if (data.match) {
		data.flickr.total_votes = data.match.total_votes
		data.flickr.user_votes = data.match.user_votes
		data.flickr.tag_votes = data.match.tag_votes
	}
	else {
		data.flickr.total_votes = 0
		data.flickr.user_votes = []
		data.flickr.tag_votes = {}
	}

	data.match = _.assign({}, data.flickr)
	return data
}

function calcWeightedVotes(data) {
	if (!data.req.tags) data.req.tags = []
	else data.req.tags = data.req.tags.split(',')

	data.flickr.weighted_votes = weightVotes(data.flickr, data.req.tags)

	return data

}

function savePhoto(data) {
	var mongoPhotos = data.mongo.collection('photos')
	mongoPhotos.update(
		{ photo_id: data.match.photo_id },
		{ $set: data.match },
		{ upsert: true }
	)

	return data
}

function handleError(err) {
	console.log(err)
}