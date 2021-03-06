import React from 'react'
import { Link } from 'react-router'

import AutobindComponent from './AutobindComponent'

export default class RegisterView extends AutobindComponent {

	constructor(props, context) {
		super()

		this._userStore = context.alt.getStore('user')
		this._userActions = context.alt.getActions('user')

		this._bind('_register')
	}

	componentDidMount() {
		this.setState(this._userStore.getState())
	}

	render() {
		return (
			<main className="register">
				<h4>Register</h4>
				<form onSubmit={this._register}>
					<input type="text" ref="username" placeholder="username" />
					<input type="email" ref="email" placeholder="email" />
					<input type="password" ref="pass" placeholder="password" />
					<input type="password" ref="pass2" placeholder="confirm password" />
					<button>Submit</button>
				</form>
				<Link to="login">Already have an account?</Link>
			</main>
		)
	}

	_register(e) {
		e.preventDefault()
		var username = React.findDOMNode(this.refs.username).value
		var email = React.findDOMNode(this.refs.email).value
		var pass = React.findDOMNode(this.refs.pass).value
		var pass2 = React.findDOMNode(this.refs.pass2).value
		if (pass === pass2) {
			this._userActions.register(username, pass, email, this.context.router)
		} else {
			console.log('passwords must match)')
		}
	}
}

RegisterView.contextTypes = {
	router: React.PropTypes.func.isRequired,
	alt: React.PropTypes.object.isRequired
}
