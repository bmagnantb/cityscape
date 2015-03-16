;(function(exports) {

var alt = require('../alt-app').alt
var fcGallery = require('../FlickrClient').fcGallery

class GalleryActions {
		getPhotos(flickrKey) {
				fcGallery.request({api_key: flickrKey})
				.then((data) => this.dispatch(data.photos))
		}
}

exports.galleryActions = alt.createActions(GalleryActions)

})(typeof module === 'object' ? module.exports : window)