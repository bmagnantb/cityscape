;(function(exports) {

var React = require('react')

class Footer extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<footer>
								<h5>foot etc</h5>
						</footer>
				)
		}
}


exports.Footer = Footer

})(typeof module === 'object' ? module.exports : window)