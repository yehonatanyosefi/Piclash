import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth'
import {
	getFirestore,
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
	arrayRemove
} from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()

const USER_COLLECTION_KEY = 'user'
const POST_COLLECTION_KEY = 'post'
const SUGGESTED_PROFILES_NUM = 6

export async function signup(email, password, username, fullname) {
	try {
		const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
		const user = userCredentials.user
		await updateProfile(auth.currentUser, {
			username: user.username,
			fullname: user.fullname,
		})
		return await addNewUserToCollection(user.uid, username, fullname, email)
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
			following: [],
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

export async function toggleFollower(followedUserId, userId, newIsFollowing) {
	await updateUserFollowing(userId, followedUserId, newIsFollowing)
	await updateUserFollowers(followedUserId, userId, newIsFollowing)
}

export async function updateUserFollowing(
	userId,
	followingUserId,
	isFollowingProfile
) {
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

export async function updateUserFollowers(
	userId,
	followerId,
	isFollowingProfile
) {
	try {
		const followedUserDoc = doc(db, USER_COLLECTION_KEY, userId)
		await updateDoc(followedUserDoc, {
			followers: isFollowingProfile
				? arrayUnion(followerId)
				: arrayRemove(followerId),
		})
	} catch (err) {
		console.log(`Error in updating followed user followers:`, err)
		throw err
	}
}

export async function getPostsByUserId(userId) {
	try {
		const result = await getDocs(
			query(collection(db, POST_COLLECTION_KEY), where('userId', '==', userId))
		)
		const posts = result.docs.map((item) => ({
			...item.data(),
			docId: item.id,
		}))
		return posts
	} catch (err) {
		console.log(`Error in getting posts by user id:`, err)
		throw err
	}
}

export async function getPosts(userId, following) {
	try {
		const result = await getDocs(
			query(
				collection(db, POST_COLLECTION_KEY),
				where('userId', 'in', [...following, userId]),
				orderBy('createdAt', 'desc')
			)
		)
		const posts = result.docs.map((item) => ({
			...item.data(),
			docId: item.id,
		}))
		const postsWithUserDetails = await Promise.all(
			posts.map(async (post) => {
				let userLikedPost = false
				if (post.likes.includes(userId)) {
					userLikedPost = true
				}
				const user = await getUserById(post.userId)
				const { username, postUrl } = user
				return { username, userPostUrl: postUrl, ...post, userLikedPost }
			})
		)
		return postsWithUserDetails
	} catch (err) {
		console.log(`Error in getting posts:`, err)
		throw err
	}
}

//TODO move to this function
// export async function getPosts(userId, following, lastPostDoc = null, pageSize = 10) {
// 	try {
// 		let postQuery = query(
// 			collection(db, POST_COLLECTION_KEY),
// 			where('userId', 'in', [...following, userId]),
// 			orderBy('createdAt', 'desc'),
// 			limit(pageSize)
// 		)

// 		if (lastPostDoc) {
// 			postQuery = startAfter(postQuery, lastPostDoc)
// 		}

// 		const result = await getDocs(postQuery)
// 		const posts = result.docs.map((item) => ({
// 			...item.data(),
// 			docId: item.id,
// 		}))

// 		// Get unique userIds from posts
// 		const userIds = [...new Set(posts.map((post) => post.userId))]

// 		// Fetch all users in one go
// 		const users = await Promise.all(userIds.map((id) => getUserById(id)))

// 		// Create a map for quick lookup
// 		const userMap = users.reduce((map, user) => {
// 			map[user.userId] = user
// 			return map
// 		}, {})

// 		// Map user data to posts
// 		const postsWithUserDetails = posts.map((post) => {
// 			let userLikedPost = false
// 			if (post.likes.includes(userId)) {
// 				userLikedPost = true
// 			}
// 			const user = userMap[post.userId]
// 			const { username } = user
// 			return { username, ...post, userLikedPost }
// 		})

// 		return {
// 			posts: postsWithUserDetails,
// 			lastPostDoc: result.docs[result.docs.length - 1],
// 		}
// 	} catch (err) {
// 		console.log(`Error in getting posts:`, err)
// 		throw err
// 	}
// }


export async function toggleLiked(docId, userId, liked) {
	try {
		const postDoc = doc(db, POST_COLLECTION_KEY, docId)
		await updateDoc(postDoc, {
			likes: liked ? arrayUnion(userId) : arrayRemove(userId),
		})
	} catch (err) {
		console.log(`Error in toggling liked:`, err)
		throw err
	}
}

export async function addComment(commentObj, docId) {
	try {
		const postDoc = doc(db, POST_COLLECTION_KEY, docId)
		await updateDoc(postDoc, {
			comments: arrayUnion(commentObj),
		})
	} catch (err) {
		console.log(`Error in adding comment:`, err)
		throw err
	}
}

export async function createPost(user, caption, imgSrc) {
	try {
		const postDoc = await addDoc(collection(db, POST_COLLECTION_KEY), {
			caption,
			imgSrc,
			userId: user.userId,
			username: user.username,
			createdAt: Date.now(),
			likes: [],
			comments: [],
		})
		return postDoc.id
	} catch (err) {
		console.log(`Error in creating post:`, err)
		throw err
	}
}