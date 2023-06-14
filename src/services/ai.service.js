import { storageService } from './storage.service'
import { postService } from './post.service'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage, functions } from '../lib/firebase'
import { httpsCallable } from 'firebase/functions'

const makeWithDallE = httpsCallable(functions, 'makeWithDallE')
// const makeWithStableDiffusion = httpsCallable(functions, 'makeWithStableDiffusion')

async function createPostWithAiImg(prompt, category, loggedInUser, nickname = '') {
	const { username } = loggedInUser
	const userNick = username === 'Guest' ? `Made by: ${nickname}, ` : ''
	try {
		const refinedPrompt = `${prompt}, ${category}`
		const imgUrl = await makeWithDallE(refinedPrompt)
		console.log(`imgUrl:`, imgUrl)
		const firebasePath = `images/${loggedInUser.userId}/${Date.now()}.png`
		await storageService.uploadImageToFirebase(imgUrl, firebasePath)
		const fileRef = ref(storage, firebasePath)
		const firebaseUrl = await getDownloadURL(fileRef)
		await postService.createPost(
			loggedInUser,
			`AI, ${userNick}With the prompt: "${prompt}". Category: ${category}.${
				nickname ? ` Made by: ${nickname}` : ''
			}}`,
			firebaseUrl
		)
		return firebaseUrl
	} catch (err) {
		console.error(`Error creating post with Dall E: ${err}`)
		throw err
	}
}

export const aiService = {
	createPostWithAiImg,
}
