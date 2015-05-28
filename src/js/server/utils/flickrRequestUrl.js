var flickrApiKey = process.env.FLICKR_KEY || require('../../../../keys/flickrKey')

// parse client request info and call makeUrl
export default function getRequestUrl(reqQuery, reqRoute) {
	if (reqRoute && reqRoute.path === '/api/photos') {
		reqQuery = photosQuery(reqQuery)
	}
	reqQuery.api_key = flickrApiKey

	return makeUrl(reqQuery)
}

function photosQuery(reqQuery) {
	var thirtyDaysAgo = Math.round((new Date() - (1000 * 60 * 60 * 24 * 30)) / 1000)
	if (!reqQuery.min_upload_date) reqQuery.min_upload_date = thirtyDaysAgo
	if (!reqQuery.tags) reqQuery.tags = []
	if (reqQuery.tags.indexOf('buildings') === -1) reqQuery.tags.unshift('buildings')
	if (reqQuery.tags.indexOf('city') === -1) reqQuery.tags.unshift('city')
	console.log(reqQuery.extras)
	if (!reqQuery.extras) reqQuery.extras = []
	if (reqQuery.extras.indexOf('tags') === -1) reqQuery.extras.push('tags')


	return reqQuery
}

// build flickr request url
function makeUrl(obj) {
	var url = 'https://api.flickr.com/services/rest?'
	var counter = 0

	for (var key in obj) {
		if (counter > 0) url += '&'
		url+= key + '=' + obj[key]
		counter++
	}

	return url
}
