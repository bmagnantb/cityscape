"use strict"

// require files?
var { Parse } = require('parse')
var React = require('react')

window.onload = app

function app() {
		console.log('app time')

		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

		var user = Parse.User.current() || ''

		var router = require('./Router').router

		router.run(function(Handler, state) {
				var { path, params } = state
				if (user && (path === '/login' || path === '/register')) {
						router.transitionTo('/gallery')
						return
				}

				React.render(<Handler params={params} router={this} />, document.getElementById('container'))
		})
}