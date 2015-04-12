"use strict"

// require files?
var { Parse } = require('parse')
var React = require('react')
var { router } = require('./router/Router')

window.onload = app

function app() {
		console.log('app time')

		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

		router.run(function(Handler, state) {
				var { path, params } = state

				React.render(<Handler params={params} />, document.querySelector('#container'))
		})
}