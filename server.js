function startServer() {
		var express = require('express'),
				Parse = require('parse').Parse,
				app = express(),
				photosRoute = require('./server-routes/photos')


		Parse.initialize("KvA0dcipEXZtL4Xp3EAaggQ9bTHdfxeyHPqVUEhk", "vpaBfdBJ7ys88nUIdIlVkDPmK3pR0V2EwRXBgpWm")


		app.use(express.static(__dirname + '/public'))


		app.get('/:user?/photos', photosRoute)


		app.listen(3000, function() {
				console.log('skylines w/ server')
		})
}

startServer();