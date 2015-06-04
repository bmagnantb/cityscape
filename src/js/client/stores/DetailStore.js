var photoUrl = function(data, size) {
	return `https://farm${data.farm}.staticflickr.com/${data.server}/${data.photo_id}_${data.secret}_${size}.${data.originalformat ? data.originalformat : 'jpg'}`
}

class DetailStore {
	constructor(alt) {
		this.bindListeners({
			getInfo: this.alt.getActions('detail').getDetail,
			vote: this.alt.getActions('gallery').vote
		})
	}

	getInfo(res) {
		var data = res.body
		this[data.photo_id] = data
		this[data.photo_id]._photoUrl = {
			b: photoUrl(data, 'b')
		}
		this[data.photo_id]._ownerUrl = `https://www.flickr.com/people/${data.owner}`
	}

	vote(data) {
		var photo = this[data.photo_id]
		if (photo) {
			photo.total_votes = data.total_votes
			photo.user_votes = data.user_votes
			photo.tag_votes = data.tag_votes
			photo.weighted_votes =  data.weighted_votes
		}
	}
}

export default { store: DetailStore, name: 'detail' }
