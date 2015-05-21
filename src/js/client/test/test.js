/***************************************


NOT COMPLETE FIX THIS

methods that need testing:
GalleryView
	_changePage
	willTransitionTo



**************************************/


'use strict'

var mocha = require('mocha')
var chai = require('chai')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var Promise = require('bluebird')
var jsdom = require('jsdom')
var _ = require('lodash')

// testing stuff
var { expect } = chai
chai.use(require('chai-things'))
chai.use(require('chai-as-promised'))
chai.use(require('sinon-chai'))

// for setting up React
var React, TestUtils, stubs

// call after jsdom has setup DOM
// React determines if DOM is available when imported
function reactSetup() {
	React = require('react/addons')
	TestUtils = React.addons.TestUtils

	// need react/addons import instance in all tested files -- allows use of TestUtils
	// proxyquire needs '@global' set to true to override imports at all depths of a require call
	React['@global'] = true

	// get stubs, give it React instance
	stubs = proxyquire('./stubs', {'react': React})
}


describe('tests', () => {

	before((finish) => {
		// create browser environment
		// make window, document and navigator available globally for React compatibility
		jsdom.env({
			html: '<html><body></body></html>',
			done: (err, window) => {
				if (err != null) reject(err)
				global.window = window
				global.document = window.document
				global.navigator = window.navigator
				reactSetup()
				finish()
			}
		})
	})

	// --------------- CLIENTS --------------------

	describe('ServerClient.js', () => {

		describe('ServerClient', () => {

			var SC, sc

			before(() => {
				SC = proxyquire('../ServerClient', {jquery: stubs.jquery}).ServerClient
				sc = new SC({})
			})

			describe('#constructor', () => {
				it('should take options as argument and set to instance options', () => {
					expect(new SC({thingy: 'thing'})).to.have.property('options').with.property('thingy').that.equals('thing')
				})
			})

			describe('#requestPhotos', () => {
				it('should take settings obj as argument and request with that + instance options', () => {

					var request = sc.requestPhotos()
					var argsRequest = sc.requestPhotos({moreSettings: 'specificsearch'})

					expect(request).to.have.length(2)
					expect(request[0]).to.equal('/photos')
					expect(request[1]).to.be.instanceof(Object).with.keys('format', 'nojsoncallback')
					expect(argsRequest[1]).to.contain.key('moreSettings')
				})
			})

			describe('#requestPhoto', () => {
				it('should take settings obj and comma-separated tags string as argument and request with that + instance options', () => {

					var request = sc.requestPhoto()
					var argsRequest = sc.requestPhoto({moreSettings: 'specificsearch'}, 'china,shanghai')

					expect(request).to.have.length.within(2, 3)
					expect(request[0]).to.equal('/photo')
					expect(request[1]).to.be.instanceof(Object).with.keys('format', 'nojsoncallback')
					expect(argsRequest[0]).to.contain('china,shanghai')
				})
			})

			describe('#vote', () => {
				it('should take a photo_id, user, and tags and post with that + instance options', () => {

					var request = sc.vote(135033, stubs.parseUser)
					var tagsRequest = sc.vote(150346, stubs.parseUser, 'china,shanghai')

					expect(request).to.have.length(1)
					expect(request[0]).to.contain('135033').and.contain('person2')
					expect(tagsRequest[0]).to.contain('150346').and.contain('person2').and.contain('china,shanghai')
				})
			})
		})

		describe('GalleryClient', () => {

			var client, SC, galleryClient

			before(() => {
				client = require('../ServerClient')
				SC = client.ServerClient
				galleryClient = client.GalleryClient
			})

			it('should be instance of ServerClient', () => {
				expect(galleryClient).to.be.instanceof(SC)
			})

			describe('options', () => {
				it('should contain options for gallery view request', () => {
					expect(galleryClient.options).to.be.instanceof(Object).and.deep.equal({
						method: 'flickr.photos.search',
						content_type: '1',
						extras: [
							'url_m',
							'owner_name',
							'date_upload'
						],
						per_page: '500',
						sort: 'relevance',
						tag_mode: 'all',
						format: 'json',
						nojsoncallback: '1'
					})
				})
			})
		})

		describe('DetailClient', () => {

			var client, SC, detailClient

			before(() => {
				client = require('../ServerClient')
				SC = client.ServerClient
				detailClient = client.DetailClient
			})

			it('should be instance of ServerClient', () => {
				expect(detailClient).to.be.instanceof(SC)
			})

			describe('options', () => {
				it('should contain options for detail view request', () => {
					expect(detailClient.options).to.be.instanceof(Object).and.deep.equal({
						format: 'json',
						nojsoncallback: '1',
						method: 'flickr.photos.getInfo',
						extras: [
							'url_m'
						]
					})
				})
			})
		})
	})


	describe('alt-app.js', () => {

		var Alt, alt

		before(() => {
			Alt = require('alt')
			alt = require('../alt-app').alt
		})

		describe('alt', () => {
			it('should be instance of Alt', () => {
				expect(alt).to.be.instanceof(Alt)
			})
		})
	})


	describe('Router.jsx (routes)', () => {

		var router

		before(() => {
			router = require('../router/Router').router
		})

		describe('named routes', () => {

			var routes = {
				app:             { path: '/',                        handler: 'AppView'        },
				gallerysearch:   { path: '/gallery/:tags/page:page', handler: 'GalleryView'    },
				gallerynosearch: { path: '/gallery/page:page',       handler: 'GalleryView'    },
				gallerydefault:  { path: '/gallery',                 handler: 'GalleryAddPage' },
				photo:           { path: '/photo/:id/:tags?',        handler: 'DetailView'     },
				login:           { path: '/login',                   handler: 'LoginView'      },
				register:        { path: '/register',                handler: 'RegisterView'   },
				passemailsent:   { path: '/passemailsent',           handler: 'PassEmailView'  }
			}

			for (var key in routes) {
				describe(key+' route', () => {
					it('should have path '+routes[key].path, () => {
						expect(router.namedRoutes[key].path).to.equal(routes[key].path)
					})

					it ('should have a React handler named '+routes[key].handler, () => {
						expect(Object.getPrototypeOf(router.namedRoutes[key].handler)).to.equal(React.Component)
						expect(router.namedRoutes[key].handler.name).to.equal(routes[key].handler)
					})
				})
			}

		})
	})


	describe('defaultParams.js', () => {

		describe('GalleryAddPage', () => {

			var GalleryAddPage

			before(() => {
				GalleryAddPage = require('../router/defaultParams').GalleryAddPage
			})

			it('should be a React Component', () => {
				expect(Object.getPrototypeOf(GalleryAddPage)).to.equal(React.Component)
			})

			describe('willTransitionTo', () => {
				it('should add page 1 to router params w/o page', () => {
					expect(GalleryAddPage.willTransitionTo(stubs.transition, {})).to.equal('/gallery/page1')
					expect(GalleryAddPage.willTransitionTo(stubs.transition, {tags: 'germany'})).to.equal('/gallery/germany/page1')
				})
			})
		})
	})


	describe('components', () => {

		describe('AppView.jsx', () => {

			var mock, routerStub, headerFile, Header, AppView

			before(() => {
				routerStub = stubs.routerWithHandler(proxyquire('../components/PassEmailView', {'react': React}).PassEmailView)
				headerFile = proxyquire('../components/Header', {
					'../../../modules_other/react-router': routerStub,
					'react': React
				})
				Header = headerFile.Header
				AppView = proxyquire('../components/AppView', {
					'../actions/UserActions': stubs,
					'../stores/UserStore': stubs,
					'../../../modules_other/react-router': routerStub,
					'./Header': headerFile,
					'react': React
				}).AppView
				sinon.spy(stubs.userActions, 'current')
				mock = TestUtils.renderIntoDocument(<AppView params={{}} />)
			})

			after(() => {
				stubs.userActions.current.restore()
			})

			describe('#constructor', () => {
				it('should call userActions.current to init user info', () => {
					expect(stubs.userActions.current).to.have.callCount(1)
				})
			})

			describe('#render', () => {
				it('should render div with class app', () => {
					expect(React.findDOMNode(mock).tagName).to.equal('DIV')
					expect(React.findDOMNode(mock).className).to.equal('app')
				})

				it('should render with 2 children: Header & RouteHandler', () => {
					var children = TestUtils.findAllInRenderedTree(mock, function(component) {
						return component instanceof Header || component instanceof routerStub.RouteHandler
							? true
							: false
					})
					expect(children).to.have.length(2)
					expect(children).to.contain.something.that.is.instanceof(Header)
					expect(children).to.contain.something.that.is.instanceof(routerStub.RouteHandler)
				})
			})
		})


		describe('DetailView.jsx', () => {

			var mock, RouterContext, DetailView
			var photoId = '16879221559'
			var photoTag = 'china'

			before(() => {
				RouterContext = stubs.routerContext
				DetailView = proxyquire('../components/DetailView', {
					'../stores/DetailStore': stubs,
					'../stores/UserStore': stubs,
					'../actions/GalleryActions': stubs,
					'react': React
				}).DetailView
				sinon.spy(stubs.detailStore, 'listen')
				sinon.spy(stubs.detailStore, 'unlisten')
				sinon.spy(stubs.userStore, 'listen')
				sinon.spy(stubs.userStore, 'unlisten')
				sinon.spy(stubs.galleryActions, 'vote')
				var mockRender = TestUtils.renderIntoDocument(
					<RouterContext childComponent={DetailView} childParams={{id: photoId, tags: photoTag}} />
				)
				mock = TestUtils.findRenderedComponentWithType(mockRender, DetailView)
			})

			after(() => {
				stubs.detailStore.listen.restore()
				stubs.detailStore.unlisten.restore()
				stubs.userStore.listen.restore()
				stubs.userStore.unlisten.restore()
				stubs.galleryActions.vote.restore()
			})

			describe('#componentWillMount', () => {
				it('should register listener for detailStore', () => {
					expect(stubs.detailStore.listen).to.have.callCount(1)
				})

				it('should register listener for userStore', () => {
					expect(stubs.userStore.listen).to.have.callCount(1)
				})

				it('should initialize state', () => {
					expect(mock.state.detail).to.deep.equal(stubs.detailStore.getState()[mock.state.detail.photo_id])
				})
			})

			describe('#render', () => {
				it('should render an empty span if state.detail isnt there', () => {
					var mockRenderNoData = TestUtils.renderIntoDocument(<RouterContext childComponent={DetailView} childParams={{id: 2}} />)
					var mockNoData = TestUtils.findRenderedComponentWithType(mockRenderNoData, DetailView)
					expect(React.findDOMNode(mockNoData).tagName).to.equal('SPAN')
					expect(React.findDOMNode(mockNoData).hasChildNodes()).to.equal(false)
				})

				it('should render a main tag class photo-detail', () => {
					expect(React.findDOMNode(mock).tagName).to.equal('MAIN')
					expect(React.findDOMNode(mock).className).to.equal('photo-detail')
				})
			})

			describe('#_vote', () => {
				it('should call galleryActions.vote with id, user, and tags', () => {
					var voteNode = TestUtils.findRenderedDOMComponentWithClass(mock, 'upvote')
					TestUtils.Simulate.click(voteNode)
					expect(stubs.galleryActions.vote).to.have.callCount(1)
					expect(stubs.galleryActions.vote).to.have.been.calledWith(photoId, stubs.parseUser, photoTag)
				})
			})

			describe('#_detailInfo', () => {
				it('should return detailStore state', () => {
					expect(mock._detailInfo()).to.deep.equal(stubs.detailStore.getState()[photoId])
				})
			})

			describe('#_userInfo', () => {
				it('should return userStore state', () => {
					expect(mock._userInfo()).to.deep.equal(stubs.userStore.getState().user)
				})
			})

			describe('#_voteAllowed', () => {
				it('should return false if not given user and detail', () => {
					expect(mock._voteAllowed()).to.equal(false)
					expect(mock._voteAllowed('detail')).to.equal(false)
					expect(mock._voteAllowed(null, 'user')).to.equal(false)
				})

				it('should disallow voting if user already voted', () => {
					var user = { get: function() { return 'maplekurtz' } }
					var html = mock._voteAllowed(mock.state.detail, user)
					expect(html.type).to.equal('h6')
					expect(html.props).to.not.have.key('onClick')
				})

				it('should allow voting if user not voted', () => {
					var html = mock._voteAllowed(mock.state.detail, stubs.userStore.user)
					expect(html.props).to.include.key('onClick')
				})
			})


			describe('#_votesMarkup', () => {
				it('should return null if not given detail or if detail doesnt have either weighted_votes or total_votes', () => {
					expect(mock._votesMarkup()).to.equal(null)
					expect(mock._votesMarkup({})).to.equal(null)
					expect(mock._votesMarkup({some_votes: 5})).to.equal(null)
				})

				it('should return votes div if weighted_votes or total_votes exist on detail', () => {
					var htmls = [
						mock._votesMarkup({total_votes: 1}),
						mock._votesMarkup({weighted_votes: 3}),
						mock._votesMarkup({total_votes: 3, weighted_votes: 2})
					]
					htmls.forEach(function(html) {
						expect(html.type).to.equal('div')
						expect(html.props.className).to.equal('votes')
					})
				})

				it('should include voteAllowed markup if given as 2nd arg', () => {
					var html = mock._votesMarkup(mock.state.detail, mock._voteAllowed(mock.state.detail, stubs.userStore.user))
					expect(html.props.children[0].type).to.equal('h6')
					expect(html.props.children[0].props.className).to.equal('upvote')
				})
			})

			describe('#componentWillUnmount', () => {
				it('should unregister listener for detailStore', () => {
					mock.componentWillUnmount()
					expect(stubs.detailStore.unlisten).to.have.callCount(1)
					expect(stubs.userStore.unlisten).to.have.callCount(1)
				})
			})
		})

		describe('GalleryView', () => {

			var RouterContext, Photo, GalleryView, mockRender, mock

			before(() => {
				RouterContext = stubs.routerContext
				Photo = proxyquire('../components/Photo', {
					'react': React,
					'../actions/galleryActions': stubs,
					'../../../modules_other/react-router': stubs.routerLink
				}).Photo
				GalleryView = proxyquire('../components/GalleryView', {
					'react': React,
					'../../../modules_other/react-router': stubs.routerLink,
					'../actions/GalleryActions': stubs,
					'../stores/GalleryStore': stubs,
					'../actions/UserActions': stubs,
					'../stores/UserStore': stubs,
					'./Photo': Photo
				}).GalleryView
				sinon.spy(stubs.galleryStore, 'listen')
				sinon.spy(stubs.galleryStore, 'unlisten')
				sinon.spy(stubs.galleryStore, 'getState')
				sinon.spy(stubs.userStore, 'listen')
				sinon.spy(stubs.userStore, 'unlisten')
				sinon.spy(stubs.userStore, 'getState')
				mockRender = TestUtils.renderIntoDocument(<RouterContext childComponent={GalleryView} />)
				mock = TestUtils.findRenderedComponentWithType(mockRender, GalleryView)
				sinon.spy(mock, '_getCurrentPhotos')
				sinon.spy(mock, '_getTags')
			})

			after(() => {
				stubs.galleryStore.listen.restore()
				stubs.galleryStore.unlisten.restore()
				stubs.galleryStore.getState.restore()
				stubs.userStore.listen.restore()
				stubs.userStore.unlisten.restore()
				stubs.userStore.getState.restore()
			})

			describe('#componentWillMount', () => {
				it('should get state from gallery store and user store', () => {
					expect(stubs.galleryStore.listen).to.have.callCount(1)
					expect(stubs.userStore.listen).to.have.callCount(1)
				})
			})

			describe('#onGalleryChange', () => {
				it('should get state from gallery store', () => {
					expect(stubs.galleryStore.getState).to.have.callCount(1)
					mock.onGalleryChange()
					expect(stubs.galleryStore.getState).to.have.callCount(2)
				})
			})

			describe('#onUserChange', () => {
				it('should get state from user store', () => {
					expect(stubs.userStore.getState).to.have.callCount(1)
					mock.onUserChange()
					expect(stubs.userStore.getState).to.have.callCount(2)
				})
			})

			describe('#render', () => {

				after(() => {
					mock._getCurrentPhotos.restore()
					mock._getTags.restore()
				})
				it('should call #_getTags', () => {
					expect(mock._getTags).to.have.callCount(2)
				})

				it('should render a main tag with class loading if state.isLoading is true', () => {
					stubs.galleryStore.isLoading = true
					var mockRenderLoading = TestUtils.renderIntoDocument(<RouterContext childComponent={GalleryView} />)
					var mockLoading = TestUtils.findRenderedComponentWithType(mockRenderLoading, GalleryView)
					expect(React.findDOMNode(mockLoading).tagName).to.equal('MAIN')
					expect(React.findDOMNode(mockLoading).className).to.contain('loading')
					stubs.galleryStore.isLoading = false
				})

				it('should call #_getCurrentPhotos and render a main tag with class gallery if state.isLoading is false', () => {
					expect(mock._getCurrentPhotos).to.have.callCount(2)
					expect(React.findDOMNode(mock).tagName).to.equal('MAIN')
					expect(React.findDOMNode(mock).className).to.equal('gallery')
				})
			})

			describe('#_search', () => {

				var input

				before(() => {
					input = React.findDOMNode(mock.refs.search)
					sinon.spy(mock.context.router, 'transitionTo')
				})

				after(() => {
					mock.context.router.transitionTo.restore()
				})

				beforeEach(() => {
					mock.setState({isLoading: false, tags: []})
				})

				it('should set state.isLoading to true', () => {
					expect(mock.state.isLoading).to.equal(false)
					mock._search(stubs.event)
					expect(mock.state.isLoading).to.equal(true)
				})

				it('should call transitionTo with 1st arg gallerysearch and 2nd arg tags object with tags and page 1', () => {
					expect(mock.context.router.transitionTo).to.have.been.calledWith('gallerysearch')
					expect(mock.context.router.transitionTo.lastCall.args[1]).to.deep.equal({tags: [''], page: 1})
					input.value = 'austria vienna'
					mock._search(stubs.event)
					expect(mock.context.router.transitionTo).to.have.been.calledWith('gallerysearch')
					expect(mock.context.router.transitionTo.lastCall.args[1]).to.deep.equal({tags: ['austria', 'vienna'], page: 1})
				})


				it('should add any tags submitted in search bar to state.tags', () => {
					expect(mock.state.tags).to.not.include('berlin')
					input.value = 'berlin'
					mock._search(stubs.event)
					expect(mock.state.tags).to.include('berlin')
					input.value = 'shanghai china'
					mock._search(stubs.event)
					expect(mock.state.tags).to.include('berlin').and.include('shanghai').and.include('china')
				})
			})

			describe('#_removeTag', () => {

				var tags, tagValues, input

				before(() => {
					tags = TestUtils.scryRenderedDOMComponentsWithClass(mock, 'tag')
					tagValues = tags.map(function(tag) {
						return React.findDOMNode(tag).id.slice(3)
					})
					input = React.findDOMNode(mock.refs.search)
					sinon.spy(mock.context.router, 'transitionTo')
				})

				after(() => {
					mock.context.router.transitionTo.restore()
					mock.setState({isLoading: false})
				})

				it('should remove tag from state when x is clicked ', () => {
					TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithClass(tags[0], 'x'))
					tags = tags.slice(1)
					expect(mock.state.tags).to.not.contain(tagValues[0])
					expect(mock.state.tags).to.contain(tagValues[1]).and.contain(tagValues[2])
				})

				it('should set state.isLoading to true', () => {
					expect(mock.state.isLoading).to.equal(true)
				})

				it('should call transitionTo with 1st arg gallerysearch if tags present and 2nd arg with tags and page 1', () => {
					expect(mock.context.router.transitionTo).to.have.been.calledWith('gallerysearch')
					expect(mock.context.router.transitionTo.lastCall.args[1]).to.deep.equal({tags: ['shanghai', 'china'], page: 1})
				})

				it('should call transitionTo with 1st arg gallerynosearch if no tags and 2nd arg empty tags and page 1', () => {
					tags.forEach(function(val) {
						TestUtils.Simulate.click(TestUtils.findRenderedDOMComponentWithClass(val, 'x'))
					})
					expect(mock.state.tags).to.be.instanceof(Array).with.length(0)
					expect(mock.context.router.transitionTo).to.have.been.calledWith('gallerynosearch')
					expect(mock.context.router.transitionTo.lastCall.args[1]).to.deep.equal({page: 1})
				})
			})

			describe('#_changePage', () => {
				it('needs to be written', () => {
				})
			})

			describe('#_getCurrentPhotos', () => {

				var currentPhotos

				before(() => {
					currentPhotos = mock._getCurrentPhotos()
				})

				it('should return photos in state.paginate.currentPhotos', () => {
					expect(currentPhotos).to.be.instanceof(Array).with.length(mock.state.paginate.currentPhotos.length)
					currentPhotos.forEach(function(val, ind) {
						expect(currentPhotos[0].props.photo).to.equal(mock.state.paginate.currentPhotos[ind])
					})
				})

				it('should return photos as Photo components', () => {
					expect(currentPhotos[0].type).to.equal(Photo.Photo)
				})

				it('should return <h2>No results</h2> if no photos available in state', () => {
					mock.state.paginate.currentPhotos = []
					currentPhotos = mock._getCurrentPhotos()
					expect(currentPhotos.type).to.equal('h2')
					expect(currentPhotos.props.children).to.equal('No results')
					mock.setState(stubs.galleryStore.getState())
				})
			})

			describe('#_getTags', () => {

				var tags

				before(() => {
					tags = mock._getTags()
				})

				it('should return nothing if no tags in state', () => {
					expect(tags).to.not.exist
				})

				it('should return a div with class tags', () => {
					mock.setState({tags: ['tokyo', 'japan']})
					tags = mock._getTags()
					expect(tags.type).to.equal('div')
					expect(tags.props.className).to.equal('tags')
				})

				it('should contain a child for each tag', () => {
					expect(tags.props.children).to.be.instanceof(Array).with.length(mock.state.tags.length)
				})

				it('should have a span tag with id tag+tagValue as each child', () => {
					tags.props.children.forEach(function(val, ind) {
						expect(val.type).to.equal('span')
						expect(val.props.id).to.equal(`tag${mock.state.tags[ind]}`)
					})
				})


				it('should have 2 spans within each tag span, tagValue in first, x with click handler in second', () => {
					var tagValues = mock.state.tags
					tags.props.children.forEach((val, ind) => {
						expect(val.props.children).to.be.instanceof(Array).with.length(2)
						expect(val.props.children[0].type).to.equal('span')
						expect(val.props.children[0].props.children).to.equal(tagValues[ind])
						expect(val.props.children[1].type).to.equal('span')
						expect(val.props.children[1].props.children).to.equal('x')
						expect(val.props.children[1].props.onClick).to.be.instanceof(Function)
					})
				})
			})

			describe('#willTransitionTo', () => {
				it('needs to be written', () => {
				})
			})

			describe('#componentWillUnmount', () => {
				before(() => {
					mock.componentWillUnmount()
				})

				it('should unregister userStore listener', () => {
					expect(stubs.userStore.unlisten).to.have.been.calledOnce
				})

				it('should unregister galleryStore listener', () => {
					expect(stubs.galleryStore.unlisten).to.have.been.calledOnce
				})
			})
		})
	})


})