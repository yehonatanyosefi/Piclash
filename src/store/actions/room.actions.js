import { SET_ROOM, SET_UNSUBSCRIBE, JOIN_ROOM, START_GAME } from '../reducers/room.reducer'
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
export function createRoom(roomId) {
	return async (dispatch, getState) => {
		try {
			const unsubscribe = await roomService.createRoom(roomId, dispatch)
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

export function joinRoom(roomId, user) {
	return async (dispatch, getState) => {
		try {
			await roomService.joinRoom(roomId, user)
			const action = {
				type: JOIN_ROOM,
				user,
			}
			dispatch(action)
		} catch (error) {
			console.log('error:', error)
		}
	}
}

export function startGame(roomId) {
	return async (dispatch, getState) => {
		try {
			await roomService.startGame(roomId)
			const action = {
				type: START_GAME,
			}
			dispatch(action)
		} catch (error) {
			console.log('error:', error)
		}
	}
}
