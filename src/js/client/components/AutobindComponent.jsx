import React from 'react'

export default class AutobindComponent extends React.Component {
	_bind(...methods) {
		methods.forEach((method) => this[method] = this[method].bind(this))
	}
}