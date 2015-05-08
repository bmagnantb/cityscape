;(function(exports) {

var _ = require('lodash')
var React = require('react')

var { galleryActions } = require('../actions/GalleryActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userActions } = require('../actions/UserActions')
var { userStore } = require('../stores/UserStore')
var { Link } = require('../../../modules_other/react-router')
var { Photo } = require('./Photo')



class GalleryView extends React.Component {

	componentWillMount() {
		this.setState(galleryStore.getState())
		this.setState(userStore.getState())

		userStore.listen(this.onUserChange.bind(this))
		galleryStore.listen(this.onGalleryChange.bind(this))
	}

	componentWillUnmount() {
		userStore.unlisten(this.onUserChange)
		galleryStore.unlisten(this.onGalleryChange)
	}

	onGalleryChange() {
		this.setState(galleryStore.getState())
	}

	onUserChange() {
		this.setState(userStore.getState())
	}

	render() {
		var tags = this._getTags()

		if (this.state.isLoading) {
			return (
				<main className="gallery loading">
					<form onSubmit={this._search.bind(this)}>
						<input type="search" ref="search" />
					</form>
					{tags}
					<h2>Loading<span>.</span><span>.</span><span>.</span></h2>
				</main>
			)
		}

		var photos = this._getCurrentPhotos()

		return (
			<main className="gallery">
				<form onSubmit={this._search.bind(this)}>
					<input type="search" ref="search" />
				</form>
				{tags}
				<div className="photos">
					{photos}
				</div>
				<div className="pages">
					{this.state.paginate.prevPageExists
						? <Link to={this.state.paginate.prevPageRoute} onClick={this._changePage.bind(this)}><h6 className="prev">Prev</h6></Link>
						: <h6></h6>}

					<h6 className="current">{this.state.paginate.currentPage}</h6>

					{this.state.paginate.nextPageExists
						? <Link to={this.state.paginate.nextPageRoute} onClick={this._changePage.bind(this)}><h6 className="next">Next</h6></Link>
						: <h6></h6>}
				</div>
			</main>
		)
	}

	_search(e) {
		e.preventDefault()
		var addedTags = React.findDOMNode(this.refs.search).value.split(' ')
		if (addedTags.length) {
			Array.prototype.push.apply(this.state.tags, addedTags)

			this.context.router.transitionTo('gallerysearch', {tags: this.state.tags, page: 1})
			React.findDOMNode(this.refs.search).value = ''
			this.setState({isLoading: true})
		}
	}

	_removeTag(e) {
		var tag = e.target.parentNode.id.slice(3)
		var tags = this.state.tags
		tags.splice(tags.indexOf(tag), 1)

		if (tags.length) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
		else this.context.router.transitionTo('gallerynosearch', {page: 1})

		this.setState({isLoading: true})
	}

	_changePage() {
		this.setState({isLoading: true})
	}

	_getCurrentPhotos() {

		var currentPhotos = this.state.paginate.currentPhotos.map((photo) => {
			return <Photo tags={this.state.tags} photo={photo} user={this.state.user} key={photo.photo_id} />
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
								<span className="x" onClick={this._removeTag.bind(this)}>x</span>
							</span>
						)
					})}
				</div>
			: null

		return tags
	}
}


GalleryView.contextTypes = {
	router: React.PropTypes.func.isRequired
}


var prevParams = [{}]
GalleryView.willTransitionTo = function(transition, params) {
	console.log('transition')

	// make tags array, sort so same tags entered in different order appear same
	if (params.tags) params.tags = params.tags.split(',').sort()

	// copy params -- request and prevParams shouldn't reference same obj
	var paramsCopy = _.assign({}, params)

	// check if exact request has happened
	var prevParamsMatch = prevParams.filter(function(val) {
		return _.isEqual(val, params)
	})

	// cached load
	if (prevParamsMatch.length) {
		galleryActions.cachedLoad(paramsCopy)
	}

	// pagination -- store figures out if request needed or from current request
	else if (params.tags !== undefined && params.tags === prevParams[0].tags) {

		// change the page
		if (params.page !== prevParams[0].page) {
			galleryActions.changePage(paramsCopy)
		}

		// no change, do nothing -- component state should remain identical
		else return
	}

	// request -- new params combo
	else {
		galleryActions.getPhotos(paramsCopy)
	}

	// save params for checking if request has been made before
	prevParams.unshift(params)
}



exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)