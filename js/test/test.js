"use strict"

// make testing suite
var Mocha = require('mocha')
var Chai = require('chai')
Chai.use(require('chai-things'))
Chai.use(require('chai-as-promised'))

var assert = Chai.assert
var expect = Chai.expect


// function to create browser environment -- when window is needed
var jsdom = require('jsdom')
var fs = require('fs')
var clientEnv = (callback) => {
		jsdom.env({
				html: '<html><body></body></html>',
				done(errs, window) {
						global.window = window
						global.getComputedStyle = window.getComputedStyle
						callback()
				}
		})
}

// require files that don't need browser environment
var Alt = require('alt')
var alt = require('../alt-app').alt

var React = require('react')
var Router = require('../react-router')

var flickrMakeUrl = require('../FlickrMakeUrl').flickrMakeUrl

var PassEmailView = require('../components/PassEmailView').PassEmailView
var Footer = require('../components/Footer').Footer



// --------------- CLIENTS --------------------

describe('FlickrMakeUrl', () => {

		var noErrorUrl

		beforeEach((done) => {
				noErrorUrl = flickrMakeUrl({method: 'hey', api_key: 'alksdgh'})
				done()
		})

		it('should always return function on first call', () => {
				// call with 'options' as argument after first call returns options object
				expect(flickrMakeUrl('options')).to.be.instanceof(Function)
				// call with any object returns function on any number of calls
				expect(flickrMakeUrl({})).to.be.instanceof(Function)
				// non-object call after first call creates url
				expect(flickrMakeUrl()).to.be.instanceof(Function)
				expect(flickrMakeUrl(undefined)).to.be.instanceof(Function)
				expect(flickrMakeUrl(0)).to.be.instanceof(Function)
				expect(flickrMakeUrl('hey')).to.be.instanceof(Function)
				expect(flickrMakeUrl([])).to.be.instanceof(Function)
		})

		it('should return "options" if given "options" as argument and no settings present', () => {
				expect(flickrMakeUrl('options')()).to.equal('options')
				expect(flickrMakeUrl()('options')).to.equal('options')
		})

		it('should return settings object if given "options" as argument after receiving settings', () => {
				expect(noErrorUrl('options')).to.be.an('object').and.have.ownProperty('api_key').and.have.ownProperty('method')
				// expect(noErrorUrl({things: 'some'})('options')).to.be.an('object').and.have.property('things')
		})

		it('should throw error if never given method or api_key', () => {
				expect(flickrMakeUrl({method: 'hey'})).to.throw(Error)
				expect(flickrMakeUrl({api_key: 'aklsdgh'})).to.throw(Error)
				expect(noErrorUrl).to.not.throw(Error)
		})

		it('should return function when given arguments', () => {
				expect(noErrorUrl).to.be.instanceof(Function)
		})

		it('should return url string when has method and api_key and given no arguments', () => {
				expect(noErrorUrl()).to.be.a('string')
		})

		it('should add options when given as argument object', () => {
				expect(noErrorUrl({funtimes: 'lots'})('options')).has.property('funtimes', 'lots')
				expect(noErrorUrl({things: 'some', yeas: 'none'})('options')).has.ownProperty('things').and.has.property('yeas', 'none')
		})

		it('should include options in url', () => {
				expect(noErrorUrl({funtimes: 'lots'})()).to.contain('funtimes').and.contain('lots')
				expect(noErrorUrl({things: 'some', yeas: 'none'})()).to.contain('things').and.contain('some').and.contain('yeas').and.contain('none')
		})

		it('should create array on key if given tags or extras', () => {
				expect(noErrorUrl({tags: 'stuff'})('options')).has.property('tags').is.instanceof(Array).with.length(1).and.contains('stuff')
				expect(noErrorUrl({extras: 'all'})('options')).has.property('extras').is.instanceof(Array).with.length(1).and.contains('all')
		})

		it('should create tags/extras array, split string at spaces and turn into array', () => {
				expect(noErrorUrl({tags: 'stuff china'})('options')).has.property('tags').is.instanceof(Array).with.length(2).and.contains('stuff').and.contains('china')
				expect(noErrorUrl({extras: 'all none'})('options')).has.property('extras').is.instanceof(Array).with.length(2).and.contains('all').and.contains('none')
		})

		it('should create tags/extras array, use array if entered as such', () => {
				expect(noErrorUrl({tags: ['stuff', 'china']})('options')).has.property('tags').is.instanceof(Array).with.length(2).and.contains('stuff').and.contains('china')
				expect(noErrorUrl({extras: ['all', 'none']})('options')).has.property('extras').is.instanceof(Array).with.length(2).and.contains('all').and.contains('none')
		})

		it('should add additional tags/extras to existing array, space-separated', () => {
				var existingArrays = noErrorUrl({tags: ['stuff', 'china'], extras: ['all', 'none']})
				expect(existingArrays({tags: 'germany austria'})('options')).has.property('tags').is.instanceof(Array).with.length(4).and.contains('germany').and.contains('austria')
				expect(existingArrays({extras: 'pedestrian diner'})('options')).has.property('extras').is.instanceof(Array).with.length(4).and.contains('pedestrian').and.contains('diner')
		})

		it('should default format=json with nojsoncallback=1 when returns url', () => {
				expect(noErrorUrl()).to.contain('format=json').and.contain('nojsoncallback=1')
		})
})


