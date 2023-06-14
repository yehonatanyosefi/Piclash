import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'
import { memo } from 'react'
import { LOGIN } from '../routes'

function User({ username, fullname, userId, avatarUrl }) {
	if (!username || !fullname || !userId) return <Skeleton count={1} height={61} />

	return (
		<>
			<div className="flex items-center justify-between mb-6">
				<Link to={`/p/${username}`} className="flex items-center">
					<div className="flex items-center mr-3">
						<img
							className="rounded-full w-16"
							src={avatarUrl || '/img/avatars/default.png'}
							alt="Profile picture"
						/>
					</div>
					<div className="ml-3">
						<p className="font-bold text-sm">{username}</p>
						<p className="text-sm">{fullname}</p>
					</div>
				</Link>
				<Link to={LOGIN} className="text-blue-medium text-sm mr-3 font-bold ml-10">
					switch
				</Link>
			</div>
		</>
	)
}

User.propTypes = {
	username: PropTypes.string,
	fullname: PropTypes.string,
	userId: PropTypes.string,
	avatarUrl: PropTypes.string,
}

export default memo(User)
