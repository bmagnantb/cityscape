import React from 'react'
import _ from 'lodash'

import AutobindComponent from './AutobindComponent'

export default function injectGalleryStore(Component) {

	class GalleryStoreContainer extends AutobindComponent {
		constructor(props, context) {
			super()

			this._store = context.alt.getStore('gallery')
			this._actions = context.alt.getActions('gallery')

			this.state = this._store.getState()

			this._bind('_onStoreChange', '_shouldStoreFetch')
		}

		componentWillMount() {
			this._shouldStoreFetch(this.props.params)
			this.setState(this._store.getState())
		}

		componentDidMount() {
			this._store.listen(this._onStoreChange)
		}

		componentWillUnmount() {
			this._store.unlisten(this._onStoreChange)
		}

		componentWillReceiveProps(nextProps) {
			this._shouldStoreFetch(nextProps.params)
		}

		render() {
			return <Component storeData={this.state} actions={this._actions} {...this.props} />
		}

		_onStoreChange() {
			this.setState(this._store.getState())
		}

		_shouldStoreFetch(params) {
			var prevParams = this.state.requestParamsHistory

			// check if exact request has happened
			var prevParamsMatch = prevParams.filter((val) => {
				return _.isEqual(val, params)
			})

			// check if request has happened with same search / no search
			var prevTagsMatch = prevParams.filter((val) => {
				return val.tags === params.tags
			})

			// cached load
			if (prevParamsMatch.length) {
				this._actions.cachedLoad(params)
			}

			// page change?
			else if (prevTagsMatch.length) {
				this._actions.changePage(params)
			}

			// request -- new set of tags
			else {
				this._actions.getPhotos(params)
			}
		}
	}

	GalleryStoreContainer.contextTypes = {
		alt: React.PropTypes.object.isRequired,
		router: React.PropTypes.func.isRequired
	}

	return GalleryStoreContainer
}