describe('FlickrClient', () => {

		var FC, fc

		beforeEach((done) => {
				clientEnv(() => {
						FC = require('../FlickrClient').FC
						fc = new FC()
						done()
				})
		})

		describe('#constructor', () => {
				it('should create instance of FlickrClient', () => {
						expect(new FC()).to.be.instanceof(FC)
						expect(fc).to.be.instanceof(FC)
				})

				it('should take url as argument and set on instance', () => {
						expect(new FC('hello')).to.have.property('url', 'hello')
				})
		})
})







// ---------------- ROUTER -------------------

describe('router', () => {

		var router,
		Redirect = Router.Redirect,
		Route = Router.Route,
		routerState,
		routerHandler,
		hash

		before((done) => {
				clientEnv(() => {
						router = require('../Router').router
						router.run(function(Handler, state) {
								routerState = state
								routerHandler = Handler
						})
						done()
				})
		})

		describe('#run', () => {
				it('should initialize router with path /', () => {
						expect(routerState).to.have.property('path', '/')
						expect(routerState).to.have.property('routes').that.is.instanceof(Array)
						expect(routerState.routes[0]).to.have.property('handler').that.exists
						expect(routerState.routes[0]).to.have.property('path', '/')
						expect(routerState.routes[0]).to.have.property('defaultRoute').that.equals(routerState.routes[1])
				})
		})

		describe('#routes', () => {
				it('should have single parent route named "app"', () => {
						expect(router.routes).to.be.instanceof(Array).with.length(1)
						expect(router.routes[0]).to.have.property('name', 'app')
				})

				describe('app route', () => {
						it('should have handler', () => {
								expect(router.routes[0]).to.have.property('handler')
						})

						it('should have path "/"', () => {
								expect(router.routes[0]).to.have.property('path', '/')
						})

						it('should have a default route', () => {
								expect(router.routes[0]).to.have.property('defaultRoute')
						})

						it('should have multiple child routes', () => {
								expect(router.routes[0]).to.have.property('childRoutes').that.is.instanceof(Array).with.length.above(1)
						})
				})
		})
})








// ------------- ALT APP -------------------

describe('alt', () => {
		it('should be an instance of Alt', () => {
				expect(alt).to.be.instanceof(Alt)
		})
})








// ------------- STORES -------------------

