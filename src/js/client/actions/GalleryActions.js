import alt from '../alt-app'
import { GalleryApi } from '../api'

class GalleryActions {
	constructor() {
		this.generateActions('isntLoading', 'cachedLoad', 'changePage')
	}

	getPhotos(params) {

		if (params.page) {
			params.page = Math.floor((params.page - 1) / 25) + 1
		}
		GalleryApi.requestPhotos(params)
		.then((data) => {
			data = data.photos
			var obj = { params, data }
			this.dispatch(obj)
		})
	}

	vote(photoId, user, tags) {
		GalleryApi.vote(photoId, user, tags)
		.then((resp) => this.dispatch(resp))
	}
}

export default alt.createActions(GalleryActions)
