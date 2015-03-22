;(function(exports) {

var React = require('react')
var { detailStore } = require('../stores/DetailStore')
var { detailActions } = require('../actions/DetailActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userStore } = require('../stores/userStore')

class DetailView extends React.Component {
		constructor() {
				super()
				this.state = galleryStore.getState()
				this.state.detail = detailStore.getState()
				var { user } = userStore.getState()
				this.state.user = user
		}

		componentWillMount() {
				var galleryMatch = this.state.photo.filter((val) => {
						return val.id === this.props.params.id
				})[0]

				var galleryMatchVotes
				galleryMatch && galleryMatch.total_votes && galleryMatch.user_votes ? galleryMatchVotes = true : null

				if (!this.state.detail[this.props.params.id]) {
						detailActions.getDetail(this.props.params.id, galleryMatchVotes)
						}
		}

		componentDidMount() {
				detailStore.listen(this.onChange.bind(this))
		}

		componentWillUnmount() {
				detailStore.unlisten(this.onChange.bind(this))
		}

		onChange() {
				this.setState({detail: detailStore.getState()})
		}

		render() {
				console.log(this.state)
				var photo = this.state.photo.filter((val) => {
						return val.id === this.props.params.id
				})[0]
				var photoDetail = this.state.detail[this.props.params.id]
				if (photoDetail) {
						var ownerUrl = `https://www.flickr.com/people/${photoDetail.owner.path_alias}`
						return (
								<main className="photo-detail">
										<a href={photoDetail.urls.url[0]._content} target="_blank"><h2>{photoDetail.title._content}</h2></a>
										<a href={ownerUrl} target="_blank"><h4>{photoDetail.owner.username}</h4></a>
										<a href={ownerUrl} target="_blank"><h6>{photoDetail.owner.realname}</h6></a>
										<img src={photoDetail.photoUrl('b')} />

										{photo ? <h6>{photo.total_votes}</h6> :
												photoDetail.total_votes ? <h6>{photoDetail.total_votes}</h6> : null}

										{photoDetail.description ? <h5>{photoDetail.description}</h5> : null}

										{photoDetail.location && photoDetail.location.locality ?
												<h6>{photoDetail.location.locality._content}</h6> :
												null}

										{photoDetail.location && photoDetail.location.country ?
												<h6>{photoDetail.location.country._content}</h6> :
												null}

										<h6>Taken {photoDetail.dates && photoDetail.dates.taken ?
												<span>{photoDetail.dates.taken}</span> :
												null}</h6>
								</main>
						)
				} else {
						return <span></span>
				}
		}
}


exports.DetailView = DetailView

})(typeof module === 'object' ? module.exports : window)