import { realtimeDb } from '../lib/firebase'
import { ref, onValue, set, get } from 'firebase/database'
import { setRoom } from '../store/actions/room.actions'
import { utilService } from './util.service'

export const GUEST_ID = 'aKKGgYXK0NXjHcKgAgWmRkUKQ9M2'
export const ROOM_COLLECTION_KEY = 'room'

export const roomService = {
	createRoom,
	joinRoom,
	startGame,
}

async function createRoom(roomId, dispatch, userId, nickname = '') {
	const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${roomId}`)

	let snapshot = await get(roomRef) // Get the current room value

	if (!snapshot.exists()) {
		// If room doesn't exist, create a new one
		let roomVal = {
			id: roomId,
			category: utilService.getRndCategory(),
			players: [{ userId, nickname }],
			guests: userId === GUEST_ID ? 1 : 0,
			votes: {},
			posts: [],
			status: 'pending',
		}

		set(roomRef, roomVal).then(() => {
			dispatch(setRoom(roomVal))
		})
	} else {
		// If room exists, add the user if not already in the room
		let roomVal = snapshot.val()
		// roomVal.id = roomId
		// roomVal.category = utilService.getRndCategory(),
		// 	roomVal.players= [{ userId, nickname }],
		// 	roomVal.guests: userId === GUEST_ID ? 1 : 0,
		// 	roomVal.votes: {},
		// 	roomVal.posts: [],
		// 	roomVal.status: 'pending',

		const isUserInRoom = roomVal.players.includes(userId)
		const isGuest = userId === GUEST_ID
		if (!isUserInRoom || isGuest) {
			if (!isUserInRoom) roomVal.players.push(userId)
			if (isGuest) roomVal.guests += 1
			await set(roomRef, roomVal)
		}

		dispatch(setRoom(roomVal))
	}

	const unsubscribe = onValue(roomRef, (snapshot) => {
		dispatch(setRoom(snapshot.val()))
	})

	return unsubscribe
}

// async function createRoom(roomId, dispatch, userId) {
// 	const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${roomId}`)

// 	const unsubscribe = onValue(roomRef, async (snapshot) => {
// 		let roomVal
// 		if (!snapshot.exists()) {
// 			roomVal = {
// 				id: roomId,
// 				category: utilService.getRndCategory(),
// 				players: [userId],
// 				guests: userId === GUEST_ID ? 1 : 0,
// 				votes: {},
// 				posts: [],
// 				status: 'pending',
// 			}
// 			set(roomRef, roomVal).then(() => {
// 				dispatch(setRoom(roomVal))
// 			})
// 		} else {
// 			roomVal = snapshot.val()
// 			if (!roomVal.players.includes(userId)) roomVal.players.push(userId)
// 			if (userId === GUEST_ID) roomVal.guests += 1
// 			dispatch(setRoom(roomVal))
// 		}
// 	})

// 	return unsubscribe
// }

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
