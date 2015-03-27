;(function(exports) {

var $ = require('jquery')
var flickrOptions = require('./FlickrSettings').options

class ServerClient {
		constructor(options) {
				this.options = options
		}

		requestPhotos(settings) {
				return $.get(`/photos`, this.options(settings)())
		}

		requestPhoto(settings, votes) {
				!votes ? votes = '' : votes = `/${votes}`
				return $.get(`/photo${votes}`, this.options(settings)())
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

exports.GalleryClient = new ServerClient(flickrOptions(gallerySettings))

exports.DetailClient = new ServerClient(flickrOptions(detailSettings))

})(typeof module === 'object' ? module.exports : window)