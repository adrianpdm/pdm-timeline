<template>
	<div class="pdm-media-slider">
		<div class="pdm-media-slider-inner"
		     :data-direction="direction"
		     ref="mediaContainer">
			<template v-for="i in data.length">
				<i :key="`media-${i}`"
				   class="pdm-media-slider-item is-loading"
				   :data-index="i"
				   :style="{width: itemSize, height: itemSize, backgroundSize: 'cover'}">
				</i>
			</template>
		</div>
		<template v-for="position in ['start', 'end']">
			<transition name="fade">
				<span v-if="position === 'start'? showNavStart : showNavEnd"
				      :data-direction="direction"
				      :class="[`pdm-media-slider-nav_${position}`]"
				      @click="onClickMediaNav(position)">
					<i class="pdm-media-slider-nav_icon">
						<img src="../../assets/images/arrow-nav.svg"/>
					</i>
				</span>
			</transition>
		</template>
	</div>
</template>

<script>
	import {debounce} from "./utils"

	export default {
		name: "pdm-media-slider",
		props: {
			data: {
				type: Array,
				default: () => []
			},
			direction: {
				type: String,
				default: "ltr",
				validator: (val) => {
					return ["ltr", "rtl"].indexOf(val) !== -1
				}
			},
			display: {
				type: String,
				default: "tile",
				validator: (val) => {
					return ["tile", "full"].indexOf(val) !== -1
				}
			},
			itemSize: {
				type: String | Number,
				default: "8rem",
			}
		},
		data() {
			return {
				fileExtensionRegex: /(?:\.([^.]+))?$/,
				imageTypeRegex: /(png|jpe?g|gif|svg)(\?.*)?$/,
				videoTypeRegex: /(mp4|webm)(\?.*)?$/,
				audioTypeRegex: /(ogg|mp3|wav|flac|aac)(\?.*)?$/,
				firstCompletelyVisibleItemIndex: 0,
				lastCompletelyVisibleItemIndex: 0,
				mediaCache: new Map()
			}
		},
		mounted() {
			this.init()
			this.populateItems()
				.then(()=>{
					window.addEventListener("resize", debounce(this.handleSliderResize, 50))
				})
				.catch(()=>{

				})
		},
		beforeDestroy() {
			window.removeEventListener("resize", this.handleSliderResize)
		},
		computed: {
			mediaContainer() {
				return this.$refs.mediaContainer
			},
			showNavStart() {
				return this.firstCompletelyVisibleItemIndex > 0
			},
			showNavEnd() {
				return this.lastCompletelyVisibleItemIndex < (this.data.length - 1)
			}
		},
		methods: {
			init(){
				this.updateNavigationDisplay()
			},
			async populateItems() {
				this.mediaContainer.childNodes.forEach((child, index)=>{
					this.loadMedia(index)
				})
			},
			checkFileType(itemIndex) {
				let ext = this.fileExtensionRegex.exec(this.data[itemIndex])[1]
				if (this.imageTypeRegex.test(ext)) {
					return "image"
				} else if (this.videoTypeRegex.test(ext)) {
					return "video"
				} else if (this.audioTypeRegex.test(ext)) {
					return "audio"
				} else {
					throw new Error("Unsupported media type: " + ext)
				}
			},
			loadMedia(itemIndex) {
				if (this.firstCompletelyVisibleItemIndex <= itemIndex && itemIndex <= this.lastCompletelyVisibleItemIndex){
					let media = new Image()

					media.onload = (e)=>{
						console.log(media.src)
						this.getItem(itemIndex).classList.remove("is-loading")
						this.getItem(itemIndex).style.backgroundImage = `url(${media.src})`
					}

					media.onerror = (e)=>{
						this.getItem(itemIndex).classList.remove("is-loading")
						this.getItem(itemIndex).classList.add("is-error")
						console.log("Error on loading resources from " + media.src)
					}

					media.src = this.data[itemIndex]
				}
			},
			getItem(index){
				return this.mediaContainer.childNodes[index]
			},
			onClickMediaNav(direction) {

			},
			handleSliderResize() {
				this.updateNavigationDisplay()
			},
			updateNavigationDisplay() {
				this.firstCompletelyVisibleItemIndex = this.findFirstVisibleElement().index
				this.lastCompletelyVisibleItemIndex = this.findLastVisibleElement().index
			},
			findFirstVisibleElement(partial = false) {
				return this.findVisibleElement("first", partial)
			},
			findLastVisibleElement(partial = false) {
				return this.findVisibleElement("last", partial)
			},
			findVisibleElement(position, partial = false) {
				let element, elementIndex

				let [boundStart, boundEnd] = [
					this.mediaContainer.getBoundingClientRect().left,
					this.mediaContainer.getBoundingClientRect().right
				]

				let children = this.mediaContainer.childNodes
				let [index, stop, dir] = position === "first" ? [0, children.length, 1] : [children.length - 1, -1, -1]
				for (index; index !== stop; index += dir) {
					let child = children[index]
					let [childStart, childEnd] = [
						child.getBoundingClientRect().left,
						child.getBoundingClientRect().right
					]

					if (this.isElementWithinBound([childStart, childEnd], [boundStart, boundEnd], partial)) {
						element = child
						elementIndex = index
						break
					}
				}

				return {
					item: element,
					index: elementIndex
				}
			},
			isElementWithinBound([elementStart, elementEnd], [boundStart, boundEnd], partial = false) {
				let isStartWithin = boundStart <= elementStart && elementStart <= boundEnd
				let isEndWithin = boundStart <= elementEnd && elementEnd <= boundEnd
				if (partial) {
					return isStartWithin || isEndWithin
				}
				return isStartWithin && isEndWithin
			}
		}
	}
</script>

<style scoped>

</style>