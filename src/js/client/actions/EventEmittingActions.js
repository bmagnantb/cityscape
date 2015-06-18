export default class EventEmittingActions {
	emit(payload) {
		if (this.alt.dataEmitter) this.alt.dataEmitter.emit('asyncAction', payload)
	}
}
