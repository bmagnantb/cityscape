;(function(exports) {

var React = require('react')
var { galleryActions } = require('../actions/GalleryActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userActions } = require('../actions/UserActions')
var { userStore } = require('../stores/UserStore')
var { Link } = require('../react-router')

class GalleryView extends React.Component {
		constructor() {
				super()
				this.state = galleryStore.getState()
				var { user } = userStore.getState()
				this.state.user = user
		}

		componentWillMount() {
				galleryActions.getPhotos({api_key: this.props.flickrKey})
				userActions.current()
		}

		componentDidMount() {
				userStore.listen(this.onUserChange.bind(this))
				galleryStore.listen(this.onGalleryChange.bind(this))
		}

		componentWillUnmount() {
				userStore.unlisten(this.onUserChange.bind(this))
				galleryStore.unlisten(this.onGalleryChange.bind(this))
		}

		onGalleryChange() {
				this.setState(galleryStore.getState())
		}

		onUserChange() {
				this.setState(userStore.getState())
		}

		render() {
				var photos = this.state.photo.map((photo) => {
						return <Photo photo={photo} router={this.props.router} user={this.state.user} key={photo.id} />
				})
				var tags = this.state.tags.map((tag) => {
						var id = `tag${tag}`
						return (
								<span key={tag} id={id}>
										&nbsp;{tag}&nbsp;
										<span onClick={this.removeTag.bind(this)}>X</span>&nbsp;
								</span>
						)
				})
				return (
						<main className="gallery">
								<form onSubmit={this.search.bind(this)}>
										<input type="search" ref="search" />
								</form>
								<div className="tags">
										{tags}
								</div>
								<div className="photos">
										{photos}
								</div>
								<div>
										{this.state.page > 1 ?
												<h6 onClick={this.prevPage.bind(this)}>Prev</h6> :
												null}

										<h6>{this.state.page}</h6>

										{this.state.page < this.state.pages ?
												<h6 onClick={this.nextPage.bind(this)}>Next</h6> :
												null}
								</div>
						</main>
				)
		}

		renderLoading() {
				return (
							<div>Loading</div>
					)
		}

		search(e) {
				e.preventDefault()
				var tags = React.findDOMNode(this.refs.search).value.split(' ')
				galleryActions.setTags(tags)
				galleryActions.getPhotos({tags: tags}, this.state.user)
				React.findDOMNode(this.refs.search).value = ''
		}

		removeTag(e) {
				var tag = `-${e.target.parentNode.id.slice(3)}`.split()
				galleryActions.setTags(tag)
				galleryActions.getPhotos({tags: tag}, this.state.user)
		}

		prevPage() {
				galleryActions.getPhotos({page: this.state.page - 1})
				document.documentElement.scrollTop = 0
				document.body.scrollTop = 0
		}

		nextPage() {
				galleryActions.getPhotos({page: this.state.page + 1})
				document.documentElement.scrollTop = 0
				document.body.scrollTop = 0
		}
}


class Photo extends React.Component {
		constructor() {
				super()
		}

		render() {
				var owner_url = this.props.photo.owner && `https://www.flickr.com/people/${this.props.photo.owner}`

				return (
						<div className="photo">
								<Link to="/photo/:id" params={{id: this.props.photo.id}}>
										<img src={this.props.photo.url_m} />
								</Link>
								<h6 ref="vote" onClick={this.vote.bind(this)}>Yes</h6>
								<h6>{this.props.photo.total_votes}</h6>
								<Link to="/photo/:id" params={{id: this.props.photo.id}}>
										<h4>{this.props.photo.title}</h4>
								</Link>
								<a href={owner_url} target="_blank">
										<h4>{this.props.photo.ownername}</h4>
								</a>
						</div>
				)
		}

		// details() {
		// 		this.props.router.transitionTo('photo', {id: this.props.photo.id})
		// }

		vote() {
				galleryActions.vote(this.props.photo.id, this.props.user)
		}
}


exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)