import React from 'react'
import { RouteHandler } from 'react-router'

import AutobindComponent from './AutobindComponent'

import Header from './Header'

export default class AppView extends AutobindComponent {

	constructor(props, context) {
		super(props, context)

		this._userStore = context.alt.getStore('user')
		this._userActions = context.alt.getActions('user')

		this.state = {}

		this._bind('_setUser')
	}

	componentDidMount() {
		this._userStore.listen(this._setUser)
		this._userActions.current()
	}

	componentWillUnmount() {
		this._userStore.unlisten(this._setUser)
	}

	_setUser() {
		this.setState(this._userStore.getState())
	}

	render() {
		return (
			<div className="app">
				<Header user={this.state.user} />
				<RouteHandler user={this.state.user} />
			</div>
		)
	}
}

AppView.contextTypes = {
	alt: React.PropTypes.object.isRequired
}
