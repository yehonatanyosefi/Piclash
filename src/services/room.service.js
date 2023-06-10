import { realtimeDb } from '../lib/firebase'
import { ref, onValue, set } from 'firebase/database'
import { setRoom } from '../store/actions/room.actions'
import { utilService } from './util.service'

const ROOM_COLLECTION_KEY = 'room'

export const roomService = {
	createRoom,
	joinRoom,
	startGame,
}

async function createRoom(roomId, dispatch) {
	const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${roomId}`)

	const unsubscribe = onValue(roomRef, async (snapshot) => {
		let roomVal
		if (!snapshot.exists()) {
			roomVal = {
				id: roomId,
				category: utilService.getRndCategory(),
				categories: [],
				players: [],
				votes: {},
				posts: [],
			}
			set(roomRef, roomVal).then(() => {
				dispatch(setRoom(roomVal))
			})
		} else {
			roomVal = snapshot.val()
			dispatch(setRoom(roomVal))
		}
	})

	return unsubscribe
}
// Invite a user to the room
async function joinRoom(roomId, user) {
	const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${roomId}`)

	await onValue(roomRef, async (snapshot) => {
		if (snapshot.exists()) {
			const roomVal = snapshot.val()

			// Check if players exist, if not, initialize as an empty array
			if (!roomVal.players) {
				roomVal.players = []
			}

			// Add the joining user to the room's players
			roomVal.players.push(user)

			// Update the room data
			await set(roomRef, roomVal)
		} else {
			console.error('The specified room does not exist')
		}
	})
}

async function startGame(roomId) {
	const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${roomId}`)

	await onValue(roomRef, async (snapshot) => {
		if (snapshot.exists()) {
			const roomVal = snapshot.val()

			// Check if the minimum number of players have joined
			if (roomVal.players.length >= 3) {
				// Set gameStarted to true
				roomVal.gameStarted = true

				// Update the room data
				await set(roomRef, roomVal)
			} else {
				console.error('A minimum of 3 players are required to start the game')
			}
		} else {
			console.error('The specified room does not exist')
		}
	})
}
