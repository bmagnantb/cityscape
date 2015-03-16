;(function(exports) {

var alt = require('../alt-app').alt
var fcDetail = require('../FlickrClient').fcDetail

class DetailActions {
		getDetail(flickrKey, photoId) {
				fcDetail.request({api_key: flickrKey, photo_id: photoId})
				.then((data) => this.dispatch(data.photo))
		}

		resetState() {
				this.dispatch()
		}
}


exports.detailActions = alt.createActions(DetailActions)

})(typeof module === 'object' ? module.exports : window)