import Promise from 'bluebird'
import MongoClient from 'mongodb'

export default function connectMongo(reqData, flickrResponse) {
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