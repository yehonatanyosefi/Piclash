import CommentPreview from "./CommentPreview"

export default function Comments({comments}) {
  return (
		<div className="p-4 pt-1 pb-4">
			{comments.map((commentDetails, idx) => {
                    const {username, comment, userId, avatarUrl} = commentDetails
				return (
					<CommentPreview
						key={userId || idx}
						avatarUrl={avatarUrl || null}
						username={username}
						comment={comment}
					/>
				)
			})}
		</div>
	)
}
