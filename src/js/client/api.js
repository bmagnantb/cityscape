import request from 'superbird'
import _ from 'lodash'

var API_URL = 'http://localhost:3000/api'

export default class ServerApi {
	constructor(options) {
		this.options = _.merge(options, {format: 'json', nojsoncallback: '1'})
	}

	requestPhotos(settings) {
		console.log('settings', settings)
		return request.get(`${API_URL}/photos`).query(_.assign({}, this.options, settings)).end()
	}

	requestPhoto(settings, tags) {
		tags = tags ? `/${tags}` : ''
		return request.get(`${API_URL}/photo${tags}`).query(_.assign({}, this.options, settings)).end()
	}

	vote(photoId, user, tags) {
		var username
		user ? username = user.get('username') : username = undefined
		return request.post(`${API_URL}/${username}/photo/${photoId}/${tags}`).end()
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
		].join(','),
	per_page: '500',
	sort: 'relevance',
	tag_mode: 'all'
}

var detailSettings = {
	method: 'flickr.photos.getInfo',
	extras: [
		'url_m'
	].join(',')
}

export var GalleryApi = new ServerApi(gallerySettings)

export var DetailApi = new ServerApi(detailSettings)
