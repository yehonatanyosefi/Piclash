import { Link } from 'react-router-dom'
import { HOME, CREATE, PROFILE, PIC_CLASH } from '../routes'
import SvgIcon from './util/SvgIcon'
export default function Sidebar() {
	
	// const { fullname, username, userId } = user
	const links = [
		{ to: HOME, text: 'Home', svg: 'home' },
		{ to: PIC_CLASH, text: 'Pic Clash', svg: 'questionMark' },
		{ to: CREATE, text: 'Create', svg: 'plus' },
		{ to: PROFILE, text: 'Profile', svg: 'instagram' },
	]
	return (
		<div className="fixed inset-0 pt-0.5 pb-0.5 pl-1 pr-1 h-screen flex flex-col gap-8 items-start select-none border-r border-gray-300 bg-white w-[244px]">
		<img className="m-3 m-w-full" src="./img/logo.png" />
			{links.map(({ to, text, svg }) => (
				<Link
					key={to}
					to={to}
					className="h-4 ml-4 flex hover:bg-gray-300 hover:rounded-md transform hover:scale-105 cursor-pointer transition-all duration-250">
					<SvgIcon iconName={svg} />
					<span className="ml-2">{text}</span>
				</Link>
			))}
		</div>
	)
}
