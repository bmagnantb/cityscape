;(function(exports) {

var React = require('react')
var Link = require('../react-router').Link
var userStore = require('../stores/UserStore').userStore
var userActions = require('../actions/UserActions').userActions

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
				if (this.state.user) {
						userinfo = (
								<div className="header-user">
										<h6>{this.state.user.get('username')}</h6>
										<h6 onClick={this.logout}>Logout</h6>
								</div>
						)
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

		logout() {
				userActions.logout()
		}
}


exports.Header = Header

})(typeof module === 'object' ? module.exports : window)