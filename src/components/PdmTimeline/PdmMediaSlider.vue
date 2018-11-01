<template>
	<div class="pdm-media-slider">
		<div class="pdm-media-slider-inner" :data-direction="direction" ref="mediaContainer">
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
			<i v-if="showMediaNavigationLeft"
			   key="nav-left"
			   class="pdm-media-slider-nav_left"
			   @click="onClickArrowLeft">
				<img src="../../assets/images/arrow-left.svg"/>
			</i>
			<i v-if="showMediaNavigationRight"
			   key="nav-right"
			   class="pdm-media-slider-nav_right"
			   @click="onClickArrowRight">
				<img src="../../assets/images/arrow-right.svg"/>
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
				showMediaNavigationLeft: false,
				showMediaNavigationRight: false,
			}
		},
		mounted(){
			this.handleMediaNavigation()
			window.addEventListener('resize', debounce(this.handleMediaNavigation, 150))
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.handleMediaNavigation)
		},
		computed: {
			sortedMedia() {
				if (this.direction === "rtl") {
					return [...this.data].reverse()
				}
				return this.data
			},
		},
		methods: {
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
			handleMediaNavigation() {
				let mediaContainer = this.$refs.mediaContainer

				let firstVisibleRect = mediaContainer.firstElementChild.getBoundingClientRect()
				let lastVisibleRect = mediaContainer.lastElementChild.getBoundingClientRect()
				let containerRect = mediaContainer.getBoundingClientRect()

				let [start, end] = [containerRect.left, containerRect.right]

				let firstVisibleStart = this.direction === "ltr"
					? firstVisibleRect.left
					: firstVisibleRect.right

				let lastVisibleEnd = this.direction === "ltr"
					? lastVisibleRect.right
					: lastVisibleRect.left

				let isShowingFirstItem = start <= firstVisibleStart && firstVisibleStart <= end
				let isShowingLastItem = start <= lastVisibleEnd && lastVisibleEnd <= end
				this.setEachMediaNavigationVisibility(!isShowingFirstItem, !isShowingLastItem)
			},
			setEachMediaNavigationVisibility(showLeft, showRight) {
				if (this.direction === "rtl") {
					[showLeft, showRight] = [showRight, showLeft]
				}

				this.showMediaNavigationLeft = showLeft
				this.showMediaNavigationRight = showRight
			},
		}
	}
</script>

<style scoped>

</style>