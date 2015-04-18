/***************************************


NOT CURRENT FIX THIS


**************************************/


'use strict'

// make testing suite
var Mocha = require('mocha')
var Chai = require('chai')
var sinon = require('sinon')
var proxyquire = require('proxyquire')
var Promise = require('bluebird')

Chai.use(require('chai-things'))
Chai.use(require('chai-as-promised'))
Chai.use(require('sinon-chai'))

var { expect } = Chai


// function to create browser environment -- when window global is needed
var jsdom = require('jsdom')
var clientEnv = () => {

	var promise = new Promise(function(resolve, reject) {

		jsdom.env({
			html: '<html><body></body></html>',
			done(err, window) {
				if (err) reject()
				global.window = window
				global.getComputedStyle = window.getComputedStyle
				resolve()
			}
		})
	})

	return promise
}


// stubs
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
	var TestUtils = React.addons.TestUtils

	var userActionsStub = {
		userActions: {
			current: function() {
				return 'currentUser'
			}
		}
	}

	var userStoreStub = stubStore('userStore')
	userStoreStub.userStore.user = {
		get: function() {
			return 'person4'
		}
	}

	var galleryActionsStub = {
		galleryActions: {
			vote: function() {
				return arguments
			}
		}
	}

	var galleryStoreStub = {}

	describe('AppView.jsx', () => {

		var AppView, mock, mockRender

		before((done) => {
			sinon.spy(userActionsStub.userActions, 'current')
			AppView = proxyquire('../components/AppView', { '../actions/UserActions': userActionsStub }).AppView
			mock = TestUtils.createRenderer()
			mock.render(<AppView />)
			mockRender = mock.getRenderOutput()
			done()
		})

		after((done) => {
			userActionsStub.userActions.current.restore()
			done()
		})

		describe('#constructor', () => {
			it('should call userActions.current to init user info', () => {
				expect(userActionsStub.userActions.current.callCount).to.equal(1)
			})
		})

		describe('#render', () => {
			it('should render app div with 2 children: Header & RouteHandler', () => {
			expect(mockRender).to.have.property('type', 'div')
			expect(mockRender.props.className).to.equal('app')
			expect(mockRender.props).to.have.property('children').with.length(2)
			expect(mockRender.props.children[0].type.name).to.equal('Header')
			expect(mockRender.props.children[1].type.name).to.equal('RouteHandler')
			})
		})
	})


	describe('DetailView', () => {

		var DetailView, detail_view, mock, mockRender

		var detailStoreStub = stubStore('detailStore')
		detailStoreStub.detailStore['16879221559'] = getPhotoMock()

		before(() => {
			sinon.spy(detailStoreStub.detailStore, 'listen')
			sinon.spy(detailStoreStub.detailStore, 'unlisten')
			sinon.spy(galleryActionsStub.galleryActions, 'vote')
			DetailView = proxyquire('../components/DetailView', {
					'../stores/DetailStore': detailStoreStub,
					'../stores/UserStore': userStoreStub,
					'../actions/GalleryActions': galleryActionsStub
				}).DetailView
			// sinon.spy(detail_view, 'setState')
			mock = TestUtils.createRenderer()
			mock.render(<DetailView params={{id: '16879221559', tags: 'china'}} />)
			mockRender = mock.getRenderOutput()
			detail_view = mock._instance._instance
		})

		after(() => {
			detailStoreStub.detailStore.listen.restore()
			detailStoreStub.detailStore.unlisten.restore()
			galleryActionsStub.galleryActions.vote.restore()
		})

		describe('#componentWillMount', () => {
			it('should register listener for detailStore', () => {
				expect(detailStoreStub.detailStore.listen.callCount).to.equal(1)
			})
		})

		describe('#render', () => {
			it('should render a main tag class photo-detail', () => {
				expect(mockRender.type).to.equal('main')
				expect(mockRender.props.className).to.equal('photo-detail')
			})
		})

		describe('#_vote', () => {
			it('should call galleryActions.vote with id, user, and tags', () => {
				var voteNode = mockRender.props.children[1].props.children[0].props.children[0]
				voteNode.props.onClick()
				expect(galleryActionsStub.galleryActions.vote.callCount).to.equal(1)
				expect(galleryActionsStub.galleryActions.vote.lastCall.args[0]).to.equal('16879221559')
				expect(galleryActionsStub.galleryActions.vote.lastCall.args[1].get()).to.equal('person4')
				expect(galleryActionsStub.galleryActions.vote.lastCall.args[2]).to.equal('china')
			})
		})

		describe('#_detailInfo', () => {
			it('should get detail from detailStore', () => {
				sinon.spy(detailStoreStub.detailStore, 'getState')
				detail_view._detailInfo()
				expect(detailStoreStub.detailStore.getState.callCount).to.equal(1)
				detailStoreStub.detailStore.getState.restore()
			})
		})

		describe('#_userInfo', () => {
			it('should get user from userStore', () => {
				sinon.spy(userStoreStub.userStore, 'getState')
				detail_view._userInfo()
				expect(userStoreStub.userStore.getState.callCount).to.equal(1)
				userStoreStub.userStore.getState.restore()
			})
		})

		describe('#_voteAllowed', () => {
			it('should return false if not given user and detail', () => {
				expect(detail_view._voteAllowed()).to.equal(false)
				expect(detail_view._voteAllowed('detail')).to.equal(false)
				expect(detail_view._voteAllowed(null, 'user')).to.equal(false)
			})

			it('should return h6 without click handler if user already voted', () => {
				var user = { get: function() { return 'maplekurtz' } }
				var html = detail_view._voteAllowed(detail_view.state.detail, user)
				expect(html.type).to.equal('h6')
				expect(html.props).to.not.have.key('onClick')
			})

			it('should return h6 with click handler if user not voted', () => {
				var html = detail_view._voteAllowed(detail_view.state.detail, userStoreStub.userStore.user)
				expect(html.props).to.include.key('onClick')
			})
		})

		describe('#_votesMarkup', () => {
			it('should return null if not given detail or if detail doesnt have weighted_votes or total_votes', () => {
				expect(detail_view._votesMarkup()).to.equal(null)
				expect(detail_view._votesMarkup({})).to.equal(null)
				expect(detail_view._votesMarkup({some_votes: 5})).to.equal(null)
			})

			it('should return votes div if weighted_votes or total_votes exist on detail', () => {
				var htmls = [
					detail_view._votesMarkup({total_votes: 1}),
					detail_view._votesMarkup({weighted_votes: 3})
				]
				htmls.forEach(function(html) {
					expect(html.type).to.equal('div')
					expect(html.props.className).to.equal('votes')
				})
			})

			it('should return voteAllowed h6 if given as 2nd arg', () => {
				var html = detail_view._votesMarkup(detail_view.state.detail, detail_view._voteAllowed(detail_view.state.detail, userStoreStub.userStore.user))
				expect(html.props.children[0].type).to.equal('h6')
				expect(html.props.children[0].props.className).to.equal('upvote')
			})
		})

		describe('#componentWillUnmount', () => {
			it('should unregister listener for detailStore', () => {
				mock.unmount()
				expect(detailStoreStub.detailStore.unlisten.callCount).to.equal(1)
			})
		})
	})
})



