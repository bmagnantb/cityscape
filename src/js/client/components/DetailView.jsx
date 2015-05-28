import React from 'react'
import _ from 'lodash'

import AutobindComponent from './AutobindComponent'

export default class DetailView extends AutobindComponent {

	constructor(props, context) {
		super()

		this._detailStore = context.alt.getStore('detail')
		this._detailActions = context.alt.getActions('detail')
		this._galleryActions = context.alt.getActions('gallery')
		this._routerParams = context.router.getCurrentParams()

		this.state = this._detailStore.getState()[this._routerParams.id]

		this._bind('_onDetailChange', '_vote')
	}

	componentWillMount() {
		this._shouldStoreFetch(this._detailStore.getState())
	}

	componentDidMount() {
		// this.setState(this._detailStore.getState()[this._routerParams.id])
		this._detailStore.listen(this._onDetailChange)
	}

	componentWillUnmount() {
		this._detailStore.unlisten(this._onDetailChange)
	}

	_onDetailChange() {
		this.setState(this._detailStore.getState()[this._routerParams.id])
	}

	_shouldStoreFetch(store) {

		var params = this._routerParams

		if (!params.tags) params.tags = ''
		console.log('router params tags', params.tags)

		if (store[params.id] === undefined) {
			console.log('fetching')
			this._detailActions.getDetail(params.id, params.tags)
			// if (params.tags.length) prevDetails[params.id].tags = params.tags.split(',').sort()
			// else prevDetails[params.id].tags = []
		}

		// else if (prevDetails[params.id] != null && store[params.id].tags.indexOf(params.tags.split(',').sort()) === -1) {
		// 	this._detailActions.getDetail(params.id, params.tags)
		// 	// prevDetails[params.id].tags.push(params.tags.split(',').sort())
		// }
	}

	render() {
		if (_.isEmpty(this.state)) return <span></span>
		return (
			<main className="photo-detail">
				<img src={this.state._photoUrl.b} />
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
		this._galleryActions.vote(this.state.photo_id, this.props.user, this._routerParams.tags)
	}

	_voteAllowed() {
		if (this.props.user && this.state) {
			if (this.state.user_votes && this.state.user_votes.indexOf(this.props.user.get('username')) === -1) {
				return <h6 className="upvote" onClick={this._vote}>(upvote)</h6>
			}
			return <h6 className="voted">(upvoted)</h6>
		}
		return false
	}

	_votesMarkup() {
		var voteAllowed = this._voteAllowed()

		if (this.state) {
			if (this.state.weighted_votes != null && this._routerParams.tags.length) {
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
