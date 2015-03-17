"use strict"

// make testing suite
var Mocha = require('mocha')
var Chai = require('chai')

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



// ---------------- ROUTER -------------------




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
				console.log(noErrorUrl)
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




// ------------- ALT APP -------------------

describe('alt', () => {
		it('should be an instance of Alt', () => {
				expect(alt).to.be.instanceof(Alt)
		})
})




// ------------- STORES -------------------

describe('galleryStore', () => {

		var galleryStore

		before((done) => {
				clientEnv(() => {
						galleryStore = require('../stores/GalleryStore').galleryStore
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
})

describe('userStore', () => {

		var userStore

		before((done) => {
				clientEnv(() => {
						userStore = require('../stores/UserStore').userStore
						done()
				})
		})

		describe('#constructor', () => {
				it('should set username to null', () => {
						expect(userStore.getState()).to.be.an('object').and.have.property('user', null)
				})
		})
})




// ---------- ACTIONS ------------




// --------- VIEWS -----------

describe('PassEmailView', () => {
		it('should be a constructor', () => {
				expect(new PassEmailView()).to.be.instanceof(PassEmailView)
		})
		it('should be a React Component', () => {
				expect(new PassEmailView()).to.be.instanceof(React.Component)
		})
})

