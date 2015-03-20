;(function(exports) {

var alt = require('../alt-app').alt
var Parse = require('parse').Parse
var userActions = require('../actions/UserActions').userActions

class UserStore {
		constructor() {
				this.user = null

				this.bindListeners({
						setUser: [userActions.current, userActions.login, userActions.logout, userActions.register]
				})
		}

		setUser(user) {
				this.user = user
		}
}


exports.UserStore = UserStore
exports.userStore = alt.createStore(UserStore)

})(typeof module === 'object' ? module.exports : window)