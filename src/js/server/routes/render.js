import fs from 'fs'

import React from 'react'
import Router from 'react-router'
import _ from 'lodash'
import Iso from 'iso'
import Bluebird from 'bluebird'

import routes from '../../client/router/routes'
import AltApp from '../../client/alt-app'
import AltContext from '../../client/components/AltContext'
import EventEmitter from 'nano-event-emitter'


// get template for rendering React.renderToString result into a full html page
var template
fs.readFile(__dirname + '/../index.html', (err, buffer) => {
	if (err) throw err
	template = _.template(buffer.toString())
})

export default function render(req, res) {
	// create router with request path for location
	// onAbort function allows redirects to occur on the server
	var router = Router.create({
		routes,
		location: req.path,
		onAbort: (abortReason) => {
			if (abortReason.constructor.name === 'Redirect') {
				const {to, params, query} = abortReason
				const path = router.makePath(to, params, query)
				res.redirect(path)
				return
			}
		}
	})

	// run router -- location set via router creation
	router.run((Handler, state) => {

		// create alt instance unique to request
		var alt = new AltApp()

		// add event emitter to alt to listen for async actions
		alt.dataEmitter = new EventEmitter()

		// track async actions
		var actionRequests = []
		alt.dataEmitter.on('asyncAction', (promise) => {
			actionRequests.push(promise)
		})

		// renderToString is sync -- 1st render kicks off async actions but does not contain data from them
		React.renderToString(<AltContext alt={alt} childComponent={Handler} />)

		Bluebird.all(actionRequests).then(() => {
			// re-render with populated stores
			var content = React.renderToString(<AltContext alt={alt} childComponent={Handler} />)

			// create iso instance for sending alt's store data to client
			var iso = new Iso()
			iso.add('', alt.takeSnapshot())

			// render from template -- include base server url for serving static files
			var html = template({content, staticUrl: process.env.SERVER_URL, iso: iso.render()})
			res.send(html)
		})
	})
}