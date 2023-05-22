import { useContext, useEffect, useState } from 'react'
import { HOME, SIGN_UP } from '../routes'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { doLogin } from '../store/actions/user.actions'
export default function Login() {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [emailAddress, setEmailAddress] = useState('')
	const [password, setPassword] = useState('')

	const [error, setError] = useState('')
	const areFieldsEmpty = password === '' || emailAddress === ''

	const handleLogin = async (ev) => {
		ev.preventDefault()
		if (areFieldsEmpty) {
			setError('Please fill out all fields.')
			return
		}
		try {
			await dispatch(doLogin(emailAddress, password))
			navigate(HOME)
		} catch (err) {
			setError(err.message)
		}
	}

	useEffect(() => {
		document.title = 'Login - Piclash'
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
					<form onSubmit={handleLogin} method="POST" className="">
						{error && <p className="mb-4 text-xs text-red-primary">{error}</p>}
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
							disabled={areFieldsEmpty}
							className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
								areFieldsEmpty && 'opacity-50'
							}`}>
							Login
						</button>
					</form>
				</div>
				<div className="flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary rounded">
					<p className="text-sm">
						Don't have an account?{` `}
						<Link to={SIGN_UP} className="text-blue-medium font-bold">Sign up</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
