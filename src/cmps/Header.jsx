import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HOME, PROFILE } from '../routes'
import { useSelector } from 'react-redux'

export default function Header() {
	const user = useSelector((storeState) => storeState.userModule.loggedInUser)

	return (
		<header className="h-16 bg-white border-b border-gray-primary mb-8">
			<div className="container mx-auto max-w-screen-lg h-full">
				<div className="flex justify-between h-full">
					<div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
						<h1 className="flex justify-center w-full">
							<Link to={HOME} aria-label="Piclash logo">
								<img src="/img/logo.png" alt="Piclash" className="mt-2 w-6/12" />
							</Link>
						</h1>
					</div>
					<div className="text-gray-700 text-center flex items-center align-items">
						{user ? (
							<>
								<Link to={PROFILE} aria-label="Profile">
									{!user?.photoUrl ? (
										<img
											className="rounded-full h-8 w-8 flex"
											src={`/img/avatars/default.jpg`}
											alt={`${user?.displayName} profile`}
										/>
									) : (
										<img
											className="rounded-full h-8 w-8 flex"
											src={user?.photoUrl}
											alt={`${user?.displayName} profile`}
										/>
									)}
								</Link>
								<button
									type="button"
									title="Sign Out"
									// onClick={() => firebase.auth().signOut()}
									// onKeyDown={(ev) => {
									//      if (ev.key === 'Enter') {
									//           firebase.auth().signOut()
									//      }
									// }}
								>
									<svg
										className="w-8 mr-6 text-black-light cursor-pointer"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 13l-5 5m0 0l-5-5m5 5V6"
										/>
									</svg>
								</button>
							</>
						) : (
							<>
								<Link to="/login">
									<button
										type="button"
										className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8">
										Log In
									</button>
								</Link>
								<Link to="/signup">
									<button type="button" className="font-bold text-sm rounded text-blue-medium w-20 h-8">
										Sign Up
									</button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}
