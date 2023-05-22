import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toggleFollower } from '../../services/user.service'
const DEFAULT_PROFILE_PIC = './img/avatars/default.png'
export default function SuggestedProfile({ profileId, profileUsername, profilePhotoUrl, userId }) {
	const [followed, setFollowed] = useState(false)
	async function handleFollowUser() {
		setFollowed((prevFollowed) => !prevFollowed)
          //setting is async so using negative in the toggle
          await toggleFollower(profileId, userId, !followed)
	}
	return (
		<div className="flex flex-row items-center align-items justify-between">
			<div className="flex items-center justify-between">
				<img
					className="rounded-full w-8 flex mr-4"
					src={profilePhotoUrl || DEFAULT_PROFILE_PIC}
					alt={`${profileUsername} profile`}
				/>
				<Link to={`/p/${profileUsername}`} className="flex items-center">
					<p className="font-bold text-sm">{profileUsername}</p>
				</Link>
			</div>
			<button className="text-xs font-bold text-blue-medium mr-4" onClick={handleFollowUser}>
				{followed ? 'Unfollow' : 'Follow'}
			</button>
		</div>
	)
}

SuggestedProfile.propTypes = {
	profileId: PropTypes.string.isRequired,
	profileUsername: PropTypes.string.isRequired,
	profilePhotoUrl: PropTypes.string,
	userId: PropTypes.string.isRequired,
}
