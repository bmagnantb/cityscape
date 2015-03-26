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
								<h6>This product uses the Flickr API but is not endorsed&nbsp;or&nbsp;certified&nbsp;by&nbsp;Flickr.</h6>
						</footer>
				)
		}
}


exports.Footer = Footer

})(typeof module === 'object' ? module.exports : window)