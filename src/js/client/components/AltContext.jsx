import React from 'react'

export default class AltContext extends React.Component {

	getChildContext() {
		var alt = this.props.alt
		return { alt }
	}

	render() {
		return <this.props.childComponent {...this.props.childComponentProps} />
	}
}

AltContext.childContextTypes = {
	alt: React.PropTypes.object.isRequired
}
