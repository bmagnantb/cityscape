;(function(exports) {

var React = require('react')
var { galleryActions } = require('../actions/GalleryActions')
var { galleryStore } = require('../stores/GalleryStore')
var { userActions } = require('../actions/UserActions')
var { userStore } = require('../stores/UserStore')
var { Link } = require('../react-router')



class GalleryView extends React.Component {

		constructor() {
				super()
				this.state = galleryStore.getState()
				this.state.user = userStore.getState().user
				this.state.isLoading = <h2>Loading</h2>
		}



		componentWillMount() {
				var routerParams = this.context.router.getCurrentParams()
				userActions.current()
		}



		componentDidMount() {
				userStore.listen(this.onUserChange.bind(this))
				galleryStore.listen(this.onGalleryChange.bind(this))
		}



		componentWillUnmount() {
				userStore.unlisten(this.onUserChange.bind(this))
				galleryStore.unlisten(this.onGalleryChange.bind(this))
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
				var photos = this.state.paginate.currentPhotos.map((photo) => {
						return <Photo photo={photo} user={this.state.user} key={photo.id} />
				})

				if (!photos.length && !this.state.isLoading) photos = <h2>No results</h2>

				var tags = this.state.tags.map((tag) => {
						var id = `tag${tag}`
						return (
								<span key={tag} id={id}>
										&nbsp;{tag}&nbsp;
										<span onClick={this.removeTag.bind(this)}>X</span>&nbsp;
								</span>
						)
				})

				return (
						<main className="gallery">
								<form onSubmit={this.search.bind(this)}>
										<input type="search" ref="search" />
								</form>
								<div className="tags">
										{tags}
								</div>
								<div className="photos">
										{this.state.isLoading}
										{photos}
								</div>
								<div>
										{this.state.paginate.prevPageExists ?
												<Link to={this.state.paginate.prevPageRoute} onClick={this.changePage.bind(this)}>Prev</Link> :
												null}

										<h6>{this.state.paginate.currentPage}</h6>

										{this.state.paginate.nextPageExists ?
												<Link to={this.state.paginate.nextPageRoute} onClick={this.changePage.bind(this)}>Next</Link> :
												null}
								</div>
						</main>
				)
		}



		search(e) {
				e.preventDefault()
				var addedTags = React.findDOMNode(this.refs.search).value.split(' ')
				var tags = this.state.tags.concat(addedTags)
				if (tags) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
				else this.context.router.transitionTo('gallerynosearch', {page: 1})
				React.findDOMNode(this.refs.search).value = ''
				this.setState({isLoading: <h2>Loading</h2>})
		}



		removeTag(e) {
				console.log('click')
				var tag = e.target.parentNode.id.slice(3)
				var tags = this.state.tags.slice()
				tags.splice(this.state.tags.indexOf(tag), 1)
				prevParams.deletedTag = `-${tag}`
				if (tags) this.context.router.transitionTo('gallerysearch', {tags: tags, page: 1})
				else this.context.router.transitionTo('gallerynosearch', {page: 1})
				// this.context.router.transitionTo('gallery', {tags: tags})
				this.setState({isLoading: <h2>Loading</h2>})
		}



		changePage() {
				if (this.nextPageExists === 'request') this.setState({isLoading: <h2>Loading</h2>})
				if (this.prevPageExists === 'request') this.setState({isLoading: <h2>Loading</h2>})
		}
		// prevPage() {
		// 		var routerParams = this.context.router.getCurrentParams()
		// 		this.context.router.transitionTo(this.isSearch)
		// 		galleryActions.changePage(this.state.paginate.currentPage - 1, this.state.prevPageExists)
		// }



		// nextPage() {
		// 		galleryActions.changePage(this.state.paginate.currentPage + 1, this.state.nextPageExists)
		// }
}


GalleryView.contextTypes = {
				router: React.PropTypes.func.isRequired
		}

var prevParams = {}
GalleryView.willTransitionTo = function(transition, params) {
		if (!prevParams.page) prevParams.page = params.page
		if (!prevParams.tags) prevParams.tags = params.tags
		if ((prevParams.tags === params.tags) && (prevParams.page !== params.page)) {
				console.log('page change')
				if (prevParams.page > params.page) galleryActions.changePage(params.page, prevParams.prevPageExists)
				if (prevParams.page < params.page) galleryActions.changePage(params.page, prevParams.nextPageExists)
		}
		else {
				if (params.tags) params.tags = params.tags.split(',')
				if (prevParams.deletedTag) {
						if (!params.tags) params.tags = []
						params.tags.push(prevParams.deletedTag)
						delete prevParams.deletedTag
				}
				if (!params.tags) delete params.tags
				console.log(params)
				galleryActions.getPhotos({}, params)
		}
		prevParams = params
}









class Photo extends React.Component {

		constructor() {
				super()
		}


		render() {
				return (
						<div className="photo">
								<Link to="/photo/:id" params={{id: this.props.photo.id}}>
										<img src={this.props.photo.url_m} />
								</Link>

								{this.props.user && this.props.photo.user_votes.indexOf(this.props.user.get('username')) === -1 ?
										<h6 ref="vote" onClick={this.vote.bind(this)}>Yes</h6> :
										null}

								<h6>{this.props.photo.total_votes}</h6>
								<Link to="/photo/:id" params={{id: this.props.photo.id}}>
										<h4>{this.props.photo.title}</h4>
								</Link>
								<a href={this.props.photo.owner_url} target="_blank">
										<h4>{this.props.photo.ownername}</h4>
								</a>
						</div>
				)
		}


		vote() {
				galleryActions.vote(this.props.photo.id, this.props.user)
		}
}


exports.GalleryView = GalleryView

})(typeof module === 'object' ? module.exports : window)