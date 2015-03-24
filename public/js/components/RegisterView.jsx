;(function(exports) {

var React = require('react')
var { Link } = require('../react-router')
var { userActions } = require('../actions/UserActions')
var { userStore } = require('../stores/UserStore')

class RegisterView extends React.Component {
		constructor() {
				super()
				this.state = userStore.getState()
		}

		componentWillMount() {
				userStore.listen(this.onChange.bind(this))
				console.log(this.context.router.getLocation())
				// .addChangeListener((change) => {
				// 	console.log(change)
				// 	console.log(arguments)
				// })
		}

		componentWillUnmount() {
				userStore.unlisten(this.onChange.bind(this))
		}

		onChange() {
				this.setState(userStore.getState())
		}

		render() {
				return (
						<main className="register">
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
				var username = React.findDOMNode(this.refs.username).value
				var email = React.findDOMNode(this.refs.email).value
				var pass = React.findDOMNode(this.refs.pass).value
				var pass2 = React.findDOMNode(this.refs.pass2).value
				if (pass === pass2) {
						userActions.register(username, pass, email, this.props.router)
				} else {
						console.log('passwords must match)')
				}
		}
}


exports.RegisterView = RegisterView

})(typeof module === 'object' ? module.exports : window)