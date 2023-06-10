import MainWrapper from '../cmps/MainWrapper'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { postService } from '../services/post.service'
import { useNavigate } from 'react-router'
import { HOME } from '../routes'

export default function Create() {
	const navigate = useNavigate()
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	const [caption, setCaption] = useState('')
	const [imgUrl, setimgUrl] = useState('')
	const handleSubmit = async (ev) => {
		ev.preventDefault()
		if (!loggedInUser) return
		await postService.createPost(loggedInUser, caption, imgUrl)
		navigate(HOME)
	}
	return (
		<MainWrapper>
			<div className="flex flex-col items-center justify-center bg-gray-background px-4 py-8">
				<h1 className="text-4xl font-bold text-blue-medium mb-6">Create</h1>
				<form onSubmit={handleSubmit} method="POST" className="space-y-4">
					<input
						type="text"
						placeholder="Caption"
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						className="w-full px-4 py-2 border border-gray-primary rounded-lg focus:outline-none focus:border-blue-medium"
					/>
					<input
						type="text"
						placeholder="Image URL"
						value={imgUrl}
						onChange={(e) => setimgUrl(e.target.value)}
						className="w-full px-4 py-2 border border-gray-primary rounded-lg focus:outline-none focus:border-blue-medium"
					/>
					<button
						type="submit"
						className="w-full px-4 py-2 bg-blue-medium text-white rounded-lg hover:bg-blue-dark focus:outline-none focus:ring-4 focus:ring-blue-light">
						Create
					</button>
				</form>
			</div>
		</MainWrapper>
	)
}
