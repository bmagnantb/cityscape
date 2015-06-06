module.exports = stubRouterWithHandler

function stubRouterWithHandler(Handler) {
	var LinkStub = require('./LinkStub')

	return {
		Link: LinkStub,
		RouteHandler: Handler,
		'@global': true
	}
}