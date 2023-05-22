import { Link } from "react-router-dom"
import Skeleton from "react-loading-skeleton"
import PropTypes from 'prop-types'
import { memo } from "react"

function User({username, fullname, userId, avatarUrl}) {
  if (!username || !fullname || !userId) return <Skeleton count={1} height={61} />

  return (
    <Link to={`/p/${username}`} className="grid grid-cols-4 gap-4 mb-6 items-center">
      <div className="flex items-center justify-between col-span-1">
        <img
          className="rounded-full w-16 flex mr-3"
          src={avatarUrl || '/img/avatars/default.png'}
          alt="Profile picture"
        />
      </div>
      <div className="col-span-3">
        <p className="font-bold text-sm">{username}</p>
        <p className="text-sm">{fullname}</p>
      </div>
    </Link>
  )
}

User.propTypes = {
  username: PropTypes.string,
  fullname: PropTypes.string,
  userId: PropTypes.string,
  avatarUrl: PropTypes.string
}

export default memo(User)