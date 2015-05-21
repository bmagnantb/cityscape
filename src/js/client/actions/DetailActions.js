import alt from '../alt-app'
import DetailApi from '../api'

class DetailActions {
	getDetail(photoId, tags) {
		DetailApi.requestPhoto({photo_id: photoId,}, tags)
		.then((data) => this.dispatch(data))
	}
}

export default alt.createActions(DetailActions)
