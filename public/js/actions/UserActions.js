;(function(exports) {

var alt = require('../alt-app').alt
var Parse = require('parse').Parse

class UserActions {
		current() {
				var user = Parse.User.current()
				this.dispatch(user)
		}

		login(username, password, router) {
				console.log(username, password, router)
				Parse.User.logIn(username, password, {
						success: (user) => {
								this.dispatch(user)
								router.transitionTo('home')
						},
						error: (user, error) => console.log(error)
				})
		}

		logout() {
				Parse.User.logOut()
				this.dispatch(Parse.User.current())
		}

		register(username, password, email, router) {
				var user = new Parse.User()
				user.set('username', username)
				user.set('password', password)
				user.set('email', email)
				user.signUp(null, {
						success: (user) => {
							this.dispatch(user)
							router.transitionTo('home')
						},
						error: (user, error) => console.log(error)
				})
		}

		resetPassword(email) {
				Parse.User.requestPasswordReset(email, {
						success: () => {
								router.transitionTo('passemailsent')
						},
						error: () => console.log(error)
				})
		}
}

exports.userActions = alt.createActions(UserActions)

})(typeof module === 'object' ? module.exports : window)