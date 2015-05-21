import React from 'react'
import { RouteHandler } from 'react-router'
import Header from './Header'
import userActions from '../actions/UserActions'

export default class AppView extends React.Component {

	static altDeps() {
		return 'altDeps'
	}

	componentWillMount() {
		userActions.current()
	}

	render() {
		return (
			<div className="app">
				<Header />
				<RouteHandler params={this.props.params} />
			</div>
		)
	}
}
