;(function(exports) {

var React = require('react')
var GalleryActions = require('../actions/GalleryActions').GalleryActions
var GalleryStore = require('../stores/GalleryStore').GalleryStore

class HomeView extends React.Component {
		constructor() {
				super()
				this.state = GalleryStore.getState()
		}

		componentWillMount() {
				GalleryStore.listen(this.onChange.bind(this))
				GalleryActions.getPhotos()
		}

		onChange() {
				console.log('change')
				console.log(GalleryStore.getState())
				this.setState(GalleryStore.getState())
		}

		render() {
				var photos = this.state.photo.map((photo) => {
						var owner_url = `https://www.flickr.com/people/${photo.owner}`
						return (
								<div>
										<img src={photo.url_m} />
										<h4>{photo.title}</h4>
										<a href={owner_url}>
												<h4>{photo.ownername}</h4>
										</a>
								</div>
						)
				})
				console.log(this.state)
				return (
						<main>
								{photos}
						</main>
				)
		}
}


exports.HomeView = HomeView

})(typeof module === 'object' ? module.exports : window)