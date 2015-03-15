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
				userStore.listen(this.onUserChange.bind(this))
				galleryStore.listen(this.onGalleryChange.bind(this))
				userActions.current()
		}

		componentWillUnmount() {
				userStore.unlisten(this.onUserChange.bind(this))
				galleryStore.unlisten(this.onGalleryChange)
		}

		componentDidMount() {
				galleryActions.getPhotos()
		}

		onGalleryChange() {
				this.setState(galleryStore.getState())
		}

		onUserChange() {
				this.setState(userStore.getState())
		}

		render() {
				console.log(this.state)
				var photos = this.state.photo.map((photo) => {
						return <Photo {...photo} user={this.state.user} key={photo.id} />
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
				this.state = {}
		}

		render() {
				var owner_url = `https://www.flickr.com/people/${this.props.owner}`
				return (
						<div className="photo">
								<img src={this.props.url_m} />
								<h4>{this.props.title}</h4>
								<a href={owner_url}>
										<h4>{this.props.ownername}</h4>
								</a>
						</div>
				)
		}
}


exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)