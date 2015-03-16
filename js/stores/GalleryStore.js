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
				for (var key in data) {
						this[key] = data[key]
				}
		}
}

exports.galleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)