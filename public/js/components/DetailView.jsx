;(function(exports) {

var React = require('react')
var { detailStore } = require('../stores/DetailStore')
var { detailActions } = require('../actions/DetailActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userStore } = require('../stores/userStore')
var { galleryActions } = require('../actions/GalleryActions')

class DetailView extends React.Component {
		constructor() {
				super()
				this.state = galleryStore.getState()
				this.state.detail = detailStore.getState()
				var { user } = userStore.getState()
				this.state.user = user
		}

		componentWillMount() {
				var routerParams = this.context.router.getCurrentParams()
				var galleryMatch = this.state.paginate.currentPhotos.filter((val) => {
						return val.id === routerParams.id
				})[0]

				var galleryMatchVotes
				galleryMatch && galleryMatch.total_votes && galleryMatch.user_votes ? galleryMatchVotes = true : null

				if (!this.state.detail[routerParams.id]) {
						detailActions.getDetail(routerParams.id, galleryMatchVotes)
				}
		}

		componentDidMount() {
				detailStore.listen(this.onDetailChange.bind(this))
				galleryStore.listen(this.onGalleryChange.bind(this))
		}

		componentWillUnmount() {
				detailStore.unlisten(this.onDetailChange)
				galleryStore.unlisten(this.onGalleryChange)
		}

		onDetailChange() {
				this.setState({detail: detailStore.getState()})
		}

		onGalleryChange() {
				this.setState(galleryStore.getState())
		}

		render() {
				var routerParams = this.context.router.getCurrentParams()

				var photo = this.state.paginate.currentPhotos.filter((val) => {
						return val.id === routerParams.id
				})[0]
				var photoDetail = this.state.detail[routerParams.id]

				var voteAllowed
				this.state.user && photo && photo.user_votes.indexOf(this.state.user.get('username')) === -1
						? voteAllowed = <h6 className="upvote" ref="vote" onClick={this._vote.bind(this)}>(upvote)</h6>
						: <h6 className="voted">(upvoted)</h6>

				var votes
				photo && photo.weighted_votes != null && this.state.tags.length
						? votes = <div className="votes">
												{voteAllowed}
												<h6>(search-weighted) {photo.weighted_votes}</h6>
												<h6>(total) {photo.total_votes}</h6>
										</div>
						: photo && photo.total_votes != null
								? votes = <div className="votes">
															{voteAllowed}
															<h6>{photo.total_votes}</h6>
													</div>
								: null

				if (photoDetail) {
						var ownerUrl = `https://www.flickr.com/people/${photoDetail.owner.path_alias}`
						return (
								<main className="photo-detail">
										<img src={photoDetail.photoUrl('b')} />
										<div className="info">
												{photo ? {votes} : null}

												<a href={photoDetail.urls.url[0]._content} target="_blank"><h3>{photoDetail.title._content}</h3></a>

												<a href={ownerUrl} target="_blank"><h4>{photoDetail.owner.username}</h4></a>

												{photoDetail.description ? <h6>{photoDetail.description}</h6> : null}

												{photoDetail.location && photoDetail.location.locality
														? <h6>{photoDetail.location.locality._content}</h6>
														: null}

												{photoDetail.location && photoDetail.location.country
														? <h6>{photoDetail.location.country._content}</h6>
														: null}

												<h6>Taken {photoDetail.dates && photoDetail.dates.taken
														? <span>{photoDetail.dates.taken.slice(0, 10).replace(/-/g, '.')}</span>
														: null}</h6>
										</div>
								</main>
						)
				} else {
						return <span></span>
				}
		}

		_vote() {
				var routerParams = this.context.router.getCurrentParams()
				galleryActions.vote(routerParams.id, this.state.user, this.state.tags)
		}
}

DetailView.contextTypes = {
		router: React.PropTypes.func.isRequired
}


exports.DetailView = DetailView

})(typeof module === 'object' ? module.exports : window)