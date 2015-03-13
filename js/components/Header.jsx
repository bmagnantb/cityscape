;(function(exports) {

var React = require('react')

class Header extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<header>
								<h1>SKYLINES</h1>
						</header>
				)
		}
}


exports.Header = Header

})(typeof module === 'object' ? module.exports : window)