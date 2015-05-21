var stubActions = {}

stubActions.userActions = {
	current: function() {
		return 'currentUser'
	}
}

stubActions.galleryActions = {
	vote: function() {
		return arguments
	}
}

module.exports = stubActions