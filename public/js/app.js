"use strict"

// require files?
var { Parse } = require('parse')
var React = require('react')

window.onload = app

function app() {
		console.log('app time')

		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

		var { router } = require('./Router')

		router.run(function(Handler, state) {
				var { path, params } = state
				// if (user && (path === '/login' || path === '/register')) {
				// 		router.transitionTo('gallerynosearch', {page: 1})
				// 		return
				// }

				React.render(<Handler />, document.querySelector('#container'))
		})
}