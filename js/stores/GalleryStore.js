;(function(exports) {

var alt = require('../alt-app').alt
var galleryActions = require('../actions/GalleryActions').galleryActions

class GalleryStore {
		constructor() {
				this.photo = []
				this.page = null

				this.bindAction(galleryActions.getPhotos, this.onGetPhotos)
		}

		onGetPhotos(data) {
				this.photo = data.photos.photo
				this.page = data.photos.page
		}
}

exports.galleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)