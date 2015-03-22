;(function(exports) {

var React = require('react')
var { Link } = require('../react-router')
var { userStore } = require('../stores/UserStore')
var { userActions } = require('../actions/UserActions')

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
								<div className="user">
										<h6>{this.state.user.get('username')}</h6>
										<h6 onClick={this.logout}>Logout</h6>
								</div>
						)
				} else {
						userinfo = (
								<div className="user">
										<h6>
												<Link to="login">Login</Link>
										</h6>
										<h6>
												<Link to="register">Register</Link>
										</h6>
								</div>
						)
				}

				return (
						<header>
								<h1>CITYSCAPE</h1>
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