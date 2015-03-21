function startServer() {
		var express = require('express'),
				Parse = require('parse').Parse,
				app = express(),
				getPhotos = require('./server-routes/GetPhotos'),
				putVote = require('./server-routes/PutVote')


		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")


		app.use(express.static(__dirname + '/public'))


		app.get('/:user?/photos', getPhotos)

		app.post('/:user/photo/:id', putVote)


		app.listen(process.env.PORT || 3000, function() {
				console.log('skylines w/ server')
		})
}

startServer();