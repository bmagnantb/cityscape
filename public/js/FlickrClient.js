;(function(exports) {

var $ = require('jquery')
var flickrOptions = require('./FlickrSettings').options

class FlickrClient {
		// register with Flickr for api-key
		// tags is array
		constructor(options) {
				this.options = options
		}

		request(settings) {
				var resp
				if (this.options instanceof Function) {
						resp = $.get('/photos', this.options(settings)())
						console.log(resp)
						return resp
				}
				resp = $.get('/photos', this.options)
				return resp
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


exports.FC = FlickrClient

exports.fcGallery = new FlickrClient(flickrOptions(gallerySettings))

exports.fcDetail = new FlickrClient(flickrOptions(detailSettings))

})(typeof module === 'object' ? module.exports : window)