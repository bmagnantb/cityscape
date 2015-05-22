import React from 'react'
import { RouteHandler } from 'react-router'

import Header from './Header'

class AppView extends React.Component {

	componentWillMount() {
		this._userStore = this.context.alt.getStore('user')
		this._userActions = this.context.alt.getActions('user')

		this._userStore.listen(this._setUser.bind(this))
		this._userActions.current()
	}

	_setUser() {
		this.setState(this._userStore.getState())
	}

	render() {
		return (
			<div className="app">
				<Header user={this.state.user} />
				<RouteHandler params={this.props.params} user={this.state.user} />
			</div>
		)
	}
}

AppView.contextTypes = {
	alt: React.PropTypes.object.isRequired
}

export default AppView
