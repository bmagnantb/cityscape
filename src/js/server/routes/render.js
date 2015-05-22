import React from 'react'
import Router from 'react-router'
import engine from 'engine-lodash'

import routes from '../../client/router/Routes'
import AltApp from '../../client/alt-app'
import giveAltContext from '../../client/giveAltContext'

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
		alt.dispatcher.register(console.log.bind(console))
		var HandlerWithContext = giveAltContext(Handler, alt)

		var html = React.renderToString(<HandlerWithContext params={state.params} />)
		/*engine.renderFile(
			__dirname + '/../index.html',
			{content: html, alt: ''},
			(err, str) => {
				if (err) console.log('error', err.toString())
				res.send(str)
			}
		)*/
		res.send('asdf')
	})
}