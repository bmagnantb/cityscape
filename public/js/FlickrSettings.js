;(function(exports) {

// Make settings for Flickr API
// METHOD IS REQUIRED FOR ANY REQUEST (and api key, keep it server-side)
// other options may or may not be required based on chosen method, refer to Flickr API docs

// allows gradual build of request settings if pulled from different areas of app
// first call always returns function for continuing settings change
// on subsequent calls, any object as argument will add contents to settings and function will return function for continuing settings change
//additional settings will be added, any repeated settings are overwritten, prepend key with '-' to remove that setting, remove tags and extras by adding '-' to array members, remove all tags and extra by prepending with '--'

function options(settings) {

		function add(settings2) {

				// if argument is object, add/overwrite to original object, return function to take more settings
				if (typeof settings2 === 'object') {

						if (typeof settings !== 'object') {
								settings = {}
						}

						// copy keys/values from newest settings onto original settings object
						for (var key in settings2) {

								// add extras/tags rather than overwriting
								// if extras/tags is Array, join then concat with existing key, otherwise assume string
								if (key === 'extras' || key === 'tags') {

										if (key === '--extras' || key === '--tags') {
												delete settings[key.slice(2)]
										}

										else if (!settings[key]) {
												if (settings2[key] instanceof Array) {
														settings[key] = settings2[key]
												} else {
														settings[key] = settings2[key].split(' ')
												}
										}

										else if (settings2[key] instanceof Array || settings2[key] instanceof String) {
												if (settings2[key] instanceof String) {
														settings2[key] = settings2[key].split(' ')
												}
												settings2[key].forEach((val, ind, arr) => {
														if (settings[key].indexOf(val) !== -1) {
														} else if (val.indexOf('-') === 0) {
																settings[key].splice(settings[key].indexOf(val.slice(1)), 1)
														} else {
																settings[key].push(val)
														}
												})
										}

										else {
												settings[key].push(settings2[key])
										}

								}

								else {
										if(key.indexOf('-') === 0) {
												delete settings[key.slice(1)]
										} else {
												settings[key] = settings2[key]
										}
								}
						}

						return add
				}

				// final settings assumed
				else {
						// throw if either method or api_key are not defined, required settings for request
						if (!settings.method) {
								throw new Error('method is required for Flickr requests')
						}

						// if format undefined, default to json
						!settings.format ? settings.format = 'json' : null
						// if nojsoncallback undefined, default to no callback
						settings.format === 'json' && !settings.nojsoncallback ? settings.nojsoncallback = '1' : null

						return settings
				}
		}

		return add

}


exports.options = options

})(typeof module === 'object' ? module.exports : window)