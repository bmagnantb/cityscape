import React from 'react'
import Alt from './alt-app'

export default function giveAltContext(Component, alt) {
	class AltContext extends React.Component {

		getChildContext() {
			return { alt }
		}

		render() {
			return (
				<div>
					<Component {...this.props} />
				</div>
			)
		}
	}

	AltContext.childContextTypes = {
		alt: React.PropTypes.object.isRequired
	}

	return AltContext
}