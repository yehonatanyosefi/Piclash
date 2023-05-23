import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
const DEFAULT_PROFILE_PIC = './img/avatars/default.png'

export default function PostHeader({username, postUrl}) {
  return (
		<header className="flex border-b border-gray-primary h-4 p-4 py-8">
			<div className="flex items-center">
				<Link to={`/p/${username}`} className="flex items-center">
					<img
						className="rounded-full h-8 w-8 flex mr-3"
						src={postUrl || DEFAULT_PROFILE_PIC}
						alt={`${username} profile`}
					/>
					<p className="font-bold">{username}</p>
				</Link>
			</div>
		</header>
	)
}

PostHeader.propTypes = {
     postUrl: PropTypes.string,
     username: PropTypes.string.isRequired
}