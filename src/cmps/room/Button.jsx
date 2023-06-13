export function Button({ onClick, children, disabled = false }) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-full flex justify-center bg-blue-medium text-white px-4 py-2 rounded-lg transition-colors duration-200 ${
				disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-light'
			}`}>
			{children}
		</button>
	)
}
