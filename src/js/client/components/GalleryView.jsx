import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router'

import AutobindComponent from './AutobindComponent'
import Photo from './Photo'

export default class GalleryView extends AutobindComponent {

	constructor(props, context) {
		super(props, context)

		this._galleryActions = context.alt.getActions('gallery')
		this._galleryStore = context.alt.getStore('gallery')

		this.state = this._galleryStore.getState()

		this._bind('_onGalleryChange', '_search', '_changePage', '_removeTag')
	}

	componentWillMount() {
		this._shouldStoreFetch(this._galleryStore.getState())
	}

	componentDidMount() {
		this._galleryStore.listen(this._onGalleryChange)
	}

	componentWillUnmount() {
		this._galleryStore.unlisten(this._onGalleryChange)
	}

	_onGalleryChange() {
		this.setState(this._galleryStore.getState())
	}

	_shouldStoreFetch(store) {

		var params = this.context.router.getCurrentParams()
		var prevParams = store.requestParams

		// check if exact request has happened
		var prevParamsMatch = prevParams.filter(function(val) {
			console.log(val, params)
			return _.isEqual(val, params)
		})

		// cached load
		if (prevParamsMatch.length) {
			console.log('prevParams match')
			this._galleryActions.cachedLoad(params)
		}

		// page change?
		else if (params.tags !== undefined && params.tags === prevParams[0].tags) {
			console.log('page change')
			this._galleryActions.changePage(params)
		}

		// request -- new set of tags
		else {
			console.log('gimme new data')
			this._galleryActions.getPhotos(params)
		}
	}

	render() {
		var tags = this._getTags()

		if (this.state.isLoading) return this._loadingMarkup()

		var photos = this._getCurrentPhotos()

		return (
			<main className="gallery">
				<form onSubmit={this._search}>
					<input type="search" ref="search" />
				</form>
				{tags}
				<div className="photos">
					{photos}
				</div>
				<div className="pages">
					{this.state.paginate.prevPageExists
						? <Link to={this.state.paginate.prevPageRoute} onClick={this._changePage}><h6 className="prev">Prev</h6></Link>
						: <h6></h6>}

					<h6 className="current">{this.state.paginate.currentPage}</h6>

					{this.state.paginate.nextPageExists
						? <Link to={this.state.paginate.nextPageRoute} onClick={this._changePage}><h6 className="next">Next</h6></Link>
						: <h6></h6>}
				</div>
			</main>
		)
	}

	_search(e) {
		e.preventDefault()
		var newTags = React.findDOMNode(this.refs.search).value.split(' ')
		if (addedTags.length) {
			newTags = this._sortTags(this.state.tags.concat(newTags))

			this.context.router.transitionTo('gallerysearch', {tags: newTags, page: 1})
			React.findDOMNode(this.refs.search).value = ''
			this.setState({isLoading: true, tags: newTags})
		}
	}

	_removeTag(e) {
		var tag = e.target.parentNode.id.slice(3)
		var tags = this.state.tags
		tags.splice(tags.indexOf(tag), 1)
		tags = this._sortTags(tags)

		if (tags.length) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
		else this.context.router.transitionTo('gallerynosearch', {page: 1})

		this.setState({isLoading: true})
	}

	_sortTags(tags) {
		return tags.split(',').sort()
	}

	_changePage() {
		this.setState({isLoading: true})
	}

	_getCurrentPhotos() {

		var currentPhotos = this.state.paginate.currentPhotos.map((photo) => {
			return <Photo tags={this.state.tags} photo={photo} user={this.props.user} key={photo.photo_id} />
		})

		if (!currentPhotos.length && !this.state.isLoading) return <h2>No results</h2>

		return currentPhotos
	}

	_getTags() {
		var tags

		this.state.tags.length
			? tags =
				<div className="tags">
					{this.state.tags.map((tag) => {
						var id = `tag${tag}`
						return (
							<span className="tag" key={tag} id={id}>
								<span>{tag}</span>
								<span className="x" onClick={this._removeTag}>x</span>
							</span>
						)
					})}
				</div>
			: null

		return tags
	}

	_loadingMarkup() {
		var tags = this._getTags()

		return (
			<main className="gallery loading">
				<form onSubmit={this._search}>
					<input type="search" ref="search" />
				</form>
				{tags}
				<h2>Loading<span>.</span><span>.</span><span>.</span></h2>
			</main>
		)
	}
}


GalleryView.contextTypes = {
	router: React.PropTypes.func.isRequired,
	alt: React.PropTypes.object.isRequired
}
