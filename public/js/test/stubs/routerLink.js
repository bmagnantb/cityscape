module.exports = stubRouterLink()

function stubRouterLink(Handler) {
	var LinkStub = require('./LinkStub')

	return {
		Link: LinkStub,
		'@global': true
	}
}