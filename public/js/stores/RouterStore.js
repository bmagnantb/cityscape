;(function(exports) {

var { alt } = require('../alt-app')
var { routerActions } = require('../actions/RouterActions')

class RouterStore {
		constructor() {
				this.path = ''
				this.params = {
						page: 1
				}

				this.bindListeners({
						pathChange: routerActions.pathChange,
						paramsChange: routerActions.paramsChange
				})
		}

		pathChange(path) {
				this.path = path
		}

		paramsChange(params) {
				this.params = params
				if (!this.params.page) this.params.page = 1
		}
}


exports.routerStore = alt.createStore(RouterStore)

})(typeof module === 'object' ? module.exports : window)