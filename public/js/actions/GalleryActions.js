;(function(exports) {

var { alt } = require('../alt-app')
var { GalleryClient } = require('../ServerFlickrClient')

class GalleryActions {
		constructor() {
				this.generateActions('isntLoading', 'cachedLoad', 'changePage')
		}

		getPhotos(params) {

				if (params.page) {
						params.page = Math.floor((params.page - 1) / 25) + 1
				}
				GalleryClient.requestPhotos(params)
				.then((data) => {
						data = data.photos
						var obj = { params, data }
						this.dispatch(obj)
				})
		}

		vote(photoId, user, tags) {
				GalleryClient.vote(photoId, user, tags)
				.then((resp) => this.dispatch(resp))
		}
}


exports.GalleryActions = GalleryActions
exports.galleryActions = alt.createActions(GalleryActions)

})(typeof module === 'object' ? module.exports : window)