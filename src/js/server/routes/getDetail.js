import request from 'request'
import Promise from 'bluebird'
import _ from 'lodash'

import connectMongo from '../utils/connectMongo'
import weightVotes from '../utils/weightVotes'
import trimPhoto from '../utils/trimPhoto'
import flickrRequestUrl from '../utils/flickrRequestUrl'

export default function getDetail(req, res) {

	var detailReq = new Promise(function(resolve, reject) {
		var url = flickrRequestUrl(req.query)

		request(url, function(err, resp, body) {
			if (err) {
				res.send(err)
				reject()
			}
			else resolve(trimPhoto(JSON.parse(body)))
		})
	})

	var photoSizesReq = new Promise(function(resolve, reject) {
		var query = _.pick(req.query, [
			'photo_id',
			'format',
			'nojsoncallback'
		])
		query.method = 'flickr.photos.getSizes'

		var url = flickrRequestUrl(query)
		request(url, function(err, resp, body) {
			resolve(JSON.parse(body))
		})
	})

	Promise.join(detailReq, photoSizesReq, function(detail, photoSizes) {
		var flickrResponse = detail
		flickrResponse.maxSize = photoSizes.sizes.size.reduce((prev, current) => {
			return +current.width < 1025
				? +current.width > +prev.width
					? current
					: prev
				: prev
		})

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
	throw err
}