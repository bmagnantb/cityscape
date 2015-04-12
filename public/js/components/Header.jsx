;(function(exports) {

var React = require('react')
var { Link } = require('../../../modules_other/react-router')
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
		userStore.unlisten(this.onUserChange)
	}

	onUserChange() {
		this.setState(userStore.getState())
	}

	render() {
		var userinfo
		if (this.state.user) {
			userinfo = (
				<div className="user">
					<h6 className="username">{this.state.user.get('username')}</h6>
					<h6 className="logout" onClick={this._logout.bind(this)}>(logout)</h6>
				</div>
			)
		} else {
			userinfo = (
				<div className="user">
					<h6>
						<Link to="login">(login)</Link>
					</h6>
					<h6>
						<Link to="register">(register)</Link>
					</h6>
				</div>
			)
		}

		return (
			<header>
				<h1><Link to="gallerynosearch" params={{page: 1}}>CITYSCAPE</Link></h1>
				{userinfo}
			</header>
		)
	}

	_logout() {
		userActions.logout()
	}
}


exports.Header = Header

})(typeof module === 'object' ? module.exports : window)