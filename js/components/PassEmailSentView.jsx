;(function(exports) {

var React = require('react')

class PassEmailSentView extends React.Component {
		constructor() {
				super()
		}

		render() {
				return <h3>A password reset link has been sent to your email</h3>
		}
}


exports.PassEmailSent = PassEmailSentView

})(typeof module === 'object' ? module.exports : window)