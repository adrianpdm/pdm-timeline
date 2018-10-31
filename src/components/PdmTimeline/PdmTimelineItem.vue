<template>
	<li :class="['pdm_timeline_item', `pos-${this.position}`]">
		<div class="pdm_timeline_item-date">
			<span>{{formatItemDate(date)}}</span>
		</div>
		<span class="pdm_timeline_item-divider">
			<i class="pdm_timeline_item-divider-dot"></i>
		</span>
		<div class="pdm_timeline_item-info">
			<span class="pdm_timeline_item-info-title">{{title}}</span>
			<span class="pdm_timeline_item-info-subtitle">{{subtitle}}</span>
			<div v-if="media.length"
			     class="pdm_timeline_item-info-media">
				<template v-if="showMediaNavigation">
					<i class="pdm_timeline-arrow-prev" @click="onMediaPrev" ref="arrowPrev">
						<img src="../../assets/images/arrow-left.svg"/>
					</i>
					<i class="pdm_timeline-arrow-next" @click="onMediaNext" ref="arrowNext">
						<img src="../../assets/images/arrow-right.svg"/>
					</i>
				</template>
				<div class="pdm_timeline_item-info-media-inner" :data-direction="position" ref="mediaContainer">
					<template v-for="(path, i) in sortedMedia">
						<i :key="`media-${i}`"
						   :type="checkFileType(path)"
						   :style="bindMediaStyle(path)"
						>
						</i>
					</template>
				</div>
			</div>
			<span class="pdm_timeline_item-info-description">{{description}}</span>
		</div>
	</li>
</template>

<script>
	import {DateUtils} from "./utils"

	export default {
		props: {
			position: {
				type: String,
				validator: (val) => {
					return ['left', 'right'].indexOf(val) !== -1
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
				showMediaNavigation: false,
			}
		},
		mounted() {
			this.handleMediaNavigation()
			window.addEventListener('resize', this.handleWindowResize)
		},
		beforeDestroy(){
			window.removeEventListener('resize', this.handleWindowResize)
		},
		computed: {
			sortedMedia(){
				if (this.position === 'left'){
					return [...this.media].reverse()
				}
				return this.media
			}
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
			bindMediaStyle(path){
				let background = `url(${path})`
				return {
					background,
					backgroundSize: 'cover'
				}
			},
			onMediaNext() {
				console.log("click next arrow")
			},
			onMediaPrev() {
				console.log("click previous arrow")
			},
			handleWindowResize() {
				this.handleMediaNavigation()
			},
			handleMediaNavigation(){
				let mediaContainer = this.$refs.mediaContainer
				let mediaTotalWidth = [...mediaContainer.children].reduce((total, m)=>{
					return total + m.clientWidth
				}, 0)

				this.showMediaNavigation = mediaContainer.clientWidth < mediaTotalWidth
			}
		}
	}
</script>

<style>

</style>