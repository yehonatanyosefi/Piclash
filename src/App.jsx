import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LOGIN, NOT_FOUND, SIGN_UP, HOME, PROFILE, PIC_CLASH, CREATE } from './routes'
import 'react-loading-skeleton/dist/skeleton.css'
import { utilService } from './services/util.service'
import { useDispatch } from 'react-redux'
import { doLogin } from './store/actions/user.actions'

const Home = lazy(() => import('./views/Home'))
const Login = lazy(() => import('./views/Login'))
const Signup = lazy(() => import('./views/Signup'))
const Profile = lazy(() => import('./views/Profile'))
const PicClash = lazy(() => import('./views/PicClash'))
const Create = lazy(() => import('./views/Create'))
const NotFound = lazy(() => import('./views/NotFound'))

export default function App() {
	const dispatch = useDispatch()

	useEffect(() => {
		const user = utilService.loadFromStorage('user')
		if (user) dispatch(doLogin(user.email, user.password))
		else dispatch(doLogin('guest@gmail.com', '123456'))
	}, [])

	return (
		<Suspense fallback={<p>Loading...</p>}>
			<BrowserRouter>
				<Routes>
					<Route path={HOME} element={<Home />} />
					<Route path={LOGIN} element={<Login />} />
					<Route path={SIGN_UP} element={<Signup />} />
					<Route path={PROFILE} element={<Profile />} />
					<Route path={PIC_CLASH} element={<PicClash />} />
					<Route path={CREATE} element={<Create />} />
					<Route path={NOT_FOUND} element={<NotFound />} />
					<Route path="*" element={<Navigate to="/404" replace />} />
				</Routes>
			</BrowserRouter>
		</Suspense>
	)
}
