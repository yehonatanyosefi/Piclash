import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {
	doc,
	addDoc,
	setDoc,
	collection,
	getDocs,
	query,
	where,
	limit,
	updateDoc,
	orderBy,
	arrayUnion,
	arrayRemove,
} from 'firebase/firestore'

import { db, auth } from '../lib/firebase'

export const userService = {
	signup,
	login,
	updateCurrentUser,
	getUserById,
	getUserByUsername,
	getSuggestedProfilesById,
	setFollowers,
	updateUserFollowing,
	updateUserFollowers,
}

const USER_COLLECTION_KEY = 'user'
const SUGGESTED_PROFILES_NUM = 6

export async function signup(email, password, username, fullname) {
	try {
		if (!email || !password || !username || !fullname) {
			throw new Error('Missing required user input')
		}
		const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
		const user = userCredentials.user
		await updateProfile(auth.currentUser, {
			username: user.username,
			fullname: user.fullname,
		})
		const userObj = await addNewUserToCollection(user.uid, username, fullname, email)
		await updateUserFollowers('aKKGgYXK0NXjHcKgAgWmRkUKQ9M2', userObj.userId, true)
		return userObj
	} catch (err) {
		console.log(`Error in signup:`, err)
		throw err
	}
}

async function addNewUserToCollection(userId, username, fullname, email) {
	try {
		const entityCol = doc(db, USER_COLLECTION_KEY, userId)
		const userObj = {
			userId,
			username,
			fullname,
			email: email.toLowerCase(),
			following: ['aKKGgYXK0NXjHcKgAgWmRkUKQ9M2'],
			followers: [],
			createdAt: Date.now(),
			postUrl: '',
		}
		await setDoc(entityCol, userObj)
		return userObj
	} catch (err) {
		console.error(`Error in adding new user to collection:`, err)
		throw err
	}
}

export async function login(email, password) {
	try {
		const userCredentials = await signInWithEmailAndPassword(auth, email, password)
		const user = userCredentials.user
		if (user !== null) {
			return await getUserById(user.uid)
			// const loggedInUser = {
			// 	displayName: user.displayName,
			// 	email: user.email,
			// 	postURL: user.postURL,
			// 	emailVerified: user.emailVerified,
			// 	userId: user.uid,
			// 	following: user.following,
			// }
			// return user
		}
		return null
	} catch (err) {
		console.log(`Error in login:`, err)
		throw err
	}
}

export async function updateCurrentUser(field = 'displayName', value = auth.currentUser.username) {
	try {
		if (auth.currentUser[field] !== value) {
			await updateProfile(auth.currentUser, {
				[field]: value,
			})
		}
	} catch (err) {
		console.log(`Error in updating user:`, err)
		throw err
	}
}

export async function doesUserNameExists(username) {
	try {
		const result = await getDocs(
			query(collection(db, USER_COLLECTION_KEY), where('username', '==', username), limit(1))
		)
		return !result.empty
	} catch (err) {
		console.log(`Error in checking if user exists:`, err)
		throw err
	}
}

export async function doesThisEmailExist(email) {
	try {
		const result = await getDocs(
			query(collection(db, USER_COLLECTION_KEY), where('email', '==', email), limit(1))
		)
		return !result.empty
	} catch (err) {
		console.log(`Error in checking if email exists:`, err)
		throw err
	}
}

export async function getUserById(userId) {
	try {
		const result = await getDocs(
			query(collection(db, USER_COLLECTION_KEY), where('userId', '==', userId))
		)
		const user = result.docs.map((item) => ({
			...item.data(),
			docId: item.id,
		}))[0]
		return user
	} catch (err) {
		console.log(`Error in getting user by id:`, err)
		throw err
	}
}

export async function getUserByUsername(username) {
	try {
		const result = await getDocs(
			query(collection(db, USER_COLLECTION_KEY), where('username', '==', username))
		)
		const user = result.docs.map((item) => ({
			...item.data(),
			docId: item.id,
		}))[0]
		return user
	} catch (err) {
		console.log(`Error in getting user by username:`, err)
		throw err
	}
}

export async function getSuggestedProfilesById(userId, following) {
	try {
		let profiles = []
		if (following.length > 0) {
			const result1 = await getDocs(
				query(
					collection(db, USER_COLLECTION_KEY),
					where('userId', 'not-in', [...following, userId]),
					limit(SUGGESTED_PROFILES_NUM)
				)
			)
			profiles = result1.docs.map((user) => ({
				...user.data(),
				docId: user.id,
			}))
		} else {
			const result2 = await getDocs(
				query(
					collection(db, USER_COLLECTION_KEY),
					where('userId', '!=', userId),
					limit(SUGGESTED_PROFILES_NUM)
				)
			)
			profiles = result2.docs.map((user) => ({
				...user.data(),
				docId: user.id,
			}))
		}
		return profiles
	} catch (err) {
		console.log(`Error in getting suggested profiles by id:`, err)
		throw err
	}
}

export async function setFollowers(followedUserId, userId, newIsFollowing) {
	await updateUserFollowing(userId, followedUserId, newIsFollowing)
	await updateUserFollowers(followedUserId, userId, newIsFollowing)
}

export async function updateUserFollowing(userId, followingUserId, isFollowingProfile) {
	try {
		const loggedInUserDoc = doc(db, USER_COLLECTION_KEY, userId)
		await updateDoc(loggedInUserDoc, {
			following: isFollowingProfile ? arrayUnion(followingUserId) : arrayRemove(followingUserId),
		})
	} catch (err) {
		console.log(`Error in updating user's following:`, err)
		throw err
	}
}

export async function updateUserFollowers(userId, followerId, isFollowingProfile) {
	try {
		const followedUserDoc = doc(db, USER_COLLECTION_KEY, userId)
		await updateDoc(followedUserDoc, {
			followers: isFollowingProfile ? arrayUnion(followerId) : arrayRemove(followerId),
		})
	} catch (err) {
		console.log(`Error in updating followed user followers:`, err)
		throw err
	}
}
