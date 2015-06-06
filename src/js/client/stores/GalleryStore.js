import React from 'react'
import _ from 'lodash'

var storeName = 'gallery'

class GalleryStore {
	constructor() {
		this.actions = this.alt.getActions('gallery')
		this.requestParamsCurrent = {}
		this.requestParamsHistory = []
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
			nextPageParams: null,
			prevPageParams: null
		}

		this.bindListeners({
			getPhotos: this.actions.getPhotos,
			changePage: this.actions.changePage,
			vote: this.actions.vote,
			cachedLoad: this.actions.cachedLoad,
			setLoading: this.actions.setLoading
		})
	}

	getPhotos(action) {
		var data = action.res.body.photos
		this.requestParamsCurrent = action.routerParams
		this.requestParamsHistory.push(action.routerParams)
		this._dataToState(data, action.params)
	}

	changePage(routerParams) {
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest) + 1

		// if requestPage is cached
		if (this.requests[this.searchId][this.requestPage]) {
			this._paginate(routerParams.page)
		}
		else {
			this.alt.getActions('gallery').getPhotos.defer(routerParams)
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
		this.requestParamsCurrent = routerParams

		// for creating route string
		this.isSearch = routerParams.tags ? true : false

		// cache ids
		this.searchId = routerParams.tags ? routerParams.tags : 'default-Request'

		// current params
		this.requestPage = Math.floor((routerParams.page - 1) / this.paginate.constants.pagesPerRequest) + 1
		this.requestPages = this.requests[this.searchId][this.requestPage].requestPages
		this.tags = this.requests[this.searchId][this.requestPage].tags.slice()

		this._paginate(routerParams.page)
		this.isLoading = false
	}

	setLoading() {
		this.isLoading = true
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

		// save data in search-based and Flickr page-based cache
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
		this.paginate.maxPossiblePages = this._paginateMaxPages()
		this.paginate.availablePages = this._paginateAvailablePages()
		this.paginate.currentPage = +routerPage
		this.paginate.currentPhotos = this._paginateCurrentPhotos(+routerPage)
		this.paginate.nextPageExists = this._paginatePageExists(+routerPage + 1)
		this.paginate.prevPageExists = this._paginatePageExists(+routerPage - 1)
		this.paginate.nextPageParams = this._paginatePageParams(+routerPage + 1)
		this.paginate.prevPageParams = this._paginatePageParams(+routerPage - 1)
	}

	_paginateMaxPages() {
		var pageConst = this.paginate.constants

		// get number of pages that could exist -- based on total pic count from Flickr
		var maxPossiblePics = +this.requests[this.searchId][this.requestPage].total
		var maxPossiblePages = maxPossiblePics / pageConst.photosPerPage

		return maxPossiblePages
	}

	_paginateAvailablePages() {
		var pageConst = this.paginate.constants

		// filter out any empty indices and don't include last request
		var numFullRequests = this.requests[this.searchId].filter(function(val) {
			return val !== undefined
		}).length - 2

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

	_paginatePageExists(newPage) {
		// page zero doesn't exist
		if (newPage === 0) return false
		if (newPage > this.paginate.maxPossiblePages) return false
		return true
	}

	_paginatePageParams(newPage) {
		var params = _.assign({}, this.requestParamsCurrent, {page: newPage})
		return params
	}
}

export default { store: GalleryStore, name: storeName }
