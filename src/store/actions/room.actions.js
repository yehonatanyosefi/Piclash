import { SET_ROOM, SET_UNSUBSCRIBE } from '../reducers/room.reducer'
import { roomService } from '../../services/room.service'

export function setRoom(room) {
	return async (dispatch, getState) => {
		try {
			const action = {
				type: SET_ROOM,
				room,
			}
			dispatch(action)
		} catch (error) {
			console.log('error:', error)
		}
	}
}
export function createRoom(roomId, userId, nickname = '') {
	return async (dispatch, getState) => {
		try {
			const unsubscribe = await roomService.createRoom(roomId, dispatch, userId, nickname)
			const action = {
				type: SET_UNSUBSCRIBE,
				unsubscribe,
			}
			dispatch(action)
		} catch (error) {
			console.log('error:', error)
		}
	}
}
