import request from 'request'
import Promise from 'bluebird'
import _ from 'lodash'

import connectMongo from '../utils/connectMongo'
import weightVotes from '../utils/weightVotes'
import trimPhoto from '../utils/trimPhoto'
import flickrRequestUrl from '../utils/flickrRequestUrl'

export default function getDetail(req, res) {

	// get image data from flickr
	var detailReq = new Promise(function(resolve, reject) {

		// produce flickr request url from query
		var url = flickrRequestUrl(req.query)

		request(url, function(err, resp, body) {
			if (err) {
				res.send(err)
				reject()
			}
			else resolve(trimPhoto(JSON.parse(body)))
		})
	})

	// get available photo sizes from flickr
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

		// find largest available photo size 1024px or smaller
		flickrResponse.maxSize = photoSizes.sizes.size.reduce((prev, current) => {
			return +current.width < 1025
				? +current.width > +prev.width
					? current
					: prev
				: prev
		})

		// retrieve upvoting data and send response
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

// find mongo entry for flickr photo
function getDbMatch(data) {
	var mongoPhotos = data.mongo.collection('photos')
	var promise = new Promise(function(resolve, reject) {
		mongoPhotos.findOne(
			{ photo_id: data.flickr.photo_id },
			function(err, doc) {
				if (err) reject(err)
				else {
					data.match = doc
					resolve(data)
			}
		})
	})

	return promise
}

// add mongo data to response from flickr, then copy flickr response with mongo data
// or initialize upvoting data and make copy
// copy is made for later saving to mongo without weighted votes
// weighted votes are produced per-request as they depend on client-side state (search terms)
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

// calculate weighted votes via active search terms
function calcWeightedVotes(data) {
	if (!data.req.tags) data.req.tags = []
	else data.req.tags = data.req.tags.split(',')

	data.flickr.weighted_votes = weightVotes(data.flickr, data.req.tags)

	return data

}

// save photo data to mongo
function savePhoto(data) {
	var mongoPhotos = data.mongo.collection('photos')
	mongoPhotos.update(
		{ photo_id: data.match.photo_id },
		{ $set: data.match },
		{ upsert: true }
	)

	return data
}

// throw errors in development
function handleError(err) {
	throw err
}