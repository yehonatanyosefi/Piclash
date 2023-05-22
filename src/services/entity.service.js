import { getFirestore, collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'

const db = getFirestore()

export async function addEntity(entity) {
	try {
		const entityCol = collection(db, 'entity')
		const entityRef = await addDoc(entityCol, entity)
		console.log('Entity added with ID: ', entityRef.id)
	} catch (err) {
		console.error('Error adding entity: ', err)
		throw err
	}
}

export async function getEntityById(entityId) {
	try {
		const entityRef = doc(db, 'entity', entityId)
		const entitySnapshot = await getDoc(entityRef)
		if (entitySnapshot.exists()) {
			return entitySnapshot.data()
		} else {
			console.log('No such document!')
			return null
		}
	} catch (err) {
		console.log(`Error getting entity: `, err)
		throw err
	}
}

export async function deleteEntity(entity) {
	try {
		const entityToDelete = collection(db, 'entity', entity)
		await deleteDoc(entityToDelete)
	} catch (err) {
		console.log(`Error in getting entity from collection:`, err)
		throw err
	}
}

export async function updateEntity(entity, updatedFields) {
	try {
		const entityToUpdate = collection(db, 'entity', entity)
		await updateDoc(entityToUpdate, updatedFields) //doesn't overwrite
	} catch (err) {
		console.log(`Error in getting entity from collection:`, err)
		throw err
	}
}

export async function queryEntity() {
	try {
		const queriedEntity = await db
			.collection('entity')
			.where('field1', '==', 'value1') //example of filter
			.where('field2', '==', 'value2') //second example of filter
			.get()
		return queriedEntity
	} catch (error) {
		console.log('Error querying entity: ', error)
		throw err
	}
}