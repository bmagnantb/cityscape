;(function(exports) {

var React = require('react')

class RegisterView extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<main>
								<h3>Register</h3>
								<form onSubmit={this.register.bind(this)}>
										<input type="text" ref="username" placeholder="username" />
										<input type="email" ref="email" placeholder="email" />
										<input type="password" ref="pass1" placeholder="password" />
										<input type="password" ref="pass2" placeholder="confirm password" />
										<button>Submit</button>
								</form>
						</main>
				)
		}

		register(e) {
				e.preventDefault()
				console.log(this.refs.username.getDOMNode().value,
						this.refs.email.getDOMNode().value,
						this.refs.pass1.getDOMNode().value,
						this.refs.pass2.getDOMNode().value
				)
		}
}


exports.RegisterView = RegisterView

})(typeof module === 'object' ? module.exports : window)