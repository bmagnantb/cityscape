import fs from 'fs'

import React from 'react'
import Router from 'react-router'
import _ from 'lodash'
import Iso from 'iso'

import routes from '../../client/router/routes'
import AltApp from '../../client/alt-app'
import giveAltContext from '../../client/giveAltContext'
import DataEventEmitter from '../utils/DataEventEmitter'

var template

fs.readFile(__dirname + '/../index.html', (err, buffer) => {
	if (err) console.log(err)
	template = _.template(buffer.toString())
})

export default function render(req, res) {
	var router = Router.create({
		routes,
		location: req.path,
		onAbort: (abortReason) => {
			if (abortReason.constructor.name === 'Redirect') {
				const {to, params, query} = abortReason;
				const path = router.makePath(to, params, query);
				res.redirect(path);
				return;
			}
		}
	})

	router.run((Handler, state) => {

		var alt = new AltApp()
		var iso = new Iso()
		var actionRequests = []
		var completedRequests = 0

		var HandlerWithContext = giveAltContext(Handler, alt)

		alt.dispatcher.register((action) => {
			if (action.data && action.data.request) {
				actionRequests.push(action)
			}
		})

		DataEventEmitter.on('storeData', () => {
			completedRequests++
			if (actionRequests.length === completedRequests) {
				console.log('router state params 2', state.params)
				DataEventEmitter.off('storeData')
				var content = React.renderToString(<HandlerWithContext />)
				iso.add('', alt.takeSnapshot())
				var html = template({content, staticUrl: process.env.SERVER_URL, iso: iso.render()})
				res.send(html)
			}
		})

		console.log('router state params', state.params)
		React.renderToString(<HandlerWithContext />)
	})
}