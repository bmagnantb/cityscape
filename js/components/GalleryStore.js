;(function(exports) {

var alt = require('../alt-app').alt

class GalleryStore {
		constructor() {
		}
}

exports.store = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)