import express from 'express'

// API callbacks
import getPhotos from './routes/getPhotos'
import getDetail from './routes/getDetail'
import putVote from './routes/putVote'

// render callback
import render from './routes/render'

var app = express()

app.get('/api/photos', getPhotos)

app.get('/api/photo/:tags?', getDetail)

app.post('/api/:user/photo/:id/:tags?', putVote)

app.get('*', render)

app.listen(process.env.PORT || 3000, function() {
	console.log('skylines w/ server')
})

module.exports = app