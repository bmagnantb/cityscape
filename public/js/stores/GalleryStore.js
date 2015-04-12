;(function(exports) {

var $ = require('jquery')
var { alt } = require('../alt-app')
var { galleryActions } = require('../actions/GalleryActions')
var React = require('react')

class GalleryStore {

	constructor() {
		this.requests = {}
		this.isLoading = <h2>Loading...</h2>
		this.tags = []

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
			changePage: galleryActions.changePage,
			vote: galleryActions.vote,
			cachedLoad: galleryActions.cachedLoad
		})
	}


	getPhotos(resp) {
		var { params, data } = resp
		this._dataToState(data, params)
	}


	changePage(routerParams) {
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest()) + 1

		// if requestPage is cached
		if (this.requests[this.searchId][this.requestPage]) {
			this._paginate(routerPage)
			this.isLoading = false
		}
		else {
			galleryActions.getPhotos(params)
		}
	}


	vote(resp) {
		this.paginate.currentPhotos.forEach((val) => {
			if (val.photo_id === resp.photo_id) {
				val.total_votes = resp.total_votes
				val.user_votes = resp.user_votes
				val.tag_votes = resp.tag_votes
				val.weighted_votes =  resp.weighted_votes
			}
		})
	}


	cachedLoad(routerParams) {
		// for creating route string
		this.isSearch = routerParams.tags ? true : false

		// cache ids
		if (!routerParams.tags) routerParams.tags = ['default-Request']
		this.searchId = routerParams.tags.join('')

		// current params
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest()) + 1
		this.requestPages = this.requests[this.searchId][this.requestPage].requestPages
		this.tags = this.requests[this.searchId][this.requestPage].tags.slice()

		this._paginate(routerParams.page)
		this.isLoading = false
	}



	_dataToState(data, routerParams) {
		// create owner url
		console.log(data)
		data.photo.forEach((val) => {
			if (val.owner) val._owner_url = `https://www.flickr.com/people/${val.owner}`
		})

		// for creating route string
		this.isSearch = routerParams.tags ? true : false

		// cache ids
		if (!routerParams.tags) routerParams.tags = ['default-Request']
		this.searchId = routerParams.tags.join('')
		this.requests[this.searchId] = []

		// save data in search-based cache and Flickr page-based
		this.requests[this.searchId][data.page] = {}
		this.requests[this.searchId][data.page] = data

		// set current info for easy access
		this.requestPage = data.page
		this.requestPages = data.pages
		this.tags = data.tags.slice()

		// paginate results for current page
		this._paginate(routerParams.page)

		this.isLoading = false
	}



	_paginate(routerPage) {
		this.paginate.maxPossiblePages = this._paginateTotalPages(true)
		this.paginate.availablePages = this._paginateTotalPages(false)
		this.paginate.currentPage = routerPage
		this.paginate.currentPhotos = this._paginateCurrentPhotos(routerPage),
		this.paginate.nextPageRoute = this._paginatePageRoute(routerPage + 1)
		this.paginate.prevPageRoute = this._paginatePageRoute(routerPage - 1)
	}



	// calc both maximum possible pages based on Flickr's page result and actually available pages in cache
	_paginateTotalPages(bool) {
		var pageConst = this.paginate.constants

		//get number of requests with full 500 results
		var numFullRequests

		// if true, get number of full requests that may exist -- up to largest index in requests
		if (bool) {
			numFullRequests = this.requests[this.searchId].length - 1
		}

		// if false, get actual number of full requests -- filter out any empty indices
		else {
			numFullRequests = this.requests[this.searchId].filter(function(val) {
				return val !== undefined
			}).length - 1
		}

		var pagesInFullRequests = numFullRequests * pageConst.pagesPerRequest()

		// last request possibly not 500 results
		var lastRequestIndex = this.requests[this.searchId].length - 1
		var picsInLastRequest = this.requests[this.searchId][lastRequestIndex].photo.length

		var pagesInLastRequest = Math.ceil(picsInLastRequest / pageConst.photosPerPage)

		// add 'em
		var pagesInAllRequests = pagesInFullRequests + pagesInLastRequest

		return pagesInAllRequests
	}



	_paginateCurrentPhotos(routerPage) {
		var pageConst = this.paginate.constants

		// more maths
		var numPrevRequests = this.requestPage - 1
		var browserPagesInPrevRequests = numPrevRequests * pageConst.pagesPerRequest()
		var pagesIntoCurrentRequest = routerPage - browserPagesInPrevRequests

		// adjust to 0 index
		var startPhotoIndex = (pagesIntoCurrentRequest - 1) * pageConst.photosPerPage

		// get those pics
		console.log(this.requests[this.searchId][this.requestPage].photo)
		console.log(this.requests[this.searchId][this.requestPage].photo.slice(
			startPhotoIndex,
			startPhotoIndex + pageConst.photosPerPage
		))
		return this.requests[this.searchId][this.requestPage].photo.slice(
			startPhotoIndex,
			startPhotoIndex + pageConst.photosPerPage
		)
	}



	_paginatePageRoute(newPage) {
		if (this.isSearch) return `/gallery/${this.tags.join(',')}/page${newPage}`
		else return `/gallery/page${newPage}`
	}
}

exports.galleryStore = alt.createStore(GalleryStore)

})(typeof module === 'object' ? module.exports : window)