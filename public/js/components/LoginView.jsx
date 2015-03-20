;(function(exports) {

var React = require('react')
var Parse = require('Parse')
var Link = require('../react-router').Link
var userActions = require('../actions/UserActions').userActions
var userStore = require('../stores/UserStore').userStore

class LoginView extends React.Component {
		constructor() {
				super()
				this.state = userStore.getState()

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
						this.props.router
				)
		}
}


exports.LoginView = LoginView

})(typeof module === 'object' ? module.exports : window)