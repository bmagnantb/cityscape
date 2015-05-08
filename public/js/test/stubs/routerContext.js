var React = require('react')

var routerFunction = function() {}
routerFunction.transitionTo = function() {}

class RouterContext extends React.Component {

	getChildContext() {
		return {
			router: routerFunction
		}
	}

	render() {
		var childComponent
		if (this.props.childParams) childComponent = <this.props.childComponent params={this.props.childParams} />
		else childComponent = <this.props.childComponent />
		return (
			<div>
				{childComponent}
			</div>
		)
	}
}

RouterContext.childContextTypes = {
	router: React.PropTypes.func.isRequired
}


module.exports = RouterContext