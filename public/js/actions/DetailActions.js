;(function(exports) {

var { alt } = require('../alt-app')
var { DetailClient } = require('../ServerFlickrClient')

class DetailActions {
		getDetail(photoId, votes) {
				DetailClient.requestPhoto({photo_id: photoId}, votes)
				.then((data) => this.dispatch(data.photo))
		}

		vote(photoId, user, tags) {
				DetailClient.vote(photoId, user, tags)
				.then((resp) => this.dispatch(resp))
		}
}


exports.detailActions = alt.createActions(DetailActions)

})(typeof module === 'object' ? module.exports : window)