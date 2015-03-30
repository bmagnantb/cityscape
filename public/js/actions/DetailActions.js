;(function(exports) {

var { alt } = require('../alt-app')
var { DetailClient } = require('../ServerFlickrClient')

class DetailActions {
		getDetail(photoId) {
				DetailClient.requestPhoto({photo_id: photoId})
				.then((data) => this.dispatch(data.photo))
		}
}


exports.detailActions = alt.createActions(DetailActions)

})(typeof module === 'object' ? module.exports : window)