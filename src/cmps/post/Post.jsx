import { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'
import Actions from './Actions'
import CommentList from './CommentList'
import AddComment from './AddComment'
import { formatDistance } from 'date-fns'
import { addComment } from '../../services/user.service'
import { useSelector } from 'react-redux'

const COMMENTS_TO_SHOW = 3

export default function Post({ content }) { //TODO: add post details
	const commentInput = useRef(null)
	const handleFocus = () => commentInput.current.focus()
	const { username, caption, userPhotoUrl, docId, likes, createdAt, comments, imgSrc, userLikedPhoto } =
		content
	const [commentsSlice, setCommentsSlice] = useState(comments.slice(0, COMMENTS_TO_SHOW-1))
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	function addAComment(comment) {
		const userId = loggedInUser?.userId
		if (!userId) return
		const commentObj = {
			comment,
			userId,
			username: loggedInUser.username,
			createdAt: Date.now(),
		}
		setCommentsSlice([...commentsSlice, commentObj])
		addComment(commentObj, docId, userId)
	}
	return (
		<div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
			<Header username={username} photoUrl={userPhotoUrl} />
			<img src={imgSrc} alt={caption} className="min-w-full" />
			<Actions
				docId={docId}
				totalLikes={likes.length}
				likedPhoto={userLikedPhoto}
				handleFocus={handleFocus}
			/>
			{/* <div className="p-4 pt-2 pb-0">
				<p className="font-bold mb-1">{username}</p>
				<p className="">{caption}</p>
			</div> */}
			<CommentList comments={[{ username: username, comment: caption, createdAt: createdAt }]} />
			<CommentList comments={commentsSlice} />
			{comments.length > COMMENTS_TO_SHOW ? (
				<p className="text-gray-base uppercase text-xs mt-2 ml-4">
					<button type="button">View all {comments.length + commentsSlice.length - COMMENTS_TO_SHOW} comments</button>
				</p>
			) : (
				''
			)}
			<p className="text-gray-base uppercase text-xs mt-2 ml-4">
				{formatDistance(createdAt, new Date())} ago
			</p>
			<AddComment addComment={addAComment} commentInput={commentInput} />
		</div>
	)
}

Post.propTypes = {
	content: PropTypes.shape({
		username: PropTypes.string.isRequired,
		imgSrc: PropTypes.string.isRequired,
		caption: PropTypes.string.isRequired,
		docId: PropTypes.string.isRequired,
		userLikedPhoto: PropTypes.bool.isRequired,
		likes: PropTypes.array.isRequired,
		comments: PropTypes.array.isRequired,
		createdAt: PropTypes.number.isRequired,
	}),
}
