import { Link } from 'react-router-dom'
import { HOME, CREATE, PROFILE, PIC_CLASH } from '../../routes'
import useUser from '../../hooks/useUser'
import SvgIcon from '../util/SvgIcon'
export default function Sidebar() {
	// const { user } = useUser()
	// const { fullname, username, userId } = user
	const links = [
		{ to: HOME, text: 'Home', svg: 'home' },
		{ to: PIC_CLASH, text: 'Pic Clash', svg: 'clash' },
		{ to: CREATE, text: 'Create', svg: 'plus' },
		{ to: PROFILE, text: 'Profile', svg: 'profile' },
	]
	return (
		<div className="flex flex-col bg-white w-[244px]">
			{links.map(({ to, text, svg }) => (
				<Link
					key={to}
					to={to}
					className="mb-4 flex flex-col text-gray-600 justify-center">
					<SvgIcon iconName={svg} />
					<span className="ml-2">{text}</span>
				</Link>
			))}
		</div>
	)
}
