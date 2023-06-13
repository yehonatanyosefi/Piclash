export function UserImage({ imgUrl, prompt }) {
	return (
		<div className="mb-4">
			{imgUrl && (
				<>
					<p className="text-gray-600 mb-2">Your Image:</p>
					<div className="rounded-lg overflow-hidden shadow-lg">
						<img className="object-cover w-full h-64" src={imgUrl} alt={prompt} />
					</div>
				</>
			)}
		</div>
	)
}