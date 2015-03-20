;(function(exports) {

var alt = require('../alt-app').alt
var fcGallery = require('../FlickrClient').fcGallery

class GalleryActions {
		constructor() {
				this.generateActions('setTags')
		}

		getPhotos(options) {
				console.log(options)
				fcGallery.request(options)
				.then((data) => this.dispatch(data.photos))
		}
}


exports.GalleryActions = GalleryActions
exports.galleryActions = alt.createActions(GalleryActions)

})(typeof module === 'object' ? module.exports : window)