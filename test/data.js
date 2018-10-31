let data = (function() {
	function ItemText(date, title, subtitle = "", description = "", mediaLayout, media = []) {
		this.date = date
		this.title = title
		this.subtitle = subtitle
		this.description = description
		this.mediaLayout = mediaLayout
		this.media = media
	}

	function randomArrayElement(array, size = 1) {
		let result = []
		while (result.length < size){
			let el = array[Math.floor(Math.random() * array.length)]
			result.push(el)
		}
		return result.length > 1 ? result : result[0]
	}

	function randomDate(start, end) {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
	}

	let opts = {
		title: ["Title", "A Quite Long Title That is Comprised of Many Words", "A Medium Length Title"],
		subtitle: ["Subtitle", "Some medium length subtitle", "A subtitle shouldn't be this long since it would distract users"],
		description: [
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
			""
		],
		mediaLayout: ['grid', 'full'],
		media: [
			"http://via.placeholder.com/150.png",
			"http://via.placeholder.com/300.png",
			"http://via.placeholder.com/200.png",
			"http://via.placeholder.com/600.png"
		]
	}
	let data = []
	let i = 1
	while (i <= 20) {
		let title = randomArrayElement(opts.title)
		let subtitle = randomArrayElement(opts.subtitle)
		let description = randomArrayElement(opts.description)
		let mediaLayout = randomArrayElement(opts.mediaLayout)
		let media = [].concat(randomArrayElement(opts.media, Math.ceil(Math.random() * 6)))
		let date = randomDate(new Date(2016, 0, 1), new Date())
		data.push(new ItemText(date, title, subtitle, description, mediaLayout, media))
		i++
	}

	return data
})()

export default data