;(function(exports) {

var $ = require('neo-zepto');
var FlickrGalleryURL = require('./FlickrSettings').GalleryURL

class FlickrClient {
		// register with Flickr for api-key
		// tags is array
		constructor(url) {
				this.url = url
		}

		getPhotos() {
				return $.get(this.url)
		}

		searchPhotos(search) {
				var query = `&tags=${search}`
				$.get(this.url+query)
				.then((data) => {
						if (data.stat === 'ok') {
								console.log(data.photos)
						} else {
								throw 'Flickr request failed'
						}
				})
		}
}

exports.FC = FlickrClient
exports.FCGallery = new FlickrClient(FlickrGalleryURL)

})(typeof module === 'object' ? module.exports : window)