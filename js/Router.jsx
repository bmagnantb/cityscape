;(function(exports) {

var React = require('react')
var Router = require('react-router')
var Parse = require('Parse')
var AppView = require('./components/AppView').AppView
var GalleryView = require('./components/GalleryView').GalleryView
var LoginView = require('./components/LoginView').LoginView
var RegisterView = require('./components/RegisterView').RegisterView
var DetailView = require('./components/DetailView').DetailView

var DefaultRoute = Router.DefaultRoute
var Route = Router.Route
var Redirect = Router.Redirect

var routes = (
		<Route name="app" path="/" handler={AppView}>
				<Route name="home" handler={GalleryView} />
				<Route name="detail" handler={DetailView} />
				<Redirect from="details" to="detail" />
				<Route name="login" handler={LoginView} />
				<Redirect from="signin" to="login" />
				<Route name="register" handler={RegisterView} />
				<DefaultRoute handler={GalleryView} />
		</Route>
)

var router = Router.create(routes)


exports.router = router

})(typeof module === 'object' ? module.exports : window)