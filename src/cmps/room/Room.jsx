import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { aiService } from '../../services/ai.service'
import { utilService } from '../../services/util.service'
import { createRoom } from '../../store/actions/room.actions'
import { GUEST_ID, ROOM_COLLECTION_KEY } from '../../services/room.service'
import { ref, runTransaction } from 'firebase/database'
import { realtimeDb } from '../../lib/firebase'

import { CreateImageForm } from './CreateImageForm'
import { CreateRoom } from './CreateRoom'
import { JoinRoom } from './JoinRoom'
import { RoomStatus } from './RoomStatus'
import { StartGameButton } from './StartGameButton'
import { UserImage } from './UserImage'
import { VoteButton } from './VoteButton'

const MAX_PROMPT_LENGTH = 100
const MIN_PEOPLE_TO_START = 3

export default function Room() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	const room = useSelector((storeState) => storeState.roomModule.room)
	const unsubscribe = useSelector((storeState) => storeState.roomModule.unsubscribe)
	const dispatch = useDispatch()

	const [prompt, setPrompt] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [nickname, setNickname] = useState('')
	const [roomId, setRoomId] = useState('')
	const [inputRoomId, setInputRoomId] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const roomHasGuests = room?.players?.includes(GUEST_ID)
	const isUserGuest = loggedInUser?.userId === GUEST_ID
	const roomVotes = room?.votes || []
	let hasVoted = false
	if (roomVotes.length > 0)
		hasVoted = isUserGuest
			? roomVotes.some((vote) => vote?.nickname === nickname)
			: roomVotes.some((vote) => vote.userId === loggedInUser.userId)
	const numberOfPlayers = (roomHasGuests ? -1 : 0) + room?.players?.length + room?.guests || 1

	useEffect(() => {
		const userId = loggedInUser?.userId
		if (!userId || !roomId) return
		dispatch(createRoom(roomId, userId))
		return () => {
			if (unsubscribe) unsubscribe()
		}
	}, [roomId])

	function joinRoom() {
		setRoomId(inputRoomId)
	}

	async function startGameRoom() {
		if (numberOfPlayers >= MIN_PEOPLE_TO_START) {
			await updateRoom({ status: 'started' })
		}
	}

	function handleVote(imageId) {
		if (hasVoted || !loggedInUser || !imgUrl) return
		dispatch(voteForImage(imageId, roomId))
	}

	async function updateRoom(contentToUpdate) {
		if (!room?.id) return
		try {
			const roomRef = ref(realtimeDb, `${ROOM_COLLECTION_KEY}/${room.id}`)
			await runTransaction(roomRef, (roomData) => {
				if (roomData) {
					roomData = { ...roomData, ...contentToUpdate }
					// if (contentToUpdate.posts) {
					// 	roomData.posts = roomData?.posts || []
					// 	roomData.posts.push(contentToUpdate.posts[contentToUpdate.posts.length - 1])
					// }
				}
				return roomData
			})
		} catch (err) {
			console.error('Failed to update room', err)
		}
	}

	async function createImgWithAi(ev) {
		ev.preventDefault()
		if (!loggedInUser) return
		setError(null)
		setLoading(true)
		try {
			const imgUrl = await aiService.createPostWithAiImg(prompt, room.category, loggedInUser, nickname)
			if (imgUrl) {
				const posts = room.posts || []
				posts.push({ prompt, imgUrl, nickname })
				await updateRoom({ posts })
				setPrompt('')
				setImgUrl(imgUrl)
			} else {
				setError('AI service failed to return an image URL.')
			}
		} catch (err) {
			if (err.response) {
				setError(err.response.data)
			} else {
				setError(err.message)
			}
		} finally {
			setLoading(false)
		}
	}

	function handlePromptChange(ev) {
		const value = ev.target.value
		if (value.length <= MAX_PROMPT_LENGTH) setPrompt(value)
		else setPrompt(value.slice(0, MAX_PROMPT_LENGTH))
	}

	function handleNickChange(ev) {
		const value = ev.target.value
		setNickname(value)
	}

	return (
		<div className="bg-gray-background flex flex-col items-center justify-center px-4 py-8">
			{loading && <div className="bg-gray-200 p-2 rounded-lg text-center">Loading...</div>}
			{error && <div className="bg-red-200 p-2 rounded-lg text-center">{JSON.stringify(error)}</div>}
			{roomId && (
				<>
					<RoomStatus roomId={roomId} room={room} numberOfPlayers={numberOfPlayers} />
					<StartGameButton
						room={room}
						numberOfPlayers={numberOfPlayers}
						startGameRoom={startGameRoom}
						MIN_PEOPLE_TO_START={MIN_PEOPLE_TO_START}
					/>
					{room?.status === 'started' && (
						<CreateImageForm
							createImgWithAi={createImgWithAi}
							nickname={nickname}
							handleNickChange={handleNickChange}
							loggedInUser={loggedInUser}
							prompt={prompt}
							handlePromptChange={handlePromptChange}
							MAX_PROMPT_LENGTH={MAX_PROMPT_LENGTH}
						/>
					)}
					<VoteButton
						hasVoted={hasVoted}
						handleVote={handleVote}
						room={room}
						numberOfPlayers={numberOfPlayers}
					/>
					<UserImage imgUrl={imgUrl} prompt={prompt} />
				</>
			)}
			{!roomId && (
				<>
					<JoinRoom inputRoomId={inputRoomId} setInputRoomId={setInputRoomId} joinRoom={joinRoom} />
					<CreateRoom setRoomId={setRoomId} utilService={utilService} />
				</>
			)}
		</div>
	)
}
