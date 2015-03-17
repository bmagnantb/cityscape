;(function(exports) {

var $ = require('neo-zepto');
var flickrMakeUrl = require('./FlickrMakeUrl').flickrMakeUrl

class FlickrClient {
		// register with Flickr for api-key
		// tags is array
		constructor(url) {
				this.url = url
		}

		request(settings) {
				if (this.url instanceof Function) {
						return $.get(this.url(settings)())
				}
				return $.get(this.url)
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

exports.fcGallery = new FlickrClient(flickrMakeUrl(gallerySettings))

exports.fcDetail = new FlickrClient(flickrMakeUrl(detailSettings))

})(typeof module === 'object' ? module.exports : window)