class UserStore {
	constructor() {
		this.user = null

		this.bindListeners({
			setUser: [
				this.alt.getActions('user').current,
				this.alt.getActions('user').login,
				this.alt.getActions('user').logout,
				this.alt.getActions('user').register
			]
		})
	}

	setUser(user) {
		this.user = user
	}
}

export default { store: UserStore, name: 'user' }

