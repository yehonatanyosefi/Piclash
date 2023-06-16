import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HOME, CREATE, PIC_CLASH } from '../routes'
import SvgIcon from './util/SvgIcon'
import { useSelector } from 'react-redux'
import '../assets/styles/cmps/Sidebar.css'

export default function Sidebar() {
	const loggedInUser = useSelector((storeState) => storeState.userModule.loggedInUser)
	let { username, userId, avatarUrl, following } = ''
	if (loggedInUser) {
		;({ username, userId, avatarUrl, following } = loggedInUser)
	}

	const links = [
		{ to: HOME, text: 'Home', svg: 'home' },
		{ to: PIC_CLASH, text: 'Pic Clash', svg: 'questionMark' },
		{ to: CREATE, text: 'Create', svg: 'plus' },
		{ to: `/p/${username || 'Guest'}`, text: 'Profile', svg: null, profile: true },
	]

	const [isOpen, setIsOpen] = useState(false)

	return (
		<div>
			<button onClick={() => setIsOpen(!isOpen)} className="md:hidden block">
				<SvgIcon className="w-6 h-6" iconName="menu" />
			</button>

			<div
				className={`${
					isOpen ? 'block' : 'hidden'
				} md:block md:w-[244px] md:h-screen md:border-r md:mr-10 md:pt-0.5 md:pb-0.5 md:pl-1 md:pr-1 md:flex md:flex-col md:gap-4 md:items-start md:border-gray-300 md:bg-white`}>
				<Link to={HOME}>
					<img className="mt-3 mb-3 mr-1 m-w-full" src={`${process.env.PUBLIC_URL}/img/logo.png`} />
				</Link>
				{links.map(({ to, text, svg, profile }) => (
					<Link
						key={to}
						to={to}
						className="flex items-center justify-start py-[10px] px-4 ml-2 mr-4 w-[220px] rounded-3xl hover:bg-gray-300 transition-all duration-250 cursor-pointer transition-all duration-250 link"
						aria-label={text}>
						<div className="flex-shrink-0 w-[24px] h-[24px]">
							{svg && <SvgIcon className="w-full h-full" iconName={svg} />}
							{profile && (
								<img
									className="w-full h-full rounded-full"
									src={avatarUrl || `${process.env.PUBLIC_URL}/img/avatars/default.png`}
								/>
							)}
						</div>
						<span className="ml-4 text-sm">{text}</span>
					</Link>
				))}
			</div>
		</div>
	)
}
