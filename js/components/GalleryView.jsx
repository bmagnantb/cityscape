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
				galleryActions.getPhotos(this.props.flickrKey)
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
				return (
						<main className="gallery">
								{photos}
						</main>
				)
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