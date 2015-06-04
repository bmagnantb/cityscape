import React from 'react'

class GalleryStore {

	constructor() {
		this.actions = this.alt.getActions('gallery')
		this.requestParams = []
		this.requests = {}
		this.isLoading = <h2>Loading...</h2>
		this.tags = []

		// browser-side pagination
		this.paginate = {
			constants: {
				photosPerPage: 20,
				photosPerRequest: 500,
				pagesPerRequest: 25
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
			getPhotos: this.actions.getPhotos,
			changePage: this.actions.changePage,
			vote: this.actions.vote,
			cachedLoad: this.actions.cachedLoad
		})
	}


	getPhotos(action) {
		var data = action.res.body.photos
		this.requestParams.push(action.routerParams)
		this._dataToState(data, action.params)
	}


	changePage(routerParams) {
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest) + 1

		// if requestPage is cached
		if (this.requests[this.searchId][this.requestPage]) {
			this._paginate(routerPage)
			this.isLoading = false
		}
		else {
			this.actions.getPhotos(params)
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
		console.log('cachedLoad params', routerParams)
		// for creating route string
		this.isSearch = routerParams.tags ? true : false

		console.log(this.isSearch)

		// cache ids
		this.searchId = routerParams.tags ? routerParams.tags : 'default-Request'

		// current params
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest) + 1
		this.requestPages = this.requests[this.searchId][this.requestPage].requestPages
		this.tags = this.requests[this.searchId][this.requestPage].tags.slice()

		console.log('cachedLoad store tags', this.tags)

		this._paginate(routerParams.page)
		this.isLoading = false
	}


	_dataToState(data, routerParams) {
		// create owner url
		data.photo.forEach((val) => {
			if (val.owner) val._owner_url = `https://www.flickr.com/people/${val.owner}`
		})

		// for creating route string
		this.isSearch = routerParams.tags ? true : false

		// cache ids
		this.searchId = routerParams.tags ? routerParams.tags : 'default-Request'
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

		var pagesInFullRequests = numFullRequests * pageConst.pagesPerRequest

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
		var browserPagesInPrevRequests = numPrevRequests * pageConst.pagesPerRequest
		var pagesIntoCurrentRequest = routerPage - browserPagesInPrevRequests

		// adjust to 0 index
		var startPhotoIndex = (pagesIntoCurrentRequest - 1) * pageConst.photosPerPage

		// get those pics
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

export default { store: GalleryStore, name: 'gallery' }
