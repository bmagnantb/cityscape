// require files?
var React = require('react')
var Router = require('react-router')
var routes = require('./Routes').routes

window.onload = app

function app() {
		console.log('app time')

		Router.run(routes, function(Handler, state) {
				var params = state.params
				React.render(<Handler params={params} />, document.getElementById('container'))
		})
}