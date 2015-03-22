;(function(exports) {

var { alt } = require('../alt-app')
var { GalleryClient } = require('../ServerClient')

class GalleryActions {
		constructor() {
				this.generateActions('setTags')
		}

		getPhotos(options) {
				GalleryClient.requestPhotos(options)
				.then((data) => this.dispatch(data.photos))
		}

		vote(photoId, user) {
				GalleryClient.vote(photoId, user)
				.then((resp) => this.dispatch(resp))
		}
}


exports.GalleryActions = GalleryActions
exports.galleryActions = alt.createActions(GalleryActions)

})(typeof module === 'object' ? module.exports : window)