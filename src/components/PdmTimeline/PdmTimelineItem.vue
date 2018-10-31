<template>
	<li :class="['pdm-tl_item', `pos-${this.position}`]">
		<div class="pdm-tl_item-date">
			<span>{{formatItemDate(date)}}</span>
		</div>
		<span class="pdm-tl_item-divider">
			<i class="pdm-tl_item-divider-dot"></i>
		</span>
		<div class="pdm-tl_item_container">
			<span class="pdm-tl_item-title">{{title}}</span>
			<span class="pdm-tl_item-subtitle">{{subtitle}}</span>
			<div v-if="media.length"
			     class="pdm-tl_item-media-outer">
				<div class="pdm-tl_item-media-inner" :data-direction="position" ref="mediaContainer">
					<template v-for="(path, i) in sortedMedia">
						<i :key="`media-${i}`"
						   class="pdm-tl_item-media-content"
						   :data-index="i + 1"
						   :type="checkFileType(path)"
						   :style="bindMediaStyle(path)">
						</i>
					</template>
				</div>
				<transition name="fade">
					<i v-show="showMediaNavigationLeft"
					   class="pdm-tl_arrow-left"
					   @click="onClickArrowLeft">
						<img src="../../assets/images/arrow-left.svg"/>
					</i>
				</transition>
				<transition name="fade">
					<i v-show="showMediaNavigationRight"
					   class="pdm-tl_arrow-right"
					   @click="onClickArrowRight">
						<img src="../../assets/images/arrow-right.svg"/>
					</i>
				</transition>
			</div>
			<span class="pdm-tl_item-description">{{description}}</span>
		</div>
	</li>
</template>

<script>
	import {DateUtils} from "./utils"
	import {debounce} from "./utils"

	export default {
		props: {
			position: {
				type: String,
				validator: (val) => {
					return ["left", "right"].indexOf(val) !== -1
				}
			},
			date: {
				type: Date,
				required: true
			},
			title: {
				type: String,
				required: true
			},
			subtitle: String,
			description: String,
			mediaLayout: {
				type: String,
				default: "grid",
				validator: (val) => {
					return ["grid", "full"].indexOf(val) !== -1
				}
			},
			media: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				fileExtensionRegex: /(?:\.([^.]+))?$/,
				imageTypeRegex: /(png|jpe?g|gif|svg)(\?.*)?$/,
				videoTypeRegex: /(mp4|webm)(\?.*)?$/,
				audioTypeRegex: /(ogg|mp3|wav|flac|aac)(\?.*)?$/,
				showMediaNavigationLeft: false,
				showMediaNavigationRight: false,
				isShowingFirstItem: 0,
				isShowingLastItem: 0,
			}
		},
		mounted() {
			this.handleMediaNavigation()
			window.addEventListener("resize", debounce(this.handleMediaNavigation, 100))
		},
		beforeDestroy() {
			window.removeEventListener("resize", this.handleWindowResize)
		},
		computed: {
			sortedMedia() {
				if (this.position === "left") {
					return [...this.media].reverse()
				}
				return this.media
			},
		},
		methods: {
			formatItemDate(date) {
				return DateUtils.format(date, "DD MMMM YYYY")
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
			handleWindowResize() {
				this.handleMediaNavigation()
			},
			handleMediaNavigation() {
				let mediaContainer = this.$refs.mediaContainer
				// let mediaTotalWidth = [...mediaContainer.children].reduce((total, m) => {
				// 	return total + m.clientWidth
				// }, 0)

				let firstVisibleRect = mediaContainer.firstElementChild.getBoundingClientRect()
				let lastVisibleRect = mediaContainer.lastElementChild.getBoundingClientRect()
				let containerRect = mediaContainer.getBoundingClientRect()

				let [start, end] = [containerRect.left, containerRect.right]

				let firstVisibleStart = this.position === "right"
					? firstVisibleRect.left
					: firstVisibleRect.right

				let lastVisibleEnd = this.position === "right"
					? lastVisibleRect.right
					: lastVisibleRect.left

				this.isShowingFirstItem = start <= firstVisibleStart && firstVisibleStart <= end
				this.isShowingLastItem = start <= lastVisibleEnd && lastVisibleEnd <= end
				this.setEachMediaNavigationVisibility(!this.isShowingFirstItem, !this.isShowingLastItem)
			},
			setEachMediaNavigationVisibility(showLeft, showRight){
				if (this.position === "left"){
					[showLeft, showRight] = [showRight, showLeft]
				}

				this.showMediaNavigationLeft = showLeft
				this.showMediaNavigationRight = showRight
			},
			updateMediaNavigationVisibility(){

			}
		}
	}
</script>

<style>

</style>