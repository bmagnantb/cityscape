import alt from '../alt-app'
import Parse from 'parse'
import userActions from '../actions/UserActions'

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

export default alt.createStore(UserStore)
