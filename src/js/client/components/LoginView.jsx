import React from 'react'
import { Parse } from 'Parse'
import { Link } from 'react-router'
import userActions from '../actions/UserActions'
import userStore from '../stores/UserStore'

export default class LoginView extends React.Component {

	componentWillMount() {
		this.setState(userStore.getState())
	}

	render() {
		return (
			<main className="login">
				<h4>Login</h4>
				<form onSubmit={this.login.bind(this)}>
					<input type="username" ref="username" placeholder="username" />
					<input type="password" ref="password" placeholder="password" />
					<button>Submit</button>
				</form>
				<Link to="register">Create an account</Link>
			</main>
		)
	}

	login(e) {
		e.preventDefault()
		userActions.login(
			React.findDOMNode(this.refs.username).value,
			React.findDOMNode(this.refs.password).value,
			this.context.router
		)
	}
}

LoginView.contextTypes = {
	router: React.PropTypes.func.isRequired
}
