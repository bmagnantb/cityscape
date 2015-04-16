/***************************************


NOT CURRENT FIX THIS


**************************************/


'use strict'

// make testing suite
var Mocha = require('mocha')
var Chai = require('chai')
var sinon = require('sinon')
var proxyquire = require('proxyquire')

Chai.use(require('chai-things'))
Chai.use(require('chai-as-promised'))
Chai.use(require('sinon-chai'))

var { expect } = Chai


// function to create browser environment -- when window global is needed
var jsdom = require('jsdom')
var clientEnv = (callback) => {
	jsdom.env({
		html: '<html><body></body></html>',
		done(err, window) {
			global.window = window
			global.getComputedStyle = window.getComputedStyle
			callback()
		}
	})
}


// parse initialize breaks tests
var parseStub = {}
parseStub.Parse = function() {}




// --------------- CLIENTS --------------------

describe('ServerClient.js', () => {

	describe('ServerClient', () => {

		var SC, sc, userStub

		before(() => {
			var jqueryStub = {
				get: function() { return arguments },
				post: function() { return arguments }
			}

			userStub = function(username) {
				return {
					get: function(key) {
						return username
					}
				}
			}

			SC = proxyquire('../ServerClient', {jquery: jqueryStub}).ServerClient
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

				var person1 = userStub('person1')
				var person4 = userStub('person4')
				var request = sc.vote(135033, person1)
				var tagsRequest = sc.vote(150346, person4, 'china,shanghai')

				expect(request).to.have.length(1)
				expect(request[0]).to.contain('135033').and.contain('person1')
				expect(tagsRequest[0]).to.contain('150346').and.contain('person4').and.contain('china,shanghai')
			})
		})
	})

	describe('GalleryClient', () => {

		var SC, galleryClient

		before(() => {
			var file = require('../ServerClient')
			SC = file.ServerClient
			galleryClient = file.GalleryClient
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

		var SC, detailClient

		before(() => {
			var file = require('../ServerClient')
			SC = file.ServerClient
			detailClient = file.DetailClient
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

	var React, router

	before(() => {
		React = require('react')
		router = require('../router/Router').router
		console.log(router.namedRoutes.gallerydefault.path)
	})

	describe('named routes', () => {

		var routes = {
			app: {             path: '/',                        handler: 'AppView' },
			gallerysearch: {   path: '/gallery/:tags/page:page', handler: 'GalleryView' },
			gallerynosearch: { path: '/gallery/page:page',       handler: 'GalleryView' },
			gallerydefault: {  path: '/gallery',                 handler: 'GalleryAddPage' },
			photo: {           path: '/photo/:id/:tags?',        handler: 'DetailView' },
			login: {           path: '/login',                   handler: 'LoginView' },
			register: {        path: '/register',                handler: 'RegisterView' },
			passemailsent: {   path: '/passemailsent',           handler: 'PassEmailView' }
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

		var React, GalleryAddPage, transitionStub

		before(() => {
			React = require('react')
			GalleryAddPage = require('../router/defaultParams').GalleryAddPage
			transitionStub = { redirect: function(newHash) { return newHash } }
		})

		it('should be a React Component', () => {
			expect(Object.getPrototypeOf(GalleryAddPage)).to.equal(React.Component)
		})

		describe('willTransitionTo', () => {
			it('should add page 1 to router params w/o page', () => {
				expect(GalleryAddPage.willTransitionTo(transitionStub, {})).to.equal('/gallery/page1')
				expect(GalleryAddPage.willTransitionTo(transitionStub, {tags: 'germany'})).to.equal('/gallery/germany/page1')
			})
		})
	})
})


describe('components', () => {

	var React = require('react/addons')
	var userActionsStub = {
		userActions: {
			current: function() {
				return 'currentUser'
			}
		}
	}

	describe('AppView.jsx', () => {

		var AppView, app_view

		before(() => {
			sinon.spy(userActionsStub.userActions, 'current')
			AppView = proxyquire('../components/AppView', { '../actions/UserActions': userActionsStub }).AppView
			app_view = new AppView()
		})

		after(() => {
			userActionsStub.userActions.current.restore()
		})

		it('should be a React Component', () => {
			expect(Object.getPrototypeOf(AppView)).to.equal(React.Component)
		})

		describe('#constructor', () => {
			it('should initialize state to {}', () => {
				expect(app_view.state).to.deep.equal({})
			})

			it('should call userActions.current to init user info', () => {
				expect(userActionsStub.userActions.current.callCount).to.equal(1)
			})
		})
	})


	describe('DetailView', () => {

		var DetailView, detail_view

		before(() => {
			sinon.spy(userActionsStub.userActions, 'current')
			DetailView = require('../components/DetailView', { '../actions/UserActions': userActionsStub }).DetailView
			detail_view = new DetailView()
		})

		describe('#constructor', () => {
			it('should init state to {}', () => {
				expect(detail_view.state).to.deep.equal({})
			})
		})
	})
})
