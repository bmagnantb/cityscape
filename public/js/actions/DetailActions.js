;(function(exports) {

var { alt } = require('../alt-app')
var { DetailClient } = require('../ServerClient')

class DetailActions {
	getDetail(photoId, tags) {
		DetailClient.requestPhoto({photo_id: photoId,}, tags)
		.then((data) => {
			console.log(data)
			this.dispatch(data)
		})
	}
}


exports.detailActions = alt.createActions(DetailActions)

})(typeof module === 'object' ? module.exports : window)