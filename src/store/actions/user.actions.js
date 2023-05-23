import { login, signup } from '../../services/user.service'
import { SET_USER } from '../reducers/user.reducer'
import { utilService } from '../../services/util.service'

const AUTH_KEY = 'user'
// export function loadUser() {
//     return async (dispatch, getState) => {
//         try {
//             const loggedInUser = await getUser()
//             const action = {
//                 type: SET_USER,
//                 loggedInUser
//             }
//             dispatch(action)
//         } catch (error) {
//             console.error('error:', error)
//         }
//     }
// }

export function doLogin(email, password) {
	return async (dispatch, getState) => {
		try {
			const loggedInUser = await login(email, password)
			if (loggedInUser) utilService.saveToStorage(AUTH_KEY, { email, password })
			else utilService.removeFromStorage(AUTH_KEY)
			const action = {
				type: SET_USER,
				loggedInUser,
			}
			dispatch(action)
            return loggedInUser
		} catch (err) {
			console.error('error:', err)
		}
	}
}

export function doSignup(email, password, username, fullname) {
	return async (dispatch, getState) => {
		try {
			const loggedInUser = await signup(email, password, username, fullname)
			if (loggedInUser) utilService.saveToStorage(AUTH_KEY, { email, password })
			else utilService.removeFromStorage(AUTH_KEY)
			const action = {
				type: SET_USER,
				loggedInUser,
			}
			dispatch(action)
            return loggedInUser
		} catch (err) {
			console.error('error:', err)
			throw err
		}
	}
}

// export function spendCoins(contact, amount) {
//     return async (dispatch, getState) => {
//         try {
//             const loggedInUser = await addMove(contact, amount)
//             const action = {
//                 type: SET_USER,
//                 loggedInUser
//             }
//             dispatch(action)
//         } catch (error) {
//             console.error('error:', error)
//         }
//     }
// }
