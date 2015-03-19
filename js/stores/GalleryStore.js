;(function(exports) {

var alt = require('../alt-app').alt
var galleryActions = require('../actions/GalleryActions').galleryActions

class GalleryStore {
		constructor() {
				this.photo = []
				this.page = null
				this.tags = []
				this.extras = []
				this.photoIds = []

				this.bindListeners({
						getPhotos: galleryActions.getPhotos,
						setTags: galleryActions.setTags
				})
		}

		getPhotos(data) {
				for (var key in data) {
						this[key] = data[key]
				}
				this.photoIds = []
				data.photo.forEach((val) => {
						this.photoIds.push(val)
				})
		}

		setTags(tags) {
				tags.forEach((val) => {
						if (val.indexOf('-') === 0) {
								this.tags.splice(this.tags.indexOf(val.slice(1)), 1)
						} else {
								this.tags.push(val)
						}
				})
		}

		getVotes() {

		}
}

exports.GalleryStore = GalleryStore
exports.galleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)