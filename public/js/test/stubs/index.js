module.exports = makeStubs()


function makeStubs() {
	var stubStore = require('./stores')
	var stubActions = require('./actions')

	var stubs = {}

	stubs.jquery = require('./jquery')
	stubs.parseUser = require('./parseUser')
	stubs.transition = require('./transition')
	stubs.userActions = stubActions.userActions
	stubs.galleryActions = stubActions.galleryActions
	stubs.detailStore = stubStore({'16879221559': require('./photoMock')})
	stubs.userStore = stubStore({user: stubs.parseUser})
	stubs.galleryStore = stubStore(require('./galleryStoreDataMock'))
	stubs.routerWithHandler = require('./routerWithHandler')
	stubs.routerLink = require('./routerLink')
	stubs.routerContext = require('./routerContext')
	stubs.event = {preventDefault: function() {}}

	return stubs
}



