;(function(exports) {

var React = require('react')
var { RouteHandler } = require('react-router')
var { Header } = require('./Header')
var { userActions } = require('../actions/UserActions')

class AppView extends React.Component {

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


exports.AppView = AppView

})(typeof module === 'object' ? module.exports : window)