var chai = require('chai')
var proxyquire = require('proxyquire')

var {expect} = chai
var stubs = require('./stubs')

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