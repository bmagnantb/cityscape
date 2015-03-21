"use strict"

// require files?
var { Parse } = require('parse')
var React = require('react')
var { GalleryView } = require('./components/GalleryView')

window.onload = app

function app() {
		console.log('app time')

		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

		var router = require('./Router').router

		router.run(function(Handler, state) {
				var user = Parse.User.current() || ''
				var { params, path } = state
				if (user && (path === '/login' || path === '/register')) {
						router.transitionTo('home')
						return
				}
				React.render(<Handler params={params} router={this} />, document.getElementById('container'))
		})
}