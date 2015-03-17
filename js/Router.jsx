;(function(exports) {

var React = require('react')
// modified react-router for React v0.13 compatibility
// clone from git@github.com:nhunzaker/react-router.git
var Router = require('./react-router')
var Parse = require('Parse')
var AppView = require('./components/AppView').AppView
var GalleryView = require('./components/GalleryView').GalleryView
var LoginView = require('./components/LoginView').LoginView
var RegisterView = require('./components/RegisterView').RegisterView
var DetailView = require('./components/DetailView').DetailView
var PassEmailView = require('./components/PassEmailView').PassEmailView

var DefaultRoute = Router.DefaultRoute
var Route = Router.Route
var Redirect = Router.Redirect

var routes = (
		<Route name="app" path="/" handler={AppView}>
				<Route name="home" handler={GalleryView} />
				<Route name="photo" path="photo/:id" handler={DetailView} />
				<Redirect from="details" to="photo" />
				<Route name="login" handler={LoginView} />
				<Redirect from="signin" to="login" />
				<Route name="register" handler={RegisterView} />
				<Route name="passemailsent" handler={PassEmailSentView} />
				<DefaultRoute handler={GalleryView} />
		</Route>
)

var router = Router.create(routes)


exports.router = router

})(typeof module === 'object' ? module.exports : window)