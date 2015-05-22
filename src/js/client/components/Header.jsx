import React from 'react'
import { Link } from 'react-router'

export default class Header extends React.Component {

	render() {
		var userinfo = this._getUserMarkup()

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

	_getUserMarkup() {
		return this.props.user
			? (
				<div className="user">
					<h6 className="username">{this.props.user.get('username')}</h6>
					<h6 className="logout" onClick={this._logout.bind(this)}>(logout)</h6>
				</div>
			)
			: (
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
}
