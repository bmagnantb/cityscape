;(function(exports) {

// for multiple urls, export multiple settings objects and export multiple FlickrClients in FlickrClient.js

// check Flickr's API docs for all possible settings
// DO NOT DELETE METHOD OR API_KEY -- any other setting is deleteable
var FlickrGallerySettings = {
		// REQUIRED Flickr URI / method
		method: 'flickr.photos.search',

		// REQUIRED register with Flickr
		api_key: 'eeacdafae711c1ae98c0342fa323569a',

		format: 'json',

		// set to empty string if callback wanted or not using json
		jsoncallback: '&nojsoncallback=1',

		// 1 is photos only
		content_type: '1',

		// extra retrieved properties
		extras: [
				'url_m'
		].join(''),

		// entries per page/request
		per_page: '30',

		// sort type
		sort: 'relevance',

		// all matches all tags entered, any matches any tag entered
		tag_mode: 'all',

		// tags
		tags: [
				'skyline',
				'city'
		].join('')
}


function url(settings) {
		if (!settings.method || !settings.api_key) {
			throw 'method and api_key are required for Flickr requests'
		}

		var urlBuild = `https://api.flickr.com/services/rest/?method=${settings.method}&api_key=${settings.api_key}&${settings.jsoncallback}`

		if (settings.format) {
				urlBuild += `&format=${settings.format}`
		}

		if (settings.content_type) {
				urlBuild += `&content_type=${settings.content_type}`
		}

		if (settings.extras) {
				urlBuild += `&extras=${settings.extras}`
		}

		if (settings.per_page) {
				urlBuild += `&per_page=${settings.per_page}`
		}

		if (settings.sort) {
				urlBuild += `&sort=${settings.sort}`
		}

		if (settings.tag_mode) {
				urlBuild += `&tag_mode=${settings.tag_mode}`
		}

		if (settings.tags) {
				urlBuild += `&tags=${settings.tags}`
		}

		return urlBuild
}



exports.GalleryURL = url(FlickrGallerySettings)

})(typeof module === 'object' ? module.exports : window)