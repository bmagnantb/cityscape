;(function(exports) {

var $ = require('jquery')
var { alt } = require('../alt-app')
var { galleryActions } = require('../actions/GalleryActions')

class GalleryStore {

		constructor() {
				this.requests = []
				this.requestPage = null
				this.requestPages = null
				this.tags = []
				this.isSearch = ''

				// browser-side pagination
				this.paginate = {
						constants: {
							photosPerPage: 20,
							photosPerRequest: 500,
							pagesPerRequest: () => {
									return this.paginate.constants.photosPerRequest / this.paginate.constants.photosPerPage
								}
						},
						totalPages: null,
						currentPage: 1,
						currentPhotos: [],
						nextPageExists: false,
						prevPageExists: false,
						nextPageRoute: null,
						prevPageRoute: null
				}

				this.bindListeners({
						getPhotos: galleryActions.getPhotos,
						changePage: galleryActions.changePage
				})
		}



		getPhotos(obj) {
				var { params, data } = obj

				this._dataToState(data, params)
		}


		changePage(routerPage) {
				this._paginate(routerPage)
		}



		_dataToState(data, routerParams) {
				if (data.tags !== this.tags) this.requests = []
				this.requests[data.page] = {}

				data.photo.forEach((val) => {
						if (val.owner) val.owner_url = `https://www.flickr.com/people/${val.owner}`
				})

				for (var key in data) {
						this.requests[data.page][key] = data[key]
				}

				this.requestPage = data.page
				this.requestPages = data.pages
				this.tags = data.tags
				this.tags.length === 0 ? this.isSearch = '' : this.isSearch = `/search=${this.tags.join(',')}`

				this._paginate(routerParams.page)
		}



		_paginate(routerPage) {
				this.paginate.totalPages = this._paginateTotalPages()
				this.paginate.currentPage = routerPage
				this.paginate.currentPhotos =this._paginateCurrentPhotos(routerPage),
				this.paginate.nextPageExists = this._paginatePageExists('+', routerPage)
				this.paginate.prevPageExists = this._paginatePageExists('-', routerPage)
				this.paginate.nextPageRoute = this._paginatePageRoute('+', routerPage)
				this.paginate.prevPageRoute = this._paginatePageRoute('-', routerPage)
		}



		_paginateTotalPages() {
				// pages in current request
				var pages = Math.ceil(this.requests[this.requestPage].photo.length / this.paginate.constants.photosPerPage)
				// pages in request and requests before
				console.log(pages)
				return pages
		}



		_paginateCurrentPhotos(routerPage) {
			// photo position == currentBrowserPage - totalBrowserPages in previous requests - 1 (index alignment) * photos per page
				var pageConst = this.paginate.constants
				var startPhotoIndex = ((routerPage - ((this.requestPage - 1) * pageConst.pagesPerRequest())) - 1) * pageConst.photosPerPage

				return this.requests[this.requestPage].photo.slice(
						startPhotoIndex,
						startPhotoIndex + pageConst.photosPerPage
				)
		}



		_paginatePageExists(change, routerPage) {
				if (change === '+') {
						if (routerPage < this.paginate.totalPages) return 'no-request'
						if (this.page < this.pages) return 'request'
						return false
				}
				if (change === '-') {
						if (routerPage - 1 > (this.requestPage - 1) * 20) return 'no-request'
						if (this.requests[this.requestPage - 1]) return 'no-request'
						if (routerPage - 1 === 0) return false
						return 'request'
				}
		}



		_paginatePageRoute(change, routerPage) {
				return `/gallery${this.isSearch}/page${eval(routerPage+change+1)}`
		}
}

exports.galleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)