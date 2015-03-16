"use strict"

// require files?
var Parse = require('parse').Parse
var React = require('react')
var GalleryView = require('./components/GalleryView').GalleryView

window.onload = app

function app() {
		console.log('app time')

		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")
		var flickrKey = 'eeacdafae711c1ae98c0342fa323569a'

		var router = require('./Router').router

		router.run(function(Handler, state) {
				var user = Parse.User.current()
				var { params, path } = state
				if (user && (path === '/login' || path === '/register')) {
						router.transitionTo('home')
						return
				}
				React.render(<Handler params={params} router={this} flickrKey={flickrKey} />, document.getElementById('container'))
		})
}