import request from 'superagent-bluebird-promise'
import _ from 'lodash'

var API_URL = process.env.API_URL

export default class ServerApi {
	constructor(options) {
		this.options = _.merge(options, {format: 'json', nojsoncallback: '1'})
	}

	requestPhotos(settings) {
		return request.get(`${API_URL}/photos`, _.assign({}, this.options, settings))
	}

	requestPhoto(settings, tags) {
		tags = tags ? `/${tags}` : ''
		return request.get(`${API_URL}/photo${tags}`, _.assign({}, this.options, settings))
	}

	vote(photoId, user, tags) {
		var username
		user ? username = user.get('username') : username = undefined
		return request.post(`${API_URL}/${username}/photo/${photoId}/${tags}`)
	}
}

// settings for Flickr url maker
var gallerySettings = {
	method: 'flickr.photos.search',
	content_type: '1',
	extras: [
		'url_m',
		'owner_name',
		'date_upload'
	],
	per_page: '500',
	sort: 'relevance',
	tag_mode: 'all'
}

var detailSettings = {
	method: 'flickr.photos.getInfo',
	extras: [
		'url_m'
	]
}

export var GalleryApi = new ServerApi(gallerySettings)

export var DetailApi = new ServerApi(detailSettings)
