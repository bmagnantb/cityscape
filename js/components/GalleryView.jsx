;(function(exports) {

var React = require('react')
var galleryActions = require('../actions/GalleryActions').galleryActions
var galleryStore = require('../stores/GalleryStore').galleryStore
var userActions = require('../actions/UserActions').userActions
var userStore = require('../stores/UserStore').userStore

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
				userStore.unlisten(this.onUserChange)
				galleryStore.unlisten(this.onGalleryChange)
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
						return (
								<span key={tag}>
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
								{photos}
						</main>
				)
		}

		search(e) {
				e.preventDefault()
				var tags = this.refs.search.getDOMNode().value.split(' ')
				galleryActions.setTags(tags)
				galleryActions.getPhotos({tags: tags})
				this.refs.search.getDOMNode().value = ''
		}

		removeTag(e) {
				var tag = `-${e.target.parentNode.innerHTML}`.split()
				galleryActions.setTags(tag)
				galleryActions.getPhotos({tags: tag})
		}
}


class Photo extends React.Component {
		constructor() {
				super()
		}

		render() {
				var owner_url = `https://www.flickr.com/people/${this.props.photo.owner}`
				return (
						<div className="photo">
								<img src={this.props.photo.url_m} />
								<h4 onClick={this.details.bind(this)}>{this.props.photo.title}</h4>
								<a href={owner_url} target="_blank">
										<h4>{this.props.photo.ownername}</h4>
								</a>
						</div>
				)
		}

		details() {
				this.props.router.transitionTo('photo', {id: this.props.photo.id})
		}
}


exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)