;(function(exports) {

var $ = require('jquery')
var flickrOptions = require('./FlickrSettings').options
var { Parse } = require('parse')

class ServerClient {
		constructor(options) {
				this.options = options
		}

		requestPhotos(settings, user) {
				console.log(user)
				var username
				user ? username = `${user.get('username')}/` : username = ''
				if (this.options instanceof Function) {
						return $.get(`/${username}photos`, this.options(settings)())
				}
				return $.get(`/${username}photos`, this.options)
		}

		vote(photoId, user) {
				var username
				if (!user) {
						console.log('user not logged in')
						return
				}
				user.get('emailVerified') ? username = user.get('username') : username = undefined
				return $.post(`/${username}/photo/${photoId}`)
		}
}

// settings for Flickr url maker
var gallerySettings = {
		method: 'flickr.photos.search',
		content_type: '1',
		extras: [
				'url_m',
				'owner_name'
		],
		per_page: '30',
		sort: 'relevance',
		tag_mode: 'all',
		tags: [
				'skyline',
				'city',
				'buildings'
		]
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