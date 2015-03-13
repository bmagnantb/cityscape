;(function(exports) {

var React = require('react')

class LoginView extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<main>
								<h4>Login</h4>
								<form onSubmit={this.login.bind(this)}>
										<input type="text" ref="username" placeholder="username" />
										<input type="password" ref="password" placeholder="password" />
										<button>Submit</button>
								</form>
						</main>
				)
		}

		login(e) {
				e.preventDefault()
				console.log(this.refs.username.getDOMNode().value,
						this.refs.password.getDOMNode().value
				)
		}
}


exports.LoginView = LoginView

})(typeof module === 'object' ? module.exports : window)