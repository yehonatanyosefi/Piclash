import { useEffect, useState } from 'react'
import { LOGIN, HOME } from '../routes'
import { doesUserNameExists, doesThisEmailExist } from '../services/user.service'
import { doSignup } from '../store/actions/user.actions'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Signup() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [username, setUsername] = useState('')
	const [fullname, setFullname] = useState('')
	const [emailAddress, setEmailAddress] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState('')
	const areFieldsEmpty = password === '' || emailAddress === '' || username === '' || fullname === ''
	async function isValid() {
		if (areFieldsEmpty) {
			setError('Please fill out all fields.')
			return false
		}
		if (!emailRegex.test(emailAddress)) {
			setError('Please enter a valid email address.')
			return false
		}
		if (username.length < 3) {
			setError('Username must be at least 3 characters.')
			return false
		}
		if (password.length < 6) {
			setError('Password must be at least 6 characters.')
			return false
		}
		if (username.includes(' ')) {
			setError('Username cannot contain spaces.')
			return false
		}
		if (password.includes(' ')) {
			setError('Password cannot contain spaces.')
			return false
		}
		try {
			const userNameExists = await doesUserNameExists(username)
			if (userNameExists) {
				setError('That username is already taken, please try another.')
				return false
			}
		} catch (err) {
			setError('Error in signup request. Please try again.')
			return false
		}
		try {
			const emailAddressExists = await doesThisEmailExist(emailAddress)
			if (emailAddressExists) {
				setError('That email address is already taken, please try another.')
				return false
			}
		} catch (err) {
			setError('Error in signup request. Please try again.')
			return false
		}
		return true
	}
	const handleSignup = async (ev) => {
		ev.preventDefault()
		const valid = await isValid()
		if (!valid) return
		try {
			await dispatch(doSignup(emailAddress, password, username, fullname))
			navigate(HOME)
		} catch (err) {
			console.error('Error in signup: ', err)
			setError('Error in signup request. Please try again.')
		}
	}

	useEffect(() => {
		document.title = 'Signup - Piclash'
	}, [])

	return (
		<div className="container flex mx-auto max-w-screen-md items-center h-screen">
			<div className="flex w-3/5">
				<img src="/img/iphone-with-profile.jpg" alt="iPhone with Piclash app" />
			</div>
			<div className="flex flex-col w-2/5">
				<div className="bg-white p-4 border border-gray-primary mb-4 rounded">
					<Link to={HOME}>
						<h1 className="flex justify-center w-full">
							<img src="/img/logo.png" alt="Piclash" className="mt-2 w-6/12 mb-4" />
						</h1>
					</Link>
					<form onSubmit={handleSignup} method="POST" className="">
						{error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
						<input
							aria-label="Enter your username"
							type="text"
							placeholder="Username "
							onChange={({ target }) => setUsername(target.value)}
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							value={username}
						/>
						<input
							aria-label="Enter your full name"
							type="text"
							placeholder="Full Name "
							onChange={({ target }) => setFullname(target.value)}
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							value={fullname}
						/>
						<input
							aria-label="Enter your email address"
							type="text"
							placeholder="Email address"
							onChange={({ target }) => setEmailAddress(target.value)}
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							value={emailAddress}
						/>
						<input
							aria-label="Enter your password"
							type="password"
							placeholder="Password"
							onChange={({ target }) => setPassword(target.value)}
							className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
							value={password}
						/>
						<button
							type="submit"
							className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
								areFieldsEmpty && 'opacity-50'
							}`}>
							Signup
						</button>
					</form>
				</div>
				<div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary rounded">
					<p className="text-sm">
						Already have an account?{` `}
						<Link to={LOGIN} className="text-blue-medium font-bold">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
