import { Button } from "./Button";

export function CreateRoom({ setRoomId, utilService }) {
	return (
		<div>
			<p className="text-gray-600 mb-2">Or create a new room:</p>
			<Button onClick={() => setRoomId(utilService.makeId())}>Create Room</Button>
		</div>
	)
}