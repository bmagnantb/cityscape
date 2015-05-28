import { DetailApi } from '../api'

class DetailActions {
	getDetail(photoId, tags) {
		var request = DetailApi.requestPhoto({photo_id: photoId,}, tags)
		console.log('action fired')
		this.dispatch({request})
	}
}

export default { actions: DetailActions, name: 'detail' }
