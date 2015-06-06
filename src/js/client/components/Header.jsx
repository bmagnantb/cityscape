import React from 'react'
import { Link } from 'react-router'

import AutobindComponent from './AutobindComponent'

class Header extends AutobindComponent {

	constructor(props, context) {
		super(props, context)

		this._userActions = context.alt.getActions('user')

		this._bind('_logout')
	}

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
		this._userActions.logout()
	}

	_getUserMarkup() {
		return this.props.user
			? (
				<div className="user">
					<h6 className="username">{this.props.user.get('username')}</h6>
					<h6 className="logout" onClick={this._logout}>(logout)</h6>
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

Header.contextTypes = {
	alt: React.PropTypes.object.isRequired
}

export default Header
