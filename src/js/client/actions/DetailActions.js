import { DetailApi } from '../api'

import EventEmittingActions from './EventEmittingActions'

var storeName = 'detail'

class DetailActions extends EventEmittingActions {
	getDetail(photoId, tags) {
		var request = DetailApi.requestPhoto({photo_id: photoId}, tags).then((res) => {
			this.dispatch(res)
		})
		super.emit(request)
	}
}

export default { actions: DetailActions, name: storeName }
