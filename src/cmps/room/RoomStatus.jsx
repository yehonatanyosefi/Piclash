export function RoomStatus({ roomId, room, numberOfPlayers }) {
	return (
		<div className="text-center space-y-2 mb-6">
			<h2 className="text-blue-500 text-2xl font-bold">Room #{roomId}</h2>
			<h3 className="text-blue-500 text-xl">Category: {room?.category}</h3>
			{room?.status === 'started' && <h3 className="text-blue-500 text-xl">Game has started!</h3>}
			{room?.status === 'pending' && numberOfPlayers < 3 && (
				<p className="text-gray-600">
					Wait for more people to join, current people in the room: {numberOfPlayers}/3
				</p>
			)}
			{room?.status === 'pending' && numberOfPlayers >= 3 && (
				<p className="text-gray-600">Current people in the room: {numberOfPlayers}</p>
			)}
		</div>
	)
}
