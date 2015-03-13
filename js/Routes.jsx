;(function(exports) {

var React = require('react')
var Router = require('react-router')
var AppView = require('./components/AppView').AppView
var HomeView = require('./components/HomeView').HomeView
var LoginView = require('./components/LoginView').LoginView
var RegisterView = require('./components/RegisterView').RegisterView
var DetailView = require('./components/DetailView').DetailView

var DefaultRoute = Router.DefaultRoute
var Link = Router.Link
var Route = Router.Route
var Redirect = Router.Redirect

var routes = (
		<Route name="app" path="/" handler={AppView}>
				<Route name="home" handler={HomeView} />
				<Route name="detail" handler={DetailView} />
				<Redirect from="details" to="detail" />
				<Route name="login" handler={LoginView} />
				<Redirect from="signin" to="login" />
				<Route name="register" handler={RegisterView} />
				<DefaultRoute handler={HomeView} />
		</Route>
)


exports.routes = routes

})(typeof module === 'object' ? module.exports : window)