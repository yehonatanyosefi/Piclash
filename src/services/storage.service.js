import { httpsCallable } from 'firebase/functions'
import { functions } from '../lib/firebase'

async function uploadImageToFirebase(imageUrl, firebasePath) {
	const callable = httpsCallable(functions, 'uploadImageToFirebase')

	try {
		const result = await callable({ imageUrl, firebasePath })
		const downloadUrl = result.data
		return downloadUrl
	} catch (error) {
		console.error('Error uploading image:', error)
		throw error
	}
}

export const storageService = {
	uploadImageToFirebase,
}