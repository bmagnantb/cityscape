;(function(exports) {

var { alt } = require('../alt-app')
var { detailActions } = require('../actions/DetailActions')

class DetailStore {
		constructor() {
				this.resetState()


				this.bindListeners({
						getInfo: detailActions.getDetail,
						resetState: detailActions.resetState
				})
		}

		getInfo(data) {
				this.photo = data
				this.photoUrl = function(size) {
						return `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_${size}.${data.originalformat ? data.originalformat : 'jpg'}`
				}
		}

		resetState() {
				this.photo = null
				this.photoUrl = function() {return ''}
		}
}


exports.DetailStore = DetailStore
exports.detailStore = alt.createStore(DetailStore)

})(typeof module === 'object' ? module.exports : window)