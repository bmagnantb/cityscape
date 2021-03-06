import _ from 'lodash'

import { GalleryApi } from '../api'

import EventEmittingActions from './EventEmittingActions'

var actionsName = 'gallery'

class GalleryActions extends EventEmittingActions {
	constructor() {
		super()
		this.generateActions('cachedLoad', 'changePage', 'setLoading')
	}

	getPhotos(params) {
		this.actions.setLoading()
		var routerParams = _.clone(params)
		params = _.clone(params)
		if (params.page) {
			params.page = Math.floor((params.page - 1) / 25) + 1
		}
		var request = GalleryApi.requestPhotos(params).then((res) => {
			this.dispatch({ res, params, routerParams })
		})
		super.emit(request)
	}

	vote(photoId, user, tags) {
		var request = GalleryApi.vote(photoId, user, tags)
			.then((resp) => {
				this.dispatch(resp.body)
			})
		super.emit(request)
	}
}

export default { actions: GalleryActions, name: actionsName }
