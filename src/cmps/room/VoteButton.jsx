import { Button } from "./Button"

export function VoteButton({ hasVoted, handleVote, room, numberOfPlayers }) {
	return (
		<div className="mb-4 space-y-2">
			{!hasVoted && room?.posts?.length >= numberOfPlayers && (
				<>
					<p>Select the image you want to vote for:</p>
					{room.posts.map((post) => (
						<div key={post.id} className="space-y-2">
							<img src={post.imgUrl} alt={post.prompt} className="w-full h-auto rounded-lg" />
							<Button onClick={() => handleVote(post.id)}>Vote for this image</Button>
						</div>
					))}
				</>
			)}
		</div>
	)
}
