;(function(exports) {

var React = require('react')
var Link = require('../react-router').Link
var userActions = require('../actions/UserActions').userActions
var userStore = require('../stores/UserStore').userStore

class RegisterView extends React.Component {
		constructor() {
				super()
				this.state = userStore.getState()
		}

		componentWillMount() {
				userStore.listen(this.onChange.bind(this))
		}

		componentWillUnmount() {
				userStore.unlisten(this.onChange.bind(this))
		}

		onChange() {
				this.setState(userStore.getState())
		}

		render() {
				return (
						<main>
								<h3>Register</h3>
								<form onSubmit={this.register.bind(this)}>
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

		register(e) {
				e.preventDefault()
				var username = this.refs.username.getDOMNode().value
				var email = this.refs.email.getDOMNode().value
				var pass = this.refs.pass.getDOMNode().value
				var pass2 = this.refs.pass2.getDOMNode().value
				if (pass === pass2) {
						userActions.register(username, pass, email, this.props.router)
				} else {
						console.log('passwords must match)')
				}
		}
}


exports.RegisterView = RegisterView

})(typeof module === 'object' ? module.exports : window)