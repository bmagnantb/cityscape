;(function(exports) {

var React = require('react')
var { RouteHandler } = require('../../../modules_other/react-router')
var { Header } = require('./Header')
var { userActions } = require('../actions/UserActions')

class AppView extends React.Component {
		constructor() {
				super()
				this.state = {}
				userActions.current()
		}

		render() {
				return (
						<div className="app">
								<Header />
								<RouteHandler />
						</div>
				)
		}
}


exports.AppView = AppView

})(typeof module === 'object' ? module.exports : window)