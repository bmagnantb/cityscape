;(function(exports) {

var React = require('react')
var Link = require('react-router').Link
var userStore = require('../stores/UserStore').userStore

class Header extends React.Component {
		constructor() {
				super()
				this.state = userStore.getState()
		}

		componentWillMount() {
				userStore.listen(this.onUserChange.bind(this))
		}

		componentWillUnmount() {
				userStore.listen(this.onUserChange.bind(this))
		}

		onUserChange() {
				this.setState(userStore.getState())
		}

		render() {
				var userinfo
				console.log(this.state)
				if (this.state.user) {
						userinfo = <h6 className="header-user">{this.state.user.get('username')}</h6>
				} else {
						userinfo = (
								<div className="header-user">
										<Link to="login">
												<h6>Login</h6>
										</Link>
										<Link to="register">
												<h6>Register</h6>
										</Link>
								</div>
						)
				}

				return (
						<header>
								<h1>SKYLINES</h1>
								{userinfo}
						</header>
				)
		}
}


exports.Header = Header

})(typeof module === 'object' ? module.exports : window)