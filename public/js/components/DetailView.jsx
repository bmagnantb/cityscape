;(function(exports) {

var React = require('react')
var { detailStore } = require('../stores/DetailStore')
var { detailActions } = require('../actions/DetailActions')
var { userStore } = require('../stores/UserStore')
var { galleryActions } = require('../actions/GalleryActions')

class DetailView extends React.Component {

	constructor() {
		super()
		this.state = {}
	}

	componentWillMount() {
		detailStore.listen(this._onDetailChange.bind(this))
		userStore.listen(this._onUserChange.bind(this))

		var detail = this._detailInfo()
		var user = this._userInfo()
		var voteAllowed = this._voteAllowed(detail, user)
		var votesMarkup = this._votesMarkup(detail, voteAllowed)
		this.setState({detail, user, voteAllowed, votesMarkup})
	}


	componentWillUnmount() {
		detailStore.unlisten(this._onDetailChange)
		userStore.unlisten(this._onUserChange)
	}


	render() {
		if (this.state.detail) {
			return (
				<main className="photo-detail">
					<img src={this.state.detail._photoUrl('b')} />
					<div className="info">
						{this.state.votesMarkup}

						<a href={this.state.detail.urls.url[0]._content} target="_blank"><h3>{this.state.detail.title}</h3></a>

						{this.state.detail.owner
							? <a href={this.state.detail._owner_url} target="_blank">{this.state.detail.ownername}</a>
							: <h4>{this.state.detail.ownername}</h4>}

						{this.state.detail.description ? <h6>{this.state.detail.description}</h6> : null}

						{this.state.detail.location && this.state.detail.location.locality
							? <h6>{this.state.detail.location.locality._content}</h6>
							: null}

						{this.state.detail.location && this.state.detail.location.country
							? <h6>{this.state.detail.location.country._content}</h6>
							: null}

						<h6>Taken {this.state.detail.dates && this.state.detail.dates.taken
							? <span>{this.state.detail.dates.taken.slice(0, 10).replace(/-/g, '.')}</span>
							: null}</h6>
					</div>
				</main>
			)
		} else {
			return <span></span>
		}
	}


	_onDetailChange() {
		var detail = this._detailInfo()
		var voteAllowed = this._voteAllowed(detail, this.state.user)
		var votesMarkup = this._votesMarkup(detail, voteAllowed)
		this.setState({detail, voteAllowed, votesMarkup})
	}


	_onUserChange() {
		var user = this._userInfo()
		var voteAllowed = this._voteAllowed(this.state.detail, user)
		var votesMarkup = this._votesMarkup(this.state.detail, voteAllowed)
		this.setState({user, voteAllowed, votesMarkup})
	}


	_vote() {
		var tags = this.props.params.tags
		galleryActions.vote(this.state.detail.photo_id, this.state.user, this.props.params.tags)
	}


	_detailInfo() {
		var detail = detailStore.getState()[this.props.params.id]
		return detail
	}


	_userInfo() {
		var user = userStore.getState().user
		return user
	}

	_voteAllowed(detail, user) {
		if (user && detail) {
			if (detail.user_votes && detail.user_votes.indexOf(user.get('username')) === -1) {
				return <h6 className="upvote" onClick={this._vote.bind(this)}>(upvote)</h6>
			}
			return <h6 className="voted">(upvoted)</h6>
		}
		return false
	}

	_votesMarkup(detail, voteAllowed) {
		if (detail) {

			if (detail.weighted_votes != null && this.props.params.tags.length) {
				return (
					<div className="votes">
						{voteAllowed ? voteAllowed : null}
						<h6>(search-weighted) {detail.weighted_votes}</h6>
						<h6>(total) {detail.total_votes}</h6>
					</div>
				)
			}

			else if (detail.total_votes != null) {
				return (
					<div className="votes">
						{voteAllowed ? voteAllowed : null}
						<h6>{detail.total_votes}</h6>
					</div>
				)
			}
		}

		return null
	}
}

var prevDetails = {}
DetailView.willTransitionTo = function(transition, params) {

	params.tags = typeof params.tags === 'string' && params.tags.length ? params.tags : ''

	if (prevDetails[params.id] === undefined) {
		detailActions.getDetail(params.id, params.tags)
		prevDetails[params.id] = {}
		if (params.tags.length) prevDetails[params.id].tags = params.tags.split(',').sort()
		else prevDetails[params.id].tags = []
	}

	else if (prevDetails[params.id] != null && prevDetails[params.id].tags.indexOf(params.tags.split(',').sort()) === -1) {
		detailActions.getDetail(params.id, params.tags)
		prevDetails[params.id].tags.push(params.tags.split(',').sort())
	}
}



exports.DetailView = DetailView

})(typeof module === 'object' ? module.exports : window)