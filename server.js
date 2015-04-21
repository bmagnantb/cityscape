"use strict"

function startServer() {
	var express = require('express')
	var app = express()
	var getPhotos = require('./server-routes/GetPhotos')
	var getDetail = require('./server-routes/GetDetail')
	var putVote = require('./server-routes/PutVote')


	app.use(express.static(__dirname + '/public'))

	app.get('/photos', getPhotos)

	app.get('/photo/:tags?', getDetail)

	app.post('/:user/photo/:id/:tags?', putVote)

	app.listen(process.env.PORT || 3000, function() {
		console.log('skylines w/ server')
	})
}

startServer();