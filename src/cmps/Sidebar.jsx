import { Link } from 'react-router-dom'
import { HOME, CREATE, PIC_CLASH } from '../routes'
import SvgIcon from './util/SvgIcon'
import { useSelector } from 'react-redux'

export default function Sidebar() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	let { username, fullname, userId, avatarUrl, following } = ''
	if (loggedInUser) {
		;({ username, fullname, userId, avatarUrl, following } = loggedInUser)
	}

	// const { fullname, username, userId } = user
	const links = [
		{ to: HOME, text: 'Home', svg: 'home' },
		{ to: PIC_CLASH, text: 'Pic Clash', svg: 'questionMark' },
		{ to: CREATE, text: 'Create', svg: 'plus' },
		{ to: `/p/${username || 'Guest'}`, text: 'Profile', svg: null, profile: true },
	]
	return (
		<div className="mr-10 pt-0.5 pb-0.5 pl-1 pr-1 h-screen flex flex-col gap-8 items-start select-none border-r border-gray-300 bg-white w-[244px]">
			<Link to={HOME}>
				<img className="m-3 m-w-full" src={`${process.env.PUBLIC_URL}/img/logo.png`} />
			</Link>
			{links.map(({ to, text, svg, profile }) => (
				<Link
					key={to}
					to={to}
					className="h-4 ml-4 flex hover:bg-gray-300 hover:rounded-md transform hover:scale-105 cursor-pointer transition-all duration-250">
					{svg && <SvgIcon iconName={svg} />}
					{profile && (
						<img
							className="h-6 w-6 rounded-full"
							src={avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
						/>
					)}
					<span className="ml-2">{text}</span>
				</Link>
			))}
		</div>
	)
}
