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

// const Replicate = require('replicate')

// const replicate = new Replicate({
// 	auth: functions.config().replicate.token,
// })

// exports.makeWithStableDiffusion = functions.https.onCall(async (data, context) => {
// 	try {
// 		const model =
// 			'cloneofsimo/realistic_vision_v1.3:db1c4227cbc7f985e335b2f0388cd6d3aa06d95087d6a71c5b3e07413738fa13'
// 		const prompt = `best quality, ${data.prompt}, perfect, best, high quality, 8k high detail, trending, 2020, masterpiece`
// 		const negative_prompt = `nude, naked, lowres, low quality, blurry, disfigured, malformed, poorly hands, text, signature, watermark, logo, copyright, disfigured hands, duplicate`
// 		const width = '512'
// 		const height = '512'
// 		const input = {
// 			prompt,
// 			negative_prompt,
// 			width,
// 			height,
// 			num_outputs: 1,
// 			num_inference_steps: 50,
// 			guidance_scale: 4,
// 		}
// 		const response = await replicate.run(model, { input })

// 		const imgUrl = response[0]

// 		return { imgUrl }
// 	} catch (err) {
// 		console.error(`Error making with Stable Diffusion: ${err}`)
// 		throw new functions.https.HttpsError(`Error: ${err} data: ${data}`)
// 	}
// })
