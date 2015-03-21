;(function(exports) {

var { alt } = require('../alt-app')
var { Parse } = require('parse')
var { userActions } = require('../actions/UserActions')

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