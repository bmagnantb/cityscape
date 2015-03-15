"use strict"

var Mocha = require('mocha');
var Chai = require('chai');

var assert = Chai.assert;
var expect = Chai.expect;


// require files for testing
var FC = require('../FlickrClient').FC;

// write tests
describe('FC', function() {
		describe('#getPhotos', function() {
				it('should return a url', function() {
						expect(new FC().getPhotos()).to.be.instanceof(String);
				})
		})
})