;(function(exports) {

var { alt } = require('../alt-app')
var { DetailClient } = require('../ServerClient')

class DetailActions {
		getDetail(flickrKey, photoId) {
				DetailClient.requestPhotos({api_key: flickrKey, photo_id: photoId})
				.then((data) => this.dispatch(data.photo))
		}

		resetState() {
				this.dispatch()
		}

		vote(photoId) {

		}
}


exports.detailActions = alt.createActions(DetailActions)

})(typeof module === 'object' ? module.exports : window)