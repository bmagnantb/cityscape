;(function(exports) {

var { alt } = require('../alt-app')

class RouterActions {
		constructor() {
				this.generateActions('pathChange', 'paramsChange')
		}
}


exports.routerActions = alt.createActions(RouterActions)

})(typeof module === 'object' ? module.exports : window)