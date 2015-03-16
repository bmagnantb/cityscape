;(function(exports) {

// Construct URL for Flickr API
// METHOD AND API_KEY ARE REQUIRED FOR ANY REQUEST
// other options may or may not be required based on chosen method, refer to Flickr API docs

// allows gradual build of request URL if settings are pulled from different areas of app
// first call must provide settings
// on subsequent calls, additional settings will be added and any repeat settings are overwritten
// passing no parameters builds and returns url as string

function url(settings) {

		function build(settings2) {
				var urlBuild

				// if parameter is object, add/overwrite to original object, return function to take more settings
				if (typeof settings2 === 'object') {

						// copy keys/values from newest settings onto original settings object
						for (var key in settings2) {
								settings[key] = settings2[key]
						}

						return build
				}

				// final settings assumed
				else {
						// throw if either method or api_key are not defined, required settings for request
						if (!settings.method || !settings.api_key) {
									throw 'method and api_key are required for Flickr requests'
								}

						// if format undefined, default to json
						!settings.format ? settings.format = 'json' : null
						// if nojsoncallback undefined, default to no callback
						settings.format === 'json' && !settings.nojsoncallback ? settings.nojsoncallback = '1' : null

						// construct URL with finalized settings
						urlBuild = `https://api.flickr.com/services/rest/?&method=${settings.method}&api_key=${settings.api_key}`

						for (var key in settings) {
								urlBuild += `&${key}=${settings[key]}`
						}

						return urlBuild
				}
		}

		return build

}


exports.flickrMakeUrl = url

})(typeof module === 'object' ? module.exports : window)