describe('galleryStore', () => {

		var galleryStore, GalleryStore, actions

		before((done) => {
				clientEnv(() => {
						actions = alt.generateActions('getPhotos', 'setTags')
						GalleryStore = require('../stores/GalleryStore').GalleryStore
						class GalleryStoreTest extends GalleryStore {
								constructor() {
										super()
										this.bindListeners({
												getPhotos: actions.getPhotos,
												setTags: actions.setTags
										})
								}
						}
						galleryStore = alt.createStore(GalleryStoreTest)
						done()
				})
		})

		describe('#constructor', () => {
				it('should create initial state', () => {
						expect(galleryStore.getState()).to.be.an('object').and.have.property('photo').and.is.instanceof(Array).with.length(0)
						expect(galleryStore.getState()).to.have.property('page', null)
						expect(galleryStore.getState()).to.have.property('tags').and.is.instanceof(Array).with.length(0)
						expect(galleryStore.getState()).to.have.property('extras').and.is.instanceof(Array).with.length(0)
				})
		})

		describe('#getPhotos', () => {
				it('should set any property on state from action.getPhotos data', () => {
						actions.getPhotos({photo: 'photo'})
						expect(galleryStore.getState()).to.have.property('photo', 'photo')
						actions.getPhotos({photo: 'china', page: 5})
						expect(galleryStore.getState()).to.have.property('photo', 'china')
						expect(galleryStore.getState()).to.have.property('page', 5)
						expect(galleryStore.getState()).to.not.have.property('isFromFlickr')
						actions.getPhotos({photo: {color: 'red', size: '1024'}, page: 63, isFromFlickr: 'yes'})
						expect(galleryStore.getState()).to.have.property('photo').that.is.instanceof(Object).and.has.property('color', 'red')
						expect(galleryStore.getState()).to.have.property('page', 63)
						expect(galleryStore.getState()).to.have.property('isFromFlickr', 'yes')
				})
		})

		describe('#setTags', () => {
				it('should add tags to state.tags from action.setTags array', () => {
						actions.setTags(['china'])
						expect(galleryStore.getState().tags).to.be.instanceof(Array).with.length(1).and.contain('china')
						actions.setTags(['kowloon', 'hong kong', 'guangzhou', 'sichuan'])
						expect(galleryStore.getState().tags).to.be.instanceof(Array).with.length(5).and.contain('china').and.contain('kowloon').and.contain('hong kong').and.contain('guangzhou').and.contain('sichuan')
				})

				it('should delete tags with "-" prefix from state.tags array', () => {
						actions.setTags(['-hong kong'])
						expect(galleryStore.getState().tags).to.be.instanceof(Array).with.length(4).and.contain('china').and.contain('kowloon').and.contain('guangzhou').and.contain('sichuan')
						actions.setTags(['-sichuan', '-china'])
						expect(galleryStore.getState().tags).to.be.instanceof(Array).with.length(2).and.contain('kowloon').and.contain('guangzhou')
				})
		})

})


describe('userStore', () => {

		var userStore, UserStore, actions

		before((done) => {
				clientEnv(() => {
						actions = alt.generateActions('setUser')
						UserStore = require('../stores/UserStore').UserStore
						class UserStoreTest extends UserStore {
								constructor() {
										super()
										this.bindListeners({
												setUser: actions.setUser
										})
								}
						}
						userStore = alt.createStore(UserStoreTest)
						done()
				})
		})

		describe('#constructor', () => {
				it('should set username to null', () => {
						expect(userStore.getState()).to.be.an('object').and.have.property('user', null)
				})
		})

		describe('#setUser', () => {
				it('should set username to data from actions.setUser', () => {
						actions.setUser('bmagnantb')
						expect(userStore.getState().user).to.equal('bmagnantb')
						actions.setUser('everyone')
						expect(userStore.getState().user).to.equal('everyone')
				})
		})
})


describe('detailStore', () => {

	var detailStore, DetailStore, actions

		before((done) => {
				clientEnv(() => {
						actions = alt.generateActions('getInfo', 'resetState')
						DetailStore = require('../stores/DetailStore').DetailStore
						class DetailStoreTest extends DetailStore {
								constructor() {
										super()
										this.bindListeners({
												getInfo: actions.getInfo,
												resetState: actions.resetState
										})
								}
						}
						detailStore = alt.createStore(DetailStoreTest)
						done()
				})
		})

		describe('#constructor', () => {
				it('should set initial state of this.photo = null, this.photoUrl = function() {return ""}', () => {
						expect(detailStore.getState()).to.have.property('photo', null)
						expect(detailStore.getState()).to.have.property('photoUrl').that.is.instanceof(Function)
						expect(detailStore.getState().photoUrl()).to.equal('')
				})
		})

		describe('#getInfo', () => {
				it('should set state.photo to data from actions.getInfo', () => {
						actions.getInfo({title: 'shanghai skyline', owner: 'PRC', farm: 5, server: 766967})
						expect(detailStore.getState()).to.have.property('photo').that.has.property('title', 'shanghai skyline')
						expect(detailStore.getState().photo).to.have.property('owner', 'PRC')
						expect(detailStore.getState().photo).to.have.property('farm', 5)
						expect(detailStore.getState().photo).to.have.property('server', 766967)
				})

				it('should build url on state.photoUrl with data from actions.getInfo', () => {
						expect(detailStore.getState().photoUrl('l')).to.contain('farm5').and.to.contain('766967')
				})

				it('should reset data completely when called', () => {
						expect(detailStore.getState().photo).to.have.property('title', 'shanghai skyline')
						expect(detailStore.getState().photo).to.have.property('owner', 'PRC')
						expect(detailStore.getState().photo).to.have.property('farm', 5)
						expect(detailStore.getState().photo).to.have.property('server', 766967)
						actions.getInfo({title: 'guangzhou skyline', farm: 66})
						expect(detailStore.getState().photo).to.have.property('title', 'guangzhou skyline')
						expect(detailStore.getState().photo).to.have.property('farm', 66)
						expect(detailStore.getState().photo).to.not.have.ownProperty('owner').and.to.not.have.ownProperty('server')
						expect(detailStore.getState().photoUrl('l')).to.contain('farm66').and.to.not.contain('farm5').and.to.not.contain('766967')
				})
		})

		describe('#resetState', () => {
				it('should reset state.photo to null and state.photoUrl to function() {return ""}', () => {
						expect(detailStore.getState().photo).to.not.equal(null)
						expect(detailStore.getState().photoUrl()).to.not.equal('')
						actions.resetState()
						expect(detailStore.getState().photo).to.equal(null)
						expect(detailStore.getState().photoUrl()).to.equal('')
				})
		})
})






