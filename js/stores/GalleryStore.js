;(function(exports) {

var alt = require('../alt-app').alt
var GalleryActions = require('../actions/GalleryActions').GalleryActions

class GalleryStore {
		constructor() {
				this.photo = []
				this.page = null

				this.bindAction(GalleryActions.getPhotos, this.onGetPhotos)
		}

		onGetPhotos(data) {
				console.log(data)
				this.photo = data.photos.photo
				this.page = data.photos.page
		}
}

exports.GalleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)