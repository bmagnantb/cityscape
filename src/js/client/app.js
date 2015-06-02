"use strict"

// require files?
import { Parse } from 'parse'
import React from 'react'
import Promise from 'bluebird'
import Iso from 'iso'
import Router from 'react-router'

import routes from './router/routes'
import AltApp from './alt-app'
import AltContext from './components/AltContext'

window.onload = app

function app() {
	console.log('app time')

	Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")

	var alt = new AltApp()

	Iso.bootstrap((state, meta, node) => {

		alt.bootstrap(state)

		Router.run(routes, Router.HistoryLocation, function(Handler, state) {
			var { params } = state

			React.render(<AltContext alt={alt} childComponent={Handler} />, document.querySelector('#container'))
		})
	})
}