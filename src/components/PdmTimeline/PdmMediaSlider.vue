<template>
	<div class="pdm-media-slider" ref="mediaContainer">
		<div class="pdm-media-slider-inner" :data-direction="direction">
			<template v-for="(path, i) in sortedMedia">
				<i :key="`media-${i}`"
				   class="pdm-media-slider-item"
				   :data-index="i + 1"
				   :type="checkFileType(path)"
				   :style="bindMediaStyle(path)">
				</i>
			</template>
		</div>
		<transition name="fade">
			<i v-if="showNavStart"
			   class="pdm-media-slider-nav_left"
			   @click="onClickArrowLeft">
				<img class="pdm-media-slider-nav-icon"
				     src="../../assets/images/arrow-left.svg"/>
			</i>
		</transition>
		<transition name="fade">
			<i v-if="showNavEnd"
			   class="pdm-media-slider-nav_right"
			   @click="onClickArrowRight">
				<img class="pdm-media-slider-nav-icon"
				     src="../../assets/images/arrow-right.svg"/>
			</i>
		</transition>
	</div>
</template>

<script>
	import {debounce} from "./utils"

	export default {
		name: "pdm-media-slider",
		props: {
			data: {
				type: Array,
				default: ()=> []
			},
			direction: {
				type: String,
				default: 'ltr',
				validator: (val) => {
					return ['ltr', 'rtl'].indexOf(val) !== -1
				}
			},
			itemSize: {
				type: String,
				default: 'tile',
				validator: (val) => {
					return ['tile', 'full'].indexOf(val) !== -1
				}
			}
		},
		data(){
			return {
				fileExtensionRegex: /(?:\.([^.]+))?$/,
				imageTypeRegex: /(png|jpe?g|gif|svg)(\?.*)?$/,
				videoTypeRegex: /(mp4|webm)(\?.*)?$/,
				audioTypeRegex: /(ogg|mp3|wav|flac|aac)(\?.*)?$/,
				showNavStart: false,
				showNavEnd: false,
				firstVisibleItemIndex: 0,
				lastVisibleItemIndex: 0,
			}
		},
		mounted(){
			this.populateItems()
				.then(()=>{
					this.updateNavVisibility()
					window.addEventListener('resize', debounce(this.handleSliderResize, 100))
				})
				.catch(()=>{

				})
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.handleSliderResize)
		},
		computed: {
			sortedMedia() {
				if (this.direction === "rtl") {
					return [...this.data].reverse()
				}
				return this.data
			},
			mediaContainer(){
				return this.$refs.mediaContainer.getElementsByClassName('pdm-media-slider-inner')[0]
			}
		},
		methods: {
			async populateItems(){

			},
			checkFileType(filePath) {
				let ext = this.fileExtensionRegex.exec(filePath)[1]
				if (this.imageTypeRegex.test(ext)) {
					return "img"
				} else if (this.videoTypeRegex.test(ext)) {
					return "video"
				} else if (this.audioTypeRegex.test(ext)) {
					return "audio"
				} else {
					throw new Error("Unsupported media type: " + ext)
				}
			},
			bindMediaStyle(path) {
				let background = `url(${path})`
				return {
					backgroundSize: "cover"
				}
			},
			onClickArrowRight() {
				console.log("click next arrow")
			},
			onClickArrowLeft() {
				console.log("click previous arrow")
			},
			handleSliderResize() {
				this.updateNavVisibility()
			},
			updateNavVisibility() {
				let showStart = this.findFirstVisibleElement().index > 0
				let showEnd = this.findLastVisibleElement().index < ( this.data.length - 1 )

				if (this.direction === "rtl") {
					[showStart, showEnd] = [showEnd, showStart]
				}

				this.showNavStart = showStart
				this.showNavEnd = showEnd
			},
			findFirstVisibleElement(partial = false){
				return this.findVisibleElement("first", partial)
			},
			findLastVisibleElement(partial = false){
				return this.findVisibleElement("last", partial)
			},
			findVisibleElement(position, partial = false){
				let [boundStart, boundEnd] = [
					this.mediaContainer.getBoundingClientRect().left,
					this.mediaContainer.getBoundingClientRect().right
				]

				let children = this.mediaContainer.childNodes

				let element, elementIndex
				let [index, stop, dir] = position === "first" ? [0, children.length, 1] : [children.length - 1, -1, -1]
				for (index; index !== stop; index += dir){
					let child = children[index]
					let [childStart, childEnd] = [
						child.getBoundingClientRect().left,
						child.getBoundingClientRect().right
					]

					if (this.isElementWithinBound([childStart, childEnd], [boundStart, boundEnd], partial)){
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
			isElementWithinBound([elementStart, elementEnd], [boundStart, boundEnd], partial = false){
				let isStartWithin = boundStart <= elementStart && elementStart <= boundEnd
				let isEndWithin = boundStart <= elementEnd && elementEnd <= boundEnd
				if (partial){
					return isStartWithin || isEndWithin
				}
				return isStartWithin && isEndWithin
			}
		}
	}
</script>

<style scoped>

</style>