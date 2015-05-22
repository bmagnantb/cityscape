import React from 'react'
import _ from 'lodash'

export default class DetailView extends React.Component {

	constructor() {
		super()
	}

	componentWillMount() {
		this._detailStore = this.context.alt.getStore('detail')

		this._detailStore.listen(this._onDetailChange.bind(this))
		this.setState(this._detailStore.getState()[this.props.params.id])
	}

	componentWillUnmount() {
		this._detailStore.unlisten(this._onDetailChange)
	}

	_onDetailChange() {
		this.setState(this._detailStore.getState()[this.props.params.id])
	}

	_shouldStoreFetch() {

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

	render() {
		if (_.isEmpty(this.state)) return <span></span>
		console.log(this.state)
		return (
			<main className="photo-detail">
				<img src={this.state._photoUrl('b')} />
				<div className="info">
					{this._votesMarkup()}

					<a href={this.state.urls.url[0]._content} target="_blank"><h3>{this.state.title}</h3></a>

					{this.state.owner
						? <a href={this.state._owner_url} target="_blank">{this.state.ownername}</a>
						: <h4>{this.state.ownername}</h4>}

					{this.state.description ? <h6>{this.state.description}</h6> : null}

					{this.state.location && this.state.location.locality
						? <h6>{this.state.location.locality._content}</h6>
						: null}

					{this.state.location && this.state.location.country
						? <h6>{this.state.location.country._content}</h6>
						: null}

					<h6>Taken {this.state.dates && this.state.dates.taken
						? <span>{this.state.dates.taken.slice(0, 10).replace(/-/g, '.')}</span>
						: null}</h6>
				</div>
			</main>
		)
	}

	_vote() {
		galleryActions.vote(this.state.photo_id, this.props.user, this.props.params.tags)
	}

	_voteAllowed() {
		if (this.props.user && this.state) {
			if (this.state.user_votes && this.state.user_votes.indexOf(this.props.user.get('username')) === -1) {
				return <h6 className="upvote" onClick={this._vote.bind(this)}>(upvote)</h6>
			}
			return <h6 className="voted">(upvoted)</h6>
		}
		return false
	}

	_votesMarkup() {
		var voteAllowed = this._voteAllowed()

		if (this.state) {
			if (this.state.weighted_votes != null && this.props.params.tags.length) {
				return (
					<div className="votes">
						{voteAllowed ? voteAllowed : null}
						<h6>(search-weighted) {this.state.weighted_votes}</h6>
						<h6>(total) {this.state.total_votes}</h6>
					</div>
				)
			}
			else if (this.state.total_votes != null) {
				return (
					<div className="votes">
						{voteAllowed ? voteAllowed : null}
						<h6>{this.state.total_votes}</h6>
					</div>
				)
			}
		}

		return null
	}
}


DetailView.contextTypes = {
	router: React.PropTypes.func.isRequired,
	alt: React.PropTypes.object.isRequired
}
