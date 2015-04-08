;(function(exports) {

var React = require('react')
var { Link } = require('../../../modules_other/react-router')
var { galleryActions } = require('../actions/GalleryActions')

class Photo extends React.Component {

		render() {
				return (
						<div key={this.props.key} className="photo">
								<Link to="/photo/:id" params={{id: this.props.photo.photo_id}}>
										<img src={this.props.photo.url_m} />
								</Link>

								<div className="info">
										<div className="votes">
												{this.props.user && this.props.photo.user_votes
														? this.props.photo.user_votes.indexOf(this.props.user.get('username')) === -1
																? <h6 className="upvote" ref="vote" onClick={this._vote.bind(this)}>(upvote)</h6>
																: <h6 className="voted">(upvoted)</h6>
														: null}

												{this.props.photo.weighted_votes != null ? <h6>{this.props.photo.weighted_votes}</h6> : null}
										</div>
										<h5 className="photo-title">
												<Link to="/photo/:id" params={{id: this.props.photo.photo_id}}>
														{this.props.photo.title}
												</Link>
										</h5>
										<h6 className="photo-owner">
												<a href={this.props.photo.owner_url} target="_blank">
														{this.props.photo.ownername}
												</a>
										</h6>
								</div>

						</div>
				)
		}

		_vote() {
				galleryActions.vote(this.props.photo.photo_id, this.props.user, this.props.tags)
		}
}



exports.Photo = Photo

})(typeof module === 'object' ? module.exports : window)