;(function(exports) {

var React = require('react')
var RouteHandler = require('react-router').RouteHandler
var Header = require('./Header').Header
var Footer = require('./Footer').Footer

class AppView extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<div>
								<Header />
								<RouteHandler />
								<Footer />
						</div>
				)
		}
}


exports.AppView = AppView

})(typeof module === 'object' ? module.exports : window)