// ------------------ ACTIONS -----------------

// describe('GalleryActions', () => {

// 		var galleryActions, GalleryActions

// 		before((done) => {
// 				clientEnv(() => {
// 						GalleryActions = require('../actions/GalleryActions').GalleryActions
// 						class GalleryActionsTest extends GalleryActions {
// 								constructor() {
// 										super()
// 								}
// 						}
// 						galleryActions = alt.createActions(GalleryActionsTest)
// 						done()
// 				})
// 		})
// })







// ------------------ COMPONENTS -----------------

describe('AppView', () => {

		var AppView, appView

		before((done) => {
				clientEnv(() => {
						AppView = require('../components/AppView').AppView
						appView = new AppView()
						done()
				})
		})

		it('should be a constructor', () => {
				expect(appView).to.be.instanceof(AppView)
		})

		it('should be instance of React Component', () => {
				expect(appView).to.be.instanceof(React.Component)
				console.log(appView)
		})
})



describe('DetailView', () => {

		var DetailView

		before((done) => {
				clientEnv(() => {
						DetailView = require('../components/DetailView').DetailView
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new DetailView()).to.be.instanceof(DetailView)
		})

		it('should be instance of React Component', () => {
				expect(new DetailView()).to.be.instanceof(React.Component)
		})
})



describe('Footer', () => {

		var Footer

		before((done) => {
				clientEnv(() => {
						Footer = require('../components/Footer').Footer
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new Footer()).to.be.instanceof(Footer)
		})

		it('should be instance of React Component', () => {
				expect(new Footer()).to.be.instanceof(React.Component)
		})
})



describe('GalleryView', () => {

		var GalleryView

		before((done) => {
				clientEnv(() => {
						GalleryView = require('../components/GalleryView').GalleryView
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new GalleryView()).to.be.instanceof(GalleryView)
		})

		it('should be instance of React Component', () => {
				expect(new GalleryView()).to.be.instanceof(React.Component)
		})
})



describe('Header', () => {

		var Header

		before((done) => {
				clientEnv(() => {
						Header = require('../components/Header').Header
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new Header()).to.be.instanceof(Header)
		})

		it('should be instance of React Component', () => {
				expect(new Header()).to.be.instanceof(React.Component)
		})
})



describe('LoginView', () => {

		var LoginView

		before((done) => {
				clientEnv(() => {
						LoginView = require('../components/LoginView').LoginView
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new LoginView()).to.be.instanceof(LoginView)
		})

		it('should be instance of React Component', () => {
				expect(new LoginView()).to.be.instanceof(React.Component)
		})
})



describe('RegisterView', () => {

		var RegisterView

		before((done) => {
				clientEnv(() => {
						RegisterView = require('../components/RegisterView').RegisterView
						done()
				})
		})

		it('should be a constructor', () => {
				expect(new RegisterView()).to.be.instanceof(RegisterView)
		})

		it('should be instance of React Component', () => {
				expect(new RegisterView()).to.be.instanceof(React.Component)
		})
})



describe('PassEmailView', () => {
		it('should be a constructor', () => {
				expect(new PassEmailView()).to.be.instanceof(PassEmailView)
		})
		it('should be instance of React Component', () => {
				expect(new PassEmailView()).to.be.instanceof(React.Component)
		})
})

