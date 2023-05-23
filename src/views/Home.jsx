import { useEffect } from 'react'
import Timeline from '../cmps/Timeline'
import User from '../cmps/User'
import { useSelector } from 'react-redux'
import SuggestedProfileList from '../cmps/suggested/SuggestedProfileList'
import MainWrapper from '../cmps/MainWrapper'

export default function Home() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	let { username, fullname, userId, avatarUrl, following } = ''
	if (loggedInUser) {
		;({ username, fullname, userId, avatarUrl, following } = loggedInUser)
	}

	useEffect(() => {
		document.title = 'Home - Piclash'
	}, [])

	return (
		<MainWrapper>
			<div className="flex mt-5 gap-5">
				<Timeline />
				<div className="hidden md:block">
					<User username={username} fullname={fullname} userId={userId} avatarUrl={avatarUrl} />
					<SuggestedProfileList userId={userId || ''} following={following || []} />
				</div>
			</div>
		</MainWrapper>
	)
}
