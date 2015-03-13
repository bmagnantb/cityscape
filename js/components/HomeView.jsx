;(function(exports) {

var React = require('react')
var GalleryActions = require('../actions/GalleryActions').GalleryActions
var GalleryStore = require('../stores/GalleryStore').GalleryStore
// var SkylinesFC = require('../FlickrClient').FlickrClient

class HomeView extends React.Component {
		constructor() {
				super()
				this.state = GalleryStore.getState()
		}

		componentWillMount() {
				GalleryStore.listen(this.onChange.bind(this))
				GalleryActions.getPhotos()
				// SkylinesFC.getPhotos()
				// .then((data) => {
				// 		console.log(data)
				// 		var counter = 0;
				// 		while (counter < 50) {
				// 				this.setState({
				// 					photo: this.state.photo.concat(data.photos.photo[counter])
				// 				})
				// 				console.log(this.state)
				// 				counter++
				// 		}
				// })
		}

		onChange() {
				console.log('change')
				console.log(GalleryStore.getState())
				this.setState(GalleryStore.getState())
		}

		render() {
				var photos = this.state.photo.map((photo) => {
						return (
								<img src={photo.url_m} />
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