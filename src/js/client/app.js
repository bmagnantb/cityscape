"use strict"

// require files?
import Parse from 'parse'
import React from 'react'
import router from './router/Router'

window.onload = app

function app() {
	console.log('app time')

	Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

	router.run(function(Handler, state) {
		var { params } = state

		React.render(<Handler params={params} />, document.querySelector('#container'))
	})
}