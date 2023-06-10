export const utilService = {
	makeId,
	saveToStorage,
	loadFromStorage,
	removeFromStorage,
	getRndCategory,
}

export function makeId(length = 5) {
	var text = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text
}

function saveToStorage(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
	const data = localStorage.getItem(key)
	return data ? JSON.parse(data) : undefined
}

function removeFromStorage(key) {
	localStorage.removeItem(key)
}

function debounce(func, timeout = 300) {
	let timer
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			func.apply(this, args)
		}, timeout)
	}
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}

function getRndCategory() {
	const categories = [
		'Cuisine',
		'Animal',
		'Landscape',
		'Object',
		'Individual',
		'Location',
		'Symbol',
		'Vehicle',
		'Artwork',
		'Structure',
		'Gadget',
		'Sport',
		'Musical Instrument',
		'Film',
		'Outfit',
		'Historical Event',
		'Literary Work',
		'Destination',
		'Festival',
		'Scientific Concept',
		'Educational Topic',
		'Medical Condition',
		'Enterprise',
		'Show',
		'Climate',
		'Astronomical Object',
		'Mythical Creature',
		'Game',
		'Comic Character',
		'Photograph',
		'Religious Symbol',
		'Philosophical Concept',
		'Political Ideology',
		'Plant',
		'Recipe',
		'Craft',
		'Exercise',
		'Expedition',
		'Seashore',
		'Peak',
		'City',
		'Woodland',
		'Dune',
		'Rainforest',
		'Sea',
		'Lake',
		'Monument',
		'Carnival',
		'Myth',
		'Fairy Tale',
	]
	const rndCategory = categories[Math.floor(Math.random() * categories.length)]
	return rndCategory
}
