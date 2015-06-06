import fs from 'fs'

import React from 'react'
import Router from 'react-router'
import _ from 'lodash'
import Iso from 'iso'
import Promise from 'bluebird'

import routes from '../../client/router/routes'
import AltApp from '../../client/alt-app'
import AltContext from '../../client/components/AltContext'
import DataEventEmitter from '../../client/actions/DataEventEmitter'

var template

fs.readFile(__dirname + '/../index.html', (err, buffer) => {
	if (err) throw err
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

		DataEventEmitter.on('asyncAction', (promise) => {
			actionRequests.push(promise)
		})

		React.renderToString(<AltContext alt={alt} childComponent={Handler} />)

		Promise.all(actionRequests).then(() => {
			var content = React.renderToString(<AltContext alt={alt} childComponent={Handler} />)
			iso.add('', alt.takeSnapshot())
			var html = template({content, staticUrl: process.env.SERVER_URL, iso: iso.render()})
			res.send(html)
		})
	})
}