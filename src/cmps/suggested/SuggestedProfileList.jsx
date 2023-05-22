import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import SuggestedProfilePreview from './SuggestedProfilePreview'
import { getSuggestedProfilesById } from '../../services/user.service'

export default function Suggestions({ userId, following }) {
	const [suggestedProfiles, setSuggestedProfiles] = useState(null)

	useEffect(() => {
		async function suggestedProfiles() {
			const response = await getSuggestedProfilesById(userId, following)
			setSuggestedProfiles(response)
		}
		if (userId) {
			suggestedProfiles()
		}
	}, [userId])

	if (!suggestedProfiles) {
		return <Skeleton count={1} height={150} className="mt-5" />
	} else if (suggestedProfiles.length > 0) {
		return (
			<div className="rounded flex flex-col">
				<div className="text-sm flex items-center align-items justify-between mb-2">
					<p className="font-bold text-gray-base">Suggested for you</p>
				</div>
				<div className="mt-4 grid gap-5">
					{suggestedProfiles.map((profile) => {
						return (
							<SuggestedProfilePreview
								key={profile.userId}
								profileId={profile.userId}
                profileUsername={profile.username}
								profilePhotoUrl={profile.photoUrl}
                userId={userId}
							/>
						)
					})}
				</div>
			</div>
		)
	} else return null
}

Suggestions.propTypes = {
	userId: PropTypes.string.isRequired,
	following: PropTypes.array.isRequired,
}
