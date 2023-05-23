import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { getPostsByUserId, getUserByUsername } from '../services/user.service'
import MainWrapper from '../cmps/MainWrapper'
import {useSelector} from 'react-redux'
import { toggleFollower } from '../services/user.service'

export default function Profile() {
	const navigate = useNavigate()
	const { username } = useParams()
	const [user, setUser] = useState(null)
	const [posts, setPosts] = useState([])
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	const [isFollowing, setIsFollowing] = useState(false)
	const handleFollowToggle = async () => {
		setIsFollowing(!isFollowing)
		//set is async so using opposite
		toggleFollower(user.userId, loggedInUser.userId, !isFollowing)
	}
	useEffect(() => {
		document.title = `${username} - Piclash`
		async function getUser() {
			const userByUsername = await getUserByUsername(username)
			if (!userByUsername) {
				navigate('/404')
			}
			setUser(userByUsername)
		}
		getUser()
	}, [username])
	useEffect(() => {
		if (!user || !loggedInUser) return
		setIsFollowing(user.followers.includes(loggedInUser.userId))
		async function getPosts() {
			const posts = await getPostsByUserId(user.userId)
			setPosts(posts || [])
		}
		getPosts()
	}, [user, loggedInUser])//TODO: move to postlist, add grid
	return (
		<MainWrapper>
			<div className="">
				<img
					src={user?.avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
					alt={`${user?.username} avatar`}
					className="h-20 w-20 rounded-full"
				/>
				<div className="">
					<h1 className="text-2xl font-bold">{user?.username}</h1>
					<h2 className="text-lg">{user?.fullname}</h2>
				</div>
				{loggedInUser && user?.userId !== loggedInUser.userId && (
					<button onClick={handleFollowToggle}>{isFollowing ? 'Unfollow' : 'Follow'}</button>
				)}
			</div>
			<div>
				<h2 className="text-2xl font-bold">Posts</h2>
				{user && posts?.length === 0 && <p>{user?.username} has no posts yet.</p>}
				{posts.length > 0 &&
					posts?.map((post, idx) => (
						<img key={idx} src={post.imgSrc} alt={post.caption} className="w-[293px] h-[293px] object-cover" />
					))}
				{/* <PostList posts={user?.posts} /> */}
			</div>
		</MainWrapper>
	)
}