function stubStore(name) {

	var stub = {}

	stub[name] = {
		listen: function(cb) {},
		unlisten: function(cb) {},
		notState: ['listen', 'unlisten', 'notState', 'getState'],
		getState: function() {
			var state = {}
			for (var key in this) {
				if (this.notState.indexOf(key) === -1) {
					state[key] = this[key]
				}
			}
			return state
		}
	}

	return stub
}



function getPhotoMock() {

	return {
		_owner_url: "https://www.flickr.com/people/113365131@N02",
		date_uploaded: 1428406916,
		dates: {
			lastupdate: "1429111420",
			posted: "1428406916",
			taken: "2015-04-07 19:12:38",
			takengranularity: 0,
			takenunknown: "1"
		},
		description: {
			_content: "Canon AE-1↵FD 50mm f/1.8↵Kodak Ektar 100↵Double Exposure ↵Hong Kong↵↵This shot is unedited. I took this double exposure as an experiment to see if I could &quot;make&quot; my own Revolog Kolor film. It's pretty easy to do; I chose red because I've been considering getting some redscale film because it's incredibly cheap. I'll definitely be taking more of these. "
		},
		farm: 9,
		height_m: "331",
		location: {
			accuracy: "16",
			context: "0",
			country: {
				_content: "Hong Kong",
				place_id: "4Jji9AVTVrLRrBR9Zg",
				woeid: "24865698"
			},
			latitude: "22.287994",
			longitude: "114.137767",
			neighbourhood: {
				_content: "Kennedy Town",
				place_id: "CM7rYadTVr3sbUPLMA",
				woeid: "24702912"
			},
			place_id: "CM7rYadTVr3sbUPLMA",
			region: {
				_content: "Central and Western",
				place_id: "_0bX7CNTVr1qai3swg",
				woeid: "24703128"
			},
			woeid: "24702912"
		},
		owner: "113365131@N02",
		ownername: "Hayden_Williams",
		photo_id: "16879221559",
		secret: "c802fa303c",
		server: "8751",
		tag_votes: {
			china: 1
		},
		tags: ["china", "road", "street", "city", "red", "people", "urban", "streets", "film", "analog", "canon", "vintage", "buildings", "hongkong", "asia", "traffic", "kodak", "doubleexposure", "grain", "hipster", "streetphotography", "retro", "multipleexposure", "fd50mmf18", "analogue", "grainy", "canonae1", "kolor", "redscale", "kodakektar", "revolog", "ektar100", "revologkolor"],
		title: "Velvet Pulse",
		total_votes: 2,
		url_m: "https://farm9.staticflickr.com/8751/16879221559_c802fa303c.jpg",
		urls: {
			url: [{
				Object_content: "https://www.flickr.com/photos/haydilliams/16879221559/",
				type: "photopage"
			}]
		},
		user_votes: ["kurtzmaple", "maplekurtz"],
		weighted_votes: 2,
		width_m: "500",
		_photoUrl: function(size) {
			return `https://farm${this.farm}.staticflickr.com/${this.server}/${this.photo_id}_${this.secret}_${size}.${this.originalformat ? this.originalformat : 'jpg'}`
		}
	}
}
