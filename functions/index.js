/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require('firebase-functions/v2/https')
const logger = require('firebase-functions/logger')
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const fetch = require('node-fetch')
const stream = require('stream')
const util = require('util')

admin.initializeApp()

const pipeline = util.promisify(stream.pipeline)

exports.uploadImageToFirebase = functions.https.onCall(async (data, context) => {
	const imageUrl = data.imageUrl
	const firebasePath = data.firebasePath

	const response = await fetch(imageUrl)
	if (!response.ok) throw new functions.https.HttpsError('failed-precondition', 'Failed to fetch image')

	const fileRef = admin.storage().bucket().file(firebasePath)

	await pipeline(response.body, fileRef.createWriteStream())

	const config = {
		action: 'read',
		expires: '03-01-2500',
	}
	const url = await fileRef.getSignedUrl(config)

	return url[0]
})

const { Configuration, OpenAIApi } = require('openai')

const openai = new OpenAIApi(
	new Configuration({
		apiKey: functions.config().openai.key,
	})
)

exports.makeWithDallE = functions.https.onCall(async (data, context) => {
	const prompt = data.prompt

	try {
		const response = await openai.createImage({
			prompt,
			n: 1,
			size: '1024x1024',
		})

		const imgUrl = response.data.data[0].url

		return { imgUrl }
	} catch (err) {
		console.error(`Error making with Dall E: ${err}`)
		throw new functions.https.HttpsError('internal', 'An error occurred while creating image with DallE')
	}
})
