;(function(exports) {

var React = require('react')

class Footer extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<footer>foot</footer>
				)
		}
}


exports.Footer = Footer

})(typeof module === 'object' ? module.exports : window)