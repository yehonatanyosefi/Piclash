import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { aiService } from '../services/ai.service'
import { useDispatch } from 'react-redux'
import { utilService } from '../services/util.service'
import { createRoom, joinRoom, startGame } from '../store/actions/room.actions'

const MAX_PROMPT_LENGTH = 100

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
	const [hasVoted, setHasVoted] = useState(false)
	const numberOfPlayers = room?.players?.length || 1

	useEffect(() => {
		if (!roomId) return
		dispatch(createRoom(roomId))
		return () => {
			if (unsubscribe) unsubscribe()
		}
	}, [roomId])

	function joinRoom() {
		dispatch(joinRoom(inputRoomId, loggedInUser))
	}

	function startGameRoom() {
		if (numberOfPlayers >= 3) {
			dispatch(startGame(roomId))
		}
	}

	function handleVote(imageId) {
		if (hasVoted || !loggedInUser || !imgUrl) return
		dispatch(voteForImage(imageId, roomId))
		setHasVoted(true)
	}

	function updateRoom(contentToUpdate) {
		if (!room) return
		// Check if room is not null
		db.collection(ROOMS_DB).doc(room.id).update(contentToUpdate)
	}

	async function createImgWithAi(ev) {
		ev.preventDefault()
		if (!loggedInUser) return
		setError(null)
		try {
			setLoading(true)
			const imgUrl = await aiService.createPostWithAiImg(prompt, room.category, loggedInUser, nickname)
			if (imgUrl) {
				// updateRoom({
				// 	posts: firebase.firestore.FieldValue.arrayUnion({ prompt, imgUrl, nickname }),
				// })
				setPrompt('')
				setImgUrl(imgUrl)
			} else {
				setError('AI service failed to return an image URL.')
			}
			setLoading(false)
		} catch (err) {
			setLoading(false)
			if (err.response) {
				setError(err.response.data)
			} else {
				setError(err.message)
			}
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
		<div className="bg-gray-background flex flex-col items-center justify-center px-4 py-8 min-h-screen">
			{loading && <div className="bg-gray-200 p-2 rounded-lg text-center">Loading...</div>}
			{error && <div className="bg-red-200 p-2 rounded-lg text-center">{JSON.stringify(error)}</div>}
			{roomId && (
				<>
					<RoomStatus roomId={roomId} room={room} numberOfPlayers={numberOfPlayers} />
					<StartGameButton room={room} numberOfPlayers={numberOfPlayers} startGameRoom={startGameRoom} />
					{numberOfPlayers >= 3 && (
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
function CreateRoom({ setRoomId, utilService }) {
	return (
		<div>
			<p className="text-gray-600 mb-2">Or create a new room:</p>
			<Button onClick={() => setRoomId(utilService.makeId())}>Create Room</Button>
		</div>
	)
}
function JoinRoom({ inputRoomId, setInputRoomId, joinRoom }) {
	return (
		<div className="mb-4 space-y-2">
			<input
				type="text"
				value={inputRoomId}
				onChange={(e) => setInputRoomId(e.target.value)}
				placeholder="Enter room ID to join"
				className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-blue-500"
			/>
			<Button onClick={joinRoom}>Join</Button>
		</div>
	)
}

function StartGameButton({ numberOfPlayers, startGameRoom, gameStarted, room }) {
	const disabled = numberOfPlayers < 3 || gameStarted
	return (
		<div className="mb-4">
			{numberOfPlayers >= 3 && !room?.hasStarted && (
				<Button onClick={startGameRoom} disabled={disabled}>
					Start
				</Button>
			)}
		</div>
	)
}
function VoteButton({ hasVoted, handleVote, room, numberOfPlayers }) {
	return (
		<div className="mb-4 space-y-2">
			{!hasVoted && room?.posts?.length >= numberOfPlayers && (
				<>
					<p>Select the image you want to vote for:</p>
					{room.posts.map((post) => (
						<div key={post.id} className="space-y-2">
							<img src={post.imgUrl} alt={post.prompt} className="w-full h-auto rounded-lg" />
							<Button onClick={() => handleVote(post.id)}>Vote for this image</Button>
						</div>
					))}
				</>
			)}
		</div>
	)
}

function UserImage({ imgUrl, prompt }) {
	return (
		<div className="mb-4">
			{imgUrl && (
				<>
					<p className="text-gray-600 mb-2">Your Image:</p>
					<div className="rounded-lg overflow-hidden shadow-lg">
						<img className="object-cover w-full h-64" src={imgUrl} alt={prompt} />
					</div>
				</>
			)}
		</div>
	)
}

function RoomStatus({ roomId, room, numberOfPlayers }) {
	return (
		<div className="text-center space-y-2 mb-6">
			<h2 className="text-blue-500 text-2xl font-bold">Room #{roomId}</h2>
			<h3 className="text-blue-500 text-xl">Category: {room?.category}</h3>
			<p className="text-gray-600">
				Wait for more people to join, current people in the room: {numberOfPlayers}/3
			</p>
		</div>
	)
}

function CreateImageForm({
	createImgWithAi,
	nickname,
	handleNickChange,
	loggedInUser,
	prompt,
	handlePromptChange,
	MAX_PROMPT_LENGTH,
}) {
	return (
		<form onSubmit={createImgWithAi} className="space-y-4">
			{loggedInUser?.username === 'Guest' && (
				<input
					type="text"
					name="nickname"
					value={nickname}
					placeholder="Enter nickname here"
					onChange={(ev) => handleNickChange(ev)}
					className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			)}

			<input
				type="text"
				placeholder="Enter your prompt here"
				onChange={(ev) => handlePromptChange(ev, MAX_PROMPT_LENGTH)}
				value={prompt}
				className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<Button type="submit">Submit</Button>
		</form>
	)
}

function Button({ onClick, children, disabled = false }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-full flex justify-center bg-blue-medium text-white px-4 py-2 rounded-lg transition-colors duration-200 ${
				disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-light'
			}`}>
			{children}
		</button>
	)
}
