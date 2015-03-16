;(function(exports) {

var alt = require('../alt-app').alt
var detailActions = require('../actions/DetailActions').detailActions

class DetailStore {
		constructor() {
				this.onResetState()

				this.bindAction(detailActions.getDetail, this.onGetInfo)
				this.bindAction(detailActions.resetState, this.onResetState)
		}

		onGetInfo(data) {
				this.photo = data
				this.photoUrl = function(size) {
						return `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_${size}.${data.originalformat ? data.originalformat : 'jpg'}`
				}
		}

		onResetState() {
				this.photo = null
				this.photoUrl = function() {return ''}
		}
}


exports.detailStore = alt.createStore(DetailStore)

})(typeof module === 'object' ? module.exports : window)