import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { setFollowers, getUserByUsername } from '../services/user.service'
import { postService } from '../services/post.service'
import MainWrapper from '../cmps/MainWrapper'
import { useSelector } from 'react-redux'
import Skeleton from 'react-loading-skeleton'

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
		if (!username) return
		document.title = `${username} - Piclash`
	}, [username])

	useEffect(() => {
		async function getUser() {
			try {
				const userByUsername = await getUserByUsername(username)
				if (!userByUsername) {
					navigate('/404')
				}
				setUser(userByUsername)
			} catch (e) {
				console.error(e)
			}
		}
		getUser()
	}, [username, navigate])

	useEffect(() => {
		if (!user || !loggedInUser) return
		setIsFollowing(user?.followers.includes(loggedInUser?.userId))
		async function getPosts() {
			try {
				const posts = await postService.getPostsByUserId(user.userId)
				setPosts(posts || [])
			} catch (e) {
				console.error(e)
			}
		}
		getPosts()
	}, [user, loggedInUser])

	return (
		<MainWrapper>
			<div className="flex flex-col items-center md:items-start pt-4 md:pt-10 max-w-xl mx-auto">
				<div className="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 w-full">
					<img
						src={user?.avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
						alt={`${user?.username} avatar`}
						className="h-32 w-32 md:h-40 md:w-40 rounded-full mx-auto md:mx-0"
					/>
					<div className="flex-1 mt-4 md:mt-0">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold">{user?.username}</h1>
								<h2 className="text-lg">{user?.fullname}</h2>
							</div>
							{loggedInUser && user?.userId !== loggedInUser.userId && (
								<button
									onClick={handleFollowToggle}
									className="bg-blue-medium text-white py-2 px-4 rounded-lg">
									{isFollowing ? 'Unfollow' : 'Follow'}
								</button>
							)}
						</div>
						<div className="flex space-x-4 mt-2">
							<div>
								<span className="font-bold">{posts?.length}</span> posts
							</div>
							<div>
								<span className="font-bold">{user?.followers.length}</span> followers
							</div>
							<div>
								<span className="font-bold">{user?.following.length}</span> following
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="p-4 md:p-8 mt-8 md:mt-12">
				<h2 className="text-2xl font-bold">Posts</h2>
				{user && posts?.length === 0 && <p>{user?.username} has no posts yet.</p>}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					{posts.length > 0 &&
						posts.map((post, idx) => (
							<img
								key={idx}
								src={post.imgSrc}
								alt={post.caption}
								className="w-full h-[300px] object-cover"
							/>
						))}
					{!user &&
						[...Array(6)].map((_, idx) => (
							<Skeleton
								key={idx}
								count={1}
								width={300}
								height={300}
								className="w-full h-[300px] object-cover"
							/>
						))}
				</div>
			</div>
		</MainWrapper>
	)
}
