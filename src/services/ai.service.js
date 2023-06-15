import { storageService } from './storage.service'
import { postService } from './post.service'
import { getDownloadURL, ref } from 'firebase/storage'
import { httpService } from './http.service.js'
const API_KEY = 'ai/'
// import { storage, functions } from '../lib/firebase'
// import { httpsCallable } from 'firebase/functions'

// const makeWithDallE = httpsCallable(functions, 'makeWithDallE')
// const makeWithStableDiffusion = httpsCallable(functions, 'makeWithStableDiffusion')
async function postImg(prompt) {
	try {
		const imgUrl = await httpService.post(API_KEY + 'genImg', { prompt })
		return imgUrl
	} catch (err) {
		console.error(`Error posting image: ${err}`)
		throw err
	}
}

async function createPostWithAiImg(prompt, category, loggedInUser, nickname = '') {
	const { username } = loggedInUser
	const userNick = username === 'Guest' ? `Made by: ${nickname}, ` : ''
	try {
		const refinedPrompt = `${prompt}, ${category}`
		const imgUrl = await postImg(refinedPrompt)
		const postDetails = `AI, ${userNick}With the prompt: "${prompt}". Category: ${category}.${
			nickname ? ` Made by: ${nickname}` : ''
		}`
		await postService.createPost(loggedInUser, postDetails, imgUrl)
		return imgUrl
	} catch (err) {
		console.error(`Error creating post with Dall E: ${err}`)
		throw err
	}
}

export const aiService = {
	createPostWithAiImg,
}
