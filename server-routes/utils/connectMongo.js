var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient

module.exports = connectMongo

function connectMongo(reqData, flickrResponse) {

	var promise = new Promise(function(resolve, reject) {

		MongoClient.connect(process.env.MONGO_URL, function(err, db) {
			if (err != null) {
				reject(err)
				return
			}
			var data = { mongo: db, req: reqData }
			if (flickrResponse != null) data.flickr = flickrResponse
			resolve(data)
		})
	})

	return promise
}