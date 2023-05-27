import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createPost } from '../services/user.service'

const MAX_PROMPT_LENGTH = 280

const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
	apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export default function Room() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	const [prompt, setPrompt] = useState('')
	const [imgUrl, setImgUrl] = useState('')
	const [loading, setLoading] = useState(false)
	const [category, setCategory] = useState('')
	const [error, setError] = useState(null)
	const [votes, setVotes] = useState({}) //TODO add voting
	const [hasVoted, setHasVoted] = useState(false)

	function handleVote() {
		if (!hasVoted) {
			setVotes((prevVotes) => ({
				...prevVotes,
				[imgUrl]: (prevVotes[imgUrl] || 0) + 1,
			}))
			setHasVoted(true)
		}
	}
	function getRndCategory() {
		const categories = [
			'Food',
			'Animals',
			'Nature',
			'Objects',
			'People',
			'Places',
			'Symbols',
			'Vehicles',
			'Art',
			'Architecture',
			'Technology',
			'Sports',
			'Music',
			'Movies',
			'Fashion',
			'History',
			'Literature',
			'Travel',
			'Holidays',
			'Science',
			'Education',
			'Health',
			'Business',
			'Entertainment',
			'Weather',
			'Space',
			'Fantasy',
			'Gaming',
			'Comics',
			'Photography',
			'Religion',
			'Philosophy',
			'Politics',
			'Gardening',
			'Cooking',
			'DIY',
			'Fitness',
			'Adventure',
			'Beach',
			'Mountain',
			'Cityscape',
			'Forest',
			'Desert',
			'Jungle',
			'Ocean',
			'Lakes',
			'Landmarks',
			'Festivals',
			'Mythology',
			'Fairy Tales',
		]
		const rndCategory = categories[Math.floor(Math.random() * categories.length)]
		return rndCategory
	}

	useEffect(() => {
		setCategory(getRndCategory())
	}, [])

	async function makeWithDallE(ev) {
		ev.preventDefault()
		setError(null)
		try {
			setLoading(true)
			const response = await openai.createImage({
				prompt,
				n: 1,
				size: '1024x1024',
			})
			const imgUrl = response.data.data[0].url
			if (!loggedInUser) return
			await createPost(loggedInUser, `Made with AI, Prompt: ${prompt}`, imgUrl)
			setPrompt('')
			setImgUrl(imgUrl)
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

	return (
		<div className="flex flex-col items-center justify-center bg-gray-background px-4 py-8">
			<div className="font-bold text-2xl mb-2 text-center text-blue-medium">Room #42342</div>
			<div className="ftext-xl mb-2 text-center text-blue-medium">Category: {category}</div>
			<div className="text-gray-base mb-4 text-center">
				Wait for more people to join, current people: 1/3
			</div>
			{imgUrl && !hasVoted && (
				<button onClick={handleVote} className="...">
					Vote
				</button>
			)}
			{imgUrl && (
				<div className="max-w-md max-h-md overflow-hidden rounded-lg shadow-lg mb-4">
					<img className="object-cover w-full h-full" src={imgUrl} alt={prompt} />
				</div>
			)}
			{loading && <div className="text-center text-gray-primary">Loading...</div>}
			{error && <div className="text-center text-red-500">{error}</div>}
			{!loading && (
				<form onSubmit={makeWithDallE} method="POST" className="space-y-4">
					<input
						type="text"
						placeholder="Enter your prompt here"
						onChange={(ev) => handlePromptChange(ev)}
						value={prompt}
						className="w-full px-4 py-2 border border-gray-primary rounded-lg focus:outline-none focus:border-blue-medium"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 bg-blue-medium text-white rounded-lg hover:bg-blue-dark focus:outline-none focus:ring-4 focus:ring-blue-light">
						Submit
					</button>
				</form>
			)}
		</div>
	)
}
