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
	arrayRemove,
} from 'firebase/firestore'
import { userService } from './user.service'

const db = getFirestore()

const POST_COLLECTION_KEY = 'post'

export const postService = {
	getPostsByUserId,
	getPosts,
	toggleLiked,
	createPost,
	addComment,
}

async function getPostsByUserId(userId) {
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

async function getPosts(userId, following) {
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
				const user = await userService.getUserById(post.userId)
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

async function toggleLiked(docId, userId, liked) {
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

async function addComment(commentObj, docId, userId) {
	try {
		const postDoc = doc(db, POST_COLLECTION_KEY, docId)
		const postData = (await getDoc(postDoc)).data()

		const hasCommented = postData.comments.some((comment) => comment.userId === userId)
		if (hasCommented) {
			throw new Error('User has already commented on this post.')
		}

		await updateDoc(postDoc, {
			comments: arrayUnion(commentObj),
		})
	} catch (err) {
		console.log(`Error in adding comment:`, err)
		throw err
	}
}

async function createPost(user, caption, imgSrc) {
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
