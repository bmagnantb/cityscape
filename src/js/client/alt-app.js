import Alt from 'alt'

// import action classes
import GalleryActions from '../client/actions/GalleryActions'
import DetailActions from '../client/actions/DetailActions'
import UserActions from '../client/actions/UserActions'

// import store classes
import GalleryStore from '../client/stores/GalleryStore'
import DetailStore from '../client/stores/DetailStore'
import UserStore from '../client/stores/UserStore'

var actions = [GalleryActions, DetailActions, UserActions]
var stores = [GalleryStore, DetailStore, UserStore]

export default class AltApp extends Alt {
	constructor(config = {}) {
		super(config)

		actions.forEach((val) => {
			this.addActions(val.name, val.actions)
		})

		stores.forEach((val) => {
			this.addStore(val.name, val.store)
		})
	}
}