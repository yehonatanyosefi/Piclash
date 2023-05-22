import React from 'react'
import { Link } from 'react-router-dom'

export default function Comment({ username, comment, avatarUrl = './img/avatars/default.png', isPreview = true }) {
	return (
		<p className="mb-1">
			<Link to={`/p/${username}`}>
				<span className="mr-1 font-bold">{username}</span>
			</Link>
			{comment}
		</p>
	)
}
