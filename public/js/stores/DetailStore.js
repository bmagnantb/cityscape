;(function(exports) {

var { alt } = require('../alt-app')
var { detailActions } = require('../actions/DetailActions')
var { galleryActions } = require('../actions/GalleryActions')

class DetailStore {
		constructor() {
				this.bindListeners({
						getInfo: detailActions.getDetail,
						vote: galleryActions.vote
				})
		}

		getInfo(data) {
				this[data.photo_id] = data
				this[data.photo_id]._photoUrl = function(size) {
						return `https://farm${data.farm}.staticflickr.com/${data.server}/${data.photo_id}_${data.secret}_${size}.${data.originalformat ? data.originalformat : 'jpg'}`
				}
				this[data.photo_id]._ownerUrl = `https://www.flickr.com/people/${data.owner}`
		}

		vote(data) {
				console.log(data)
				var photo = this[data.photo_id]
				photo.total_votes = data.total_votes
				photo.user_votes = data.user_votes
				photo.tag_votes = data.tag_votes
				photo.weighted_votes =  data.weighted_votes
		}
}


exports.detailStore = alt.createStore(DetailStore)

})(typeof module === 'object' ? module.exports : window)