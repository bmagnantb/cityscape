;(function(exports) {

var $ = require('jquery')
var _ = require('lodash')

class ServerClient {
		constructor(options) {
				this.options = _.merge(options, {format: 'json', nojsoncallback: 1})
		}

		requestPhotos(settings) {
				return $.get(`/photos`, _.assign({}, this.options, settings))
		}

		requestPhoto(settings, tags) {
				tags = `/${tags}`
				return $.get(`/photo${tags}`, _.assign({}, this.options, settings))
		}

		vote(photoId, user, tags) {
				var username
				user ? username = user.get('username') : username = undefined
				return $.post(`/${username}/photo/${photoId}/${tags}`)
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


exports.ServerClient = ServerClient

exports.GalleryClient = new ServerClient(gallerySettings)

exports.DetailClient = new ServerClient(detailSettings)

})(typeof module === 'object' ? module.exports : window)