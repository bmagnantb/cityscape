"use strict"

// require files?
import { Parse } from 'parse'
import React from 'react'
import Promise from 'bluebird'

import router from './router/router'
import Alt from './alt-app'
import giveAltContext from './giveAltContext'

window.onload = app

function app() {
	console.log('app time')

	Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

	var alt = new Alt()

	alt.bootstrap(document.querySelector('#alt').attributes[1].textContent)

	console.log(alt)

	router.run(function(Handler, state) {
		var { params } = state

		var HandlerWithContext = giveAltContext(Handler, alt)
		React.render(<HandlerWithContext params={params} />, document.querySelector('#container'))
	})
}