;(function(exports) {

var React = require('react')
// modified react-router for React v0.13 compatibility
// clone from git@github.com:nhunzaker/react-router.git
var Router = require('../../modules_other/react-router')
var { AppView } = require('./components/AppView')
var { GalleryView } = require('./components/GalleryView')
var { LoginView } = require('./components/LoginView')
var { RegisterView } = require('./components/RegisterView')
var { DetailView } = require('./components/DetailView')
var { PassEmailView } = require('./components/PassEmailView')

var DefaultRoute = Router.DefaultRoute
var Route = Router.Route
var Redirect = Router.Redirect

var routes = (
		<Route name="app" path="/" handler={AppView}>
				<Route name="gallerynosearch" path="/gallery/page:page" handler={GalleryView} />
				<Route name="gallerysearch" path="/gallery/:tags/page:page" handler={GalleryView} />
				<Route name="photo" path="/photo/:id" handler={DetailView} />
				<Redirect from="details" to="photo" />
				<Route name="login" path="/login" handler={LoginView} />
				<Redirect from="signin" to="login" />
				<Route name="register" path="/register" handler={RegisterView} />
				<Route name="passemailsent" path="/passemailsent" handler={PassEmailView} />
				<Redirect from="*" to="gallerynosearch" params={{page: 1}}/>
		</Route>
)

var router = Router.create(routes)


exports.router = router

})(typeof module === 'object' ? module.exports : window)