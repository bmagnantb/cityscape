;(function(exports) {

var React = require('react')
var Router = require('react-router')



class GalleryAddPage extends React.Component {}

GalleryAddPage.willTransitionTo = function(transition, params) {
	if (params.tags) return transition.redirect(`/gallery/${params.tags}/page1`)
	else return transition.redirect('/gallery/page1')
}


exports.GalleryAddPage = GalleryAddPage

})(typeof module === 'object' ? module.exports : window)