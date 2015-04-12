;(function(exports) {

var React = require('react')

class PassEmailView extends React.Component {

		render() {
				return <h3>A password reset link has been sent to your email</h3>
		}

}


exports.PassEmailView = PassEmailView

})(typeof module === 'object' ? module.exports : window)