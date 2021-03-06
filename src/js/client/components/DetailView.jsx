import React from 'react'
import _ from 'lodash'

import AutobindComponent from './AutobindComponent'

export default class Detail extends AutobindComponent {

	constructor(props, context) {
		super()

		this._bind('_vote')
	}

	componentWillMount() {
		this._routerParams = this.context.router.getCurrentParams()
	}

	render() {
		if (_.isEmpty(this.props.storeData)) return <span></span>

		var photoHeight = `${this.props.storeData.maxSize.height}px`
		var photoWidth = `${this.props.storeData.maxSize.width}px`
		var votesMarkup = this._votesMarkup()
		return (
			<main className="photo-detail">
				<img src={this.props.storeData.maxSize.source} style={{height: photoHeight, width: photoWidth}} />
				<div className="info">
					{votesMarkup}

					<a href={this.props.storeData.urls.url[0]._content} target="_blank"><h3>{this.props.storeData.title}</h3></a>

					{this.props.storeData.owner
						? <a href={this.props.storeData._ownerUrl} target="_blank">{this.props.storeData.ownername}</a>
						: <h4>{this.props.storeData.ownername}</h4>}

					{this.props.storeData.description ? <h6>{this.props.storeData.description._content}</h6> : <span/>}

					{this.props.storeData.location && this.props.storeData.location.locality
						? <h6>{this.props.storeData.location.locality._content}</h6>
						: <span/>}

					{this.props.storeData.location && this.props.storeData.location.country
						? <h6>{this.props.storeData.location.country._content}</h6>
						: <span/>}

					<h6>Taken {this.props.storeData.dates && this.props.storeData.dates.taken
						? <span>{this.props.storeData.dates.taken.slice(0, 10).replace(/-/g, '.')}</span>
						: <span/>}</h6>
				</div>
			</main>
		)
	}

	_vote() {
		this.props.actions.vote(this.props.storeData.photo_id, this.props.user, this._routerParams.tags)
	}

	_voteAllowed() {
		if (this.props.user && this.props.storeData) {
			if (this.props.storeData.user_votes && this.props.storeData.user_votes.indexOf(this.props.user.get('username')) === -1) {
				return <h6 className="upvote" onClick={this._vote}>(upvote)</h6>
			}
			return <h6 className="voted">(upvoted)</h6>
		}
		return <span/>
	}

	_votesMarkup() {
		var voteAllowed = this._voteAllowed()

		if (this.props.storeData) {
			if (this.props.storeData.weighted_votes != null && this._routerParams.tags.length) {
				return (
					<div className="votes">
						{voteAllowed}
						<h6>(search-weighted) {this.props.storeData.weighted_votes}</h6>
						<h6>(total) {this.props.storeData.total_votes}</h6>
					</div>
				)
			}
			else if (this.props.storeData.total_votes != null) {
				return (
					<div className="votes">
						{voteAllowed}
						<h6>{this.props.storeData.total_votes}</h6>
					</div>
				)
			}
		}

		return <span/>
	}
}


Detail.contextTypes = {
	router: React.PropTypes.func.isRequired
}
