import initParse from './initParse'
initParse()

// API callbacks
import getPhotos from './routes/getPhotos'
import getDetail from './routes/getDetail'
import putVote from './routes/putVote'

// render callback
import render from './routes/render'

export default function addRoutes(app) {
	app.get('/api/photos', getPhotos)

	app.get('/api/photo/:tags?', getDetail)

	app.post('/api/:user/photo/:id/:tags?', putVote)

	app.get('*', render)
}
