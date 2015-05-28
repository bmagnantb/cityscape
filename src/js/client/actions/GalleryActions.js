import _ from 'lodash'

import { GalleryApi } from '../api'

class GalleryActions {
	constructor() {
		this.generateActions('isntLoading', 'cachedLoad', 'changePage')
	}

	getPhotos(params) {
		console.log('requesting photos')
		params = _.clone(params)
		var routerParams = _.clone(params)
		if (params.page) {
			params.page = Math.floor((params.page - 1) / 25) + 1
		}
		var request = GalleryApi.requestPhotos(params)

		this.dispatch({ request, params, routerParams })
	}

	vote(photoId, user, tags) {
		GalleryApi.vote(photoId, user, tags)
		.then((resp) => this.dispatch(resp))
	}
}

export default { actions: GalleryActions, name: 'gallery' }
