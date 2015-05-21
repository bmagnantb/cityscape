import React from 'react'
import Router from 'react-router'
import engine from 'engine-lodash'

import routes from '../../client/router/Routes'

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
		console.log('router running')
		var { params } = state
		// var html = React.renderToString(<Handler params={params} />)
		// engine.renderFile(
		// 	__dirname + '/../index.html',
		// 	{content: html},
		// 	(err, str) => {
		// 		if (err) res.send(err)
		// 		res.send(str)
		// 	}
		// )
	})
}