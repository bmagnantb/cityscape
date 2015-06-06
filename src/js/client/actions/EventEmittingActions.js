import DataEventEmitter from './DataEventEmitter'

export default class EventEmittingActions {
	emit(payload) {
		DataEventEmitter.emit('asyncAction', payload)
	}
}
