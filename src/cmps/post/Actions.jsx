import { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { postService } from '../../services/post.service'
import { useSelector } from 'react-redux'
import SvgIcon from '../util/SvgIcon'

export default function PostActions({ docId, totalLikes, likedPost, handleFocus }) {
	const { userId = '' } = useSelector((storeState) => storeState.userModule.loggedInUser)

	const [likeToggle, setLikeToggle] = useState(likedPost)
	const [likes, setLikes] = useState(totalLikes)

	const handleToggleLiked = () => {
		setLikeToggle((prevLikeToggle) => !prevLikeToggle)
		//since we are using the previous state, we use the opposite in the next set and toggleLiked
		setLikes((prevLikes) => (likeToggle ? prevLikes - 1 : prevLikes + 1))
		postService.toggleLiked(docId, userId, !likeToggle)
	}

	useEffect(() => {
		setLikes(totalLikes)
	}, [totalLikes])

	return (
		<div className="flex justify-between p-4">
			<div className="flex">
				<SvgIcon
					iconName={likeToggle ? 'unlike' : 'like'}
					onClick={handleToggleLiked}
					className="w-8 mr-4 select-none cursor-pointer"
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleToggleLiked()
						}
					}}
					tabIndex={0}
				/>
				<SvgIcon
					iconName="comments"
					className="w-8 select-none cursor-pointer"
					onClick={handleFocus}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							handleFocus()
						}
					}}
					tabIndex={0}
				/>
			</div>
			<div className="p-4 py-0">
				<p className="font-bold">
					{likes}
					{` `}like{likes !== 1 ? `s` : ``}
				</p>
			</div>
		</div>
	)
}

PostActions.propTypes = {
	docId: PropTypes.string.isRequired,
	totalLikes: PropTypes.number.isRequired,
	likedPost: PropTypes.bool.isRequired,
	handleFocus: PropTypes.func.isRequired,
}
