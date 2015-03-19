;(function(exports) {

var $ = require('zepto')
var Parse = require('Parse').Parse
var galleryActions = require('./actions/GalleryActions').galleryActions
var galleryStore = require('./stores/GalleryStore').galleryStore


class ParseClient {
		constructor() {
				this.user = Parse.user.current()
				galleryStore.listen
		}

		// takes array of photoIds
		getPhotoVotes(photoIds) {
				this.photos = new PhotoCollection(photoIds)
		}
}

class PhotoCollection extends Parse.Collection {
		constructor(photoIds) {
				this.model = PhotoModel
		}
}

class PhotoModel extends Parse.Object {
		constructor(photoId) {
				this.className = Photo
				this.photoId = photoId
		}
}


exports.ParseClient = ParseClient

})(typeof module === 'object' ? module.exports : window)