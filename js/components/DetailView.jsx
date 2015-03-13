;(function(exports) {

var React = require('react')

class DetailView extends React.Component {
		constructor() {
				super()
				this.state = {}
		}

		render() {
				return (
						<main>
								<h2>details</h2>
						</main>
				)
		}
}


exports.DetailView = DetailView

})(typeof module === 'object' ? module.exports : window)