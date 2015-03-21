;(function(exports) {

var React = require('react')
var { RouteHandler } = require('../react-router')
var { Header } = require('./Header')
var { Footer } = require('./Footer')
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
									<RouteHandler {...this.props} />
								<Footer />
						</div>
				)
		}
}


exports.AppView = AppView

})(typeof module === 'object' ? module.exports : window)