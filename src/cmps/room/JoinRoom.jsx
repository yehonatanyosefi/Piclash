import { Button } from "./Button";

export function JoinRoom({ inputRoomId, setInputRoomId, joinRoom }) {
	return (
		<div className="mb-4 space-y-2">
			<input
				type="text"
				value={inputRoomId}
				onChange={(e) => setInputRoomId(e.target.value)}
				placeholder="Enter room ID to join"
				className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-blue-500"
			/>
			<Button onClick={joinRoom}>Join</Button>
		</div>
	)
}