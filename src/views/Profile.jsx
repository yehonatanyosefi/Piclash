// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router'
// import { setFollowers, getUserByUsername } from '../services/user.service'
// import { postService } from '../services/post.service'
// import MainWrapper from '../cmps/MainWrapper'
// import { useSelector } from 'react-redux'

// export default function Profile() {
// 	const navigate = useNavigate()
// 	const { username } = useParams()
// 	const [user, setUser] = useState(null)
// 	const [posts, setPosts] = useState([])
// 	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
// 	const [isFollowing, setIsFollowing] = useState(false)
// 	const handleFollowToggle = async () => {
// 		setIsFollowing(!isFollowing)
// 		setFollowers(user.userId, loggedInUser.userId, !isFollowing)
// 	}
// 	useEffect(() => {
// 		document.title = `${username} - Piclash`
// 		async function getUser() {
// 			const userByUsername = await getUserByUsername(username)
// 			if (!userByUsername) {
// 				navigate('/404')
// 			}
// 			setUser(userByUsername)
// 		}
// 		getUser()
// 	}, [username])
// 	useEffect(() => {
// 		if (!user || !loggedInUser) return
// 		setIsFollowing(user.followers.includes(loggedInUser.userId))
// 		async function getPosts() {
// 			const posts = await postService.getPostsByUserId(user.userId)
// 			setPosts(posts || [])
// 		}
// 		getPosts()
// 	}, [user, loggedInUser])
// 	return (
// 		<MainWrapper>
// 			<div className="flex items-center space-x-4">
// 				<img
// 					src={user?.avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
// 					alt={`${user?.username} avatar`}
// 					className="h-20 w-20 rounded-full"
// 				/>
// 				<div className="">
// 					<h1 className="text-2xl font-bold">{user?.username}</h1>
// 					<h2 className="text-lg">{user?.fullname}</h2>
// 					{loggedInUser && user?.userId !== loggedInUser.userId && (
// 						<button
// 							onClick={handleFollowToggle}
// 							className="bg-blue-medium text-white py-2 px-4 rounded-lg">
// 							{isFollowing ? 'Unfollow' : 'Follow'}
// 						</button>
// 					)}
// 				</div>
// 			</div>
// 			<div>
// 				<h2 className="text-2xl font-bold">Posts</h2>
// 				{user && posts?.length === 0 && <p>{user?.username} has no posts yet.</p>}
// 				<div className="grid grid-cols-3 gap-4">
// 					{posts.length > 0 &&
// 						posts?.map((post, idx) => (
// 							<img
// 								key={idx}
// 								src={post.imgSrc}
// 								alt={post.caption}
// 								className="w-full h-auto object-cover"
// 							/>
// 						))}
// 				</div>
// 			</div>
// 		</MainWrapper>
// 	)
// }
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { setFollowers, getUserByUsername } from '../services/user.service'
import { postService } from '../services/post.service'
import MainWrapper from '../cmps/MainWrapper'
import { useSelector } from 'react-redux'

export default function Profile() {
	const navigate = useNavigate()
	const { username } = useParams()
	const [user, setUser] = useState(null)
	const [posts, setPosts] = useState([])
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	const [isFollowing, setIsFollowing] = useState(false)

	const handleFollowToggle = useCallback(async () => {
		setIsFollowing(!isFollowing)
		await setFollowers(user.userId, loggedInUser.userId, !isFollowing).catch((e) => console.error(e))
	}, [isFollowing, loggedInUser, user])

	useEffect(() => {
		document.title = `${username} - Piclash`
		const controller = new AbortController()
		async function getUser() {
			try {
				const userByUsername = await getUserByUsername(username, controller.signal)
				if (!userByUsername) {
					navigate('/404')
				}
				setUser(userByUsername)
			} catch (e) {
				console.error(e)
			}
		}
		getUser()

		return () => {
			controller.abort()
		}
	}, [username, navigate])

	useEffect(() => {
		if (!user || !loggedInUser) return
		setIsFollowing(user.followers.includes(loggedInUser.userId))
		const controller = new AbortController()
		async function getPosts() {
			try {
				const posts = await postService.getPostsByUserId(user.userId, controller.signal)
				setPosts(posts || [])
			} catch (e) {
				console.error(e)
			}
		}
		getPosts()

		return () => {
			controller.abort()
		}
	}, [user, loggedInUser])

	return (
		<MainWrapper>
			<div className="flex items-center space-x-4">
				<img
					src={user?.avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
					alt={`${user?.username} avatar`}
					className="h-20 w-20 rounded-full"
				/>
				<div className="">
					<h1 className="text-2xl font-bold">{user?.username}</h1>
					<h2 className="text-lg">{user?.fullname}</h2>
					{loggedInUser && user?.userId !== loggedInUser.userId && (
						<button
							onClick={handleFollowToggle}
							className="bg-blue-medium text-white py-2 px-4 rounded-lg">
							{isFollowing ? 'Unfollow' : 'Follow'}
						</button>
					)}
				</div>
			</div>
			<div>
				<h2 className="text-2xl font-bold">Posts</h2>
				{user && posts?.length === 0 && <p>{user?.username} has no posts yet.</p>}
				<div className="grid grid-cols-3 gap-4">
					{posts.length > 0 &&
						posts.map((post, idx) => (
							<img
								key={idx}
								src={post.imgSrc}
								alt={post.caption}
								className="w-full h-auto object-cover"
							/>
						))}
				</div>
			</div>
		</MainWrapper>
	)
}
