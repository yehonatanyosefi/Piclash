export const SET_ROOM = 'SET_ROOM'
export const SET_UNSUBSCRIBE = 'SET_UNSUBSCRIBE'

const INITIAL_STATE = {
	room: null,
	unsubscribe: null,
}

export function roomReducer(state = INITIAL_STATE, action = {}) {
	switch (action.type) {
		case SET_ROOM:
			return {
				...state,
				room: action.room,
			}
		case SET_UNSUBSCRIBE:
			return {
				...state,
				unsubscribe: action.unsubscribe,
			}
		default:
			return state
	}
}
