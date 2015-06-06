import React from 'react'
import { Link } from 'react-router'

import AutobindComponent from './AutobindComponent'

export default class LoginView extends AutobindComponent {

	constructor(props, context) {
		super()

		this._userStore = context.alt.getStore('user')
		this._userActions = context.alt.getActions('user')

		this._bind('_login')
	}

	componentDidMount() {
		this.setState(this._userStore.getState())
	}

	render() {
		return (
			<main className="login">
				<h4>Login</h4>
				<form onSubmit={this._login}>
					<input type="username" ref="username" placeholder="username" />
					<input type="password" ref="password" placeholder="password" />
					<button>Submit</button>
				</form>
				<Link to="register">Create an account</Link>
			</main>
		)
	}

	_login(e) {
		e.preventDefault()
		this._userActions.login(
			React.findDOMNode(this.refs.username).value,
			React.findDOMNode(this.refs.password).value,
			this.context.router
		)
	}
}

LoginView.contextTypes = {
	router: React.PropTypes.func.isRequired,
	alt: React.PropTypes.object.isRequired
}
