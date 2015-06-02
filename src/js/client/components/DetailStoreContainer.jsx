import React from 'react'

import AutobindComponent from './AutobindComponent'

export default function injectDetailStore(Component) {
	class DetailStoreContainer extends AutobindComponent {

		constructor(props, context) {
			super()

			this._store = context.alt.getStore('detail')
			this._routerParams = context.router.getCurrentParams()
			this.state = this._store.getState()[this._routerParams.id]

			this._actions = context.alt.getActions('detail')
			this._galleryActions = context.alt.getActions('gallery')

			this._bind('_onStoreChange')
		}

		componentWillMount() {
			this._shouldStoreFetch()
		}

		componentDidMount() {
			this._store.listen(this._onStoreChange)
		}

		render() {
			return <Component storeData={this.state} routerParams={this._routerParams} actions={this._galleryActions} {...this.props} />
		}

		_onStoreChange() {
			this.setState(this._store.getState()[this._routerParams.id])
		}

		_shouldStoreFetch() {
			var params = this._routerParams

			if (!params.tags) params.tags = ''

			if (this._store.getState()[params.id] === undefined) {
				this._actions.getDetail(params.id, params.tags)
			}
		}
	}

	DetailStoreContainer.contextTypes = {
		alt: React.PropTypes.object.isRequired,
		router: React.PropTypes.func.isRequired
	}

	return DetailStoreContainer
}