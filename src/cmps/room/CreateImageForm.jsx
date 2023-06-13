import { Button } from './Button'

export function CreateImageForm({
	createImgWithAi,
	nickname,
	handleNickChange,
	loggedInUser,
	prompt,
	handlePromptChange,
	MAX_PROMPT_LENGTH,
}) {
	return (
		<form onSubmit={createImgWithAi} className="space-y-4">
			{loggedInUser?.username === 'Guest' && (
				<input
					type="text"
					name="nickname"
					value={nickname}
					placeholder="Enter nickname here"
					onChange={(ev) => handleNickChange(ev)}
					className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			)}

			<input
				type="text"
				placeholder="Enter your prompt here"
				onChange={(ev) => handlePromptChange(ev, MAX_PROMPT_LENGTH)}
				value={prompt}
				className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<Button type="submit">Submit</Button>
		</form>
	)
}
