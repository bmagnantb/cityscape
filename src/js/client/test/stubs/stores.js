var _ = require('lodash')

module.exports = stubStore

function stubStore(options) {
	var stub =  {
		listen: function() {},
		unlisten: function() {},
		notState: ['listen', 'unlisten', 'notState', 'getState'],
		getState: function() {
			var state = {}
			for (var key in this) {
				if (this.notState.indexOf(key) === -1) {
					if (typeof this[key] === 'object') state[key] = _.assign({}, this[key])
					else state[key] = this[key]
				}
			}
			return state
		}
	}

	for (var key in options) {
		if (stub[key] == null) stub[key] = options[key]
	}

	return stub
}