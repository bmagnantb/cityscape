var React = require('react')

class LinkStub extends React.Component {
	render() {
		if (this.props.to) return <span onClick={this.linkTo.bind(this)}></span>
		else return <span></span>
	}

	linkTo() {
		return
	}
}

module.exports = LinkStub