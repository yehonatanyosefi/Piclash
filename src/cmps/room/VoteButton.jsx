import { useMemo } from 'react'
import { Button } from './Button'
import SvgIcon from '../util/SvgIcon'

const PostWithVote = ({ post, handleVote }) => (
	<div key={post.id} className="space-y-2">
		<img src={post.imgUrl} alt={`Post by ${post.nickname}`} className="w-full h-auto rounded-lg" />
		<Button onClick={() => handleVote(post.id)}>Vote for this image</Button>
	</div>
)

const VotedPostsGallery = ({ posts, votes }) => (
	<>
		<p>Thank you for voting!</p>
		<p>Leaderboard</p>
		<div className="grid grid-cols-2 gap-4">
			{posts.map((post) => (
				<div key={post.id} className="space-y-2">
					<img
						src={post.imgUrl}
						alt={`Post by ${post?.nickname || 'a user'}`}
						className="w-full h-auto rounded-lg"
					/>
					<div className="flex items-center">
						<SvgIcon iconName="like" />
						<span className="ml-2">{votes?.filter((vote) => vote.postId === post.id)?.length || 0}</span>
					</div>
				</div>
			))}
		</div>
	</>
)

function canVote(loggedInUser, post, nickname, GUEST_ID) {
	if (loggedInUser.userId === GUEST_ID) {
		return post.nickname !== nickname
	} else {
		return loggedInUser.userId !== post.userId
	}
}

export function VoteButton({ hasVoted, handleVote, room, nickname, loggedInUser, GUEST_ID }) {
	if (hasVoted) return <VotedPostsGallery posts={room.posts} votes={room.votes} />
	const votablePosts = useMemo(
		() =>
			(room?.posts?.length &&
				room.posts.filter((post) => canVote(loggedInUser, post, nickname, GUEST_ID))) ||
			[],
		[room, loggedInUser, nickname, GUEST_ID]
	)
	if (votablePosts.length === 0) return null

	return (
		<div className="mb-4 space-y-2">
			<p>Select the image you want to vote for:</p>
			{votablePosts.map((post) => (
				<PostWithVote key={post.id} post={post} handleVote={handleVote} />
			))}
		</div>
	)
}
