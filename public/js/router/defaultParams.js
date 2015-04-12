;(function(exports) {

var React = require('react')
var Router = require('../../../modules_other/react-router')



class GalleryAddPage extends React.Component {}

GalleryAddPage.willTransitionTo = function(transition, params) {
		if (params.tags) transition.redirect(`/gallery/${params.tags}/page1`)
		else transition.redirect('/gallery/page1')
}


exports.GalleryAddPage = GalleryAddPage

})(typeof module === 'object' ? module.exports : window)