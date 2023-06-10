/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		fill: (theme) => ({
			red: theme('colors.red.primary'),
		}),
		colors: {
			white: '#ffffff',
			blue: {
				light: '#1974B8',
				medium: '#005c98',
			},
			black: {
				light: '#005c98',
				faded: '#00000059',
			},
			gray: {
				base: '#616161',
				background: '#fafafa',
				primary: '#dbdbdb',
			},
			red: {
				primary: '#ed4956',
			},
		},
	},
	plugins: [],
}
