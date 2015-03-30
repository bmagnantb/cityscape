;(function(exports) {

var React = require('react')
var { galleryActions } = require('../actions/GalleryActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userActions } = require('../actions/UserActions')
var { userStore } = require('../stores/UserStore')
var { Link } = require('../../../modules_other/react-router')
var { Photo } = require('./Photo')
var _ = require('lodash')



class GalleryView extends React.Component {

		constructor() {
				super()
				this.state = galleryStore.getState()
				this.state.user = userStore.getState().user
		}



		componentWillMount() {
				userActions.current()
				userStore.listen(this.onUserChange.bind(this))
				galleryStore.listen(this.onGalleryChange.bind(this))
		}



		componentWillUnmount() {
				userStore.unlisten(this.onUserChange)
				galleryStore.unlisten(this.onGalleryChange)
		}



		onGalleryChange() {
				this.setState(galleryStore.getState())
				prevParams.nextPageExists = this.state.paginate.nextPageExists
				prevParams.prevPageExists = this.state.paginate.prevPageExists
		}



		onUserChange() {
				this.setState(userStore.getState())
		}



		render() {
				if (this.state.isLoading) {
						return (
								<main className="loading">
										<h2>Loading<span>.</span><span>.</span><span>.</span></h2>
								</main>
						)
				}

				var photos = this._getCurrentPhotos()

				var tags = this._getTags()

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
				var tags = this.state.tags.concat(addedTags)

				if (tags) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
				else this.context.router.transitionTo('gallerynosearch', {page: 1})

				React.findDOMNode(this.refs.search).value = ''
				this.setState({isLoading: true})
		}



		_removeTag(e) {
				var tag = e.target.parentNode.id.slice(3)
				var tags = this.state.tags.slice()
				tags.splice(this.state.tags.indexOf(tag), 1)
				prevParams.deletedTag = `-${tag}`

				if (tags) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
				else this.context.router.transitionTo('gallerynosearch', {page: 1})

				this.setState({isLoading: true})
		}



		_changePage() {
				this.setState({isLoading: true})
		}



		_getCurrentPhotos() {
				var currentPhotos = this.state.paginate.currentPhotos.map((photo) => {
						return <Photo tags={this.state.tags} photo={photo} user={this.state.user} key={photo.id} />
				})

				if (!currentPhotos.length && !this.state.isLoading) return <h2>No results</h2>

				return currentPhotos
		}


		_getTags() {
				var tags
				this.state.tags.length
						? tags = <div className="tags">
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


var prevParams = {}
GalleryView.willTransitionTo = function(transition, params) {
		var wasPrevParams = Object.keys(prevParams).length

		if (params.nextPageExists === undefined && prevParams.nextPageExists != null) params.nextPageExists = prevParams.nextPageExists

		if (params.prevPageExists === undefined && prevParams.prevPageExists != null) params.prevPageExists = prevParams.prevPageExists

		var paramsEqual = _.isEqual(prevParams, params)
		if (!prevParams.page) prevParams.page = params.page
		if (!prevParams.tags) prevParams.tags = params.tags

		if ((prevParams.tags === params.tags) && (prevParams.page !== params.page)) {
				if (prevParams.page > params.page) galleryActions.changePage(params.page, prevParams.prevPageExists)
				if (prevParams.page < params.page) galleryActions.changePage(params.page, prevParams.nextPageExists)
		}

		else if (wasPrevParams && paramsEqual) {
				galleryActions.isntLoading()
		}

		else {
				if (params.tags) params.tags = params.tags.split(',')

				if (prevParams.deletedTag) {
						if (!params.tags) params.tags = []
						params.tags.push(prevParams.deletedTag)
						delete prevParams.deletedTag
				}

				if (!params.tags) delete params.tags
				galleryActions.getPhotos({}, params)
		}

		prevParams = params
}



exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)