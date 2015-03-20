;(function(exports) {

var React = require('react')
var detailStore = require('../stores/DetailStore').detailStore
var detailActions = require('../actions/DetailActions').detailActions

class DetailView extends React.Component {
		constructor() {
				super()
				this.state = detailStore.getState()
		}

		componentWillMount() {
				detailActions.getDetail(this.props.flickrKey, this.props.params.id)
		}

		componentDidMount() {
				detailStore.listen(this.onChange.bind(this))
		}

		componentWillUnmount() {
				detailStore.unlisten(this.onChange.bind(this))
				detailActions.resetState()
		}

		onChange() {
				this.setState(detailStore.getState())
		}

		render() {
				var photo = this.state.photo
				if (this.state.photo) {
						var ownerUrl = `https://www.flickr.com/people/${photo.owner.path_alias}`
						return (
								<main className="photo-detail">
										<a href={photo.urls.url[0]._content} target="_blank"><h2>{photo.title._content}</h2></a>
										<a href={ownerUrl} target="_blank"><h4>{photo.owner.username}</h4></a>
										<a href={ownerUrl} target="_blank"><h6>{photo.owner.realname}</h6></a>
										<img src={this.state.photoUrl('b')} />

										{photo.description ? <h5>{photo.description}</h5> : null}

										{photo.location && photo.location.locality ?
												<h6>{photo.location.locality._content}</h6> :
												null}

										{photo.location && photo.location.country ?
												<h6>{photo.location.country._content}</h6> :
												null}

										<h6>Taken {photo.dates && photo.dates.taken ?
												<span>{photo.dates.taken}</span> :
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