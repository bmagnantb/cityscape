;(function(exports) {

var alt = require('../alt-app').alt
var SkylinesFC = require('../FlickrClient').FCGallery

class GalleryActions {
		getPhotos() {
				SkylinesFC.getPhotos()
				.then((data) => this.dispatch(data))
		}
}

exports.galleryActions = alt.createActions(GalleryActions)

})(typeof module === 'object' ? module.exports : window)