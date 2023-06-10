export const SET_ROOM = 'SET_ROOM'
export const SET_UNSUBSCRIBE = 'SET_UNSUBSCRIBE'
export const JOIN_ROOM = 'JOIN_ROOM'
export const START_GAME = 'START_GAME'

const INITIAL_STATE = {
	room: null,
	unsubscribe: null,
	roomUsers: [],
	gameStarted: false,
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
		case JOIN_ROOM:
			return {
				...state,
				roomUsers: [...state.roomUsers, action.user],
			}
		case START_GAME:
			return {
				...state,
				gameStarted: true,
			}
		default:
			return state
	}
}
