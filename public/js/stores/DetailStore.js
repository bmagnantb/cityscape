;(function(exports) {

var { alt } = require('../alt-app')
var { detailActions } = require('../actions/DetailActions')
var { galleryActions } = require('../actions/GalleryActions')

class DetailStore {
		constructor() {
				this.bindListeners({
						getInfo: detailActions.getDetail,
				})
		}

		getInfo(data) {
				this[data.id] = data
				this[data.id].photoUrl = function(size) {
						return `https://farm${data.farm}.staticflickr.com/${data.server}/${data.id}_${data.secret}_${size}.${data.originalformat ? data.originalformat : 'jpg'}`
				}
		}
}


exports.DetailStore = DetailStore
exports.detailStore = alt.createStore(DetailStore)

})(typeof module === 'object' ? module.exports : window)