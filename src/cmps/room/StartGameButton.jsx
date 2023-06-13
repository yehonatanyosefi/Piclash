import { Button } from './Button'

export function StartGameButton({ numberOfPlayers, startGameRoom, room, MIN_PEOPLE_TO_START }) {
	const disabled = numberOfPlayers < MIN_PEOPLE_TO_START || room?.status !== 'pending'
	return (
		<div className="mb-4">
			{!disabled && (
				<>
					<p className="text-gray-600">You can start the game!</p>
					<Button onClick={startGameRoom} disabled={disabled}>
						Start
					</Button>
				</>
			)}
		</div>
	)
}
