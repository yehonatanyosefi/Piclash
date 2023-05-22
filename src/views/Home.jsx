import { useEffect } from 'react'
import Sidebar from '../cmps/Sidebar'
import Timeline from '../cmps/Timeline'
import Header from '../cmps/Header'
import User from '../cmps/User'
import { useSelector } from 'react-redux'
import SuggestedProfileList from '../cmps/suggested/SuggestedProfileList'

export default function Home() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	let username = ''
	let fullname = ''
	let userId = ''
	let avatarUrl = ''
	let following = []
	if (loggedInUser) {
		;({ username, fullname, userId, avatarUrl, following } = loggedInUser)
	}

	useEffect(() => {
		document.title = 'Home - Piclash'
	}, [])

	return (
		<>
			{/* <Header /> */}
			<div className="flex gap-4 mx-auto">
				<Sidebar />
				<div className="flex mt-5 ml-[25rem] gap-5">
					<Timeline />
					<div className="hidden md:block">
						<User username={username} fullname={fullname} userId={userId} avatarUrl={avatarUrl} />
						<SuggestedProfileList userId={userId} following={following} />
					</div>
				</div>
			</div>
		</>
	)
}
