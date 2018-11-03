<template>
	<div class="pdm-media-slider">
		<div class="pdm-media-slider-outer" :data-direction="direction" ref="mediaOuter">
			<div class="pdm-media-slider-inner" ref="mediaInner">
				<template v-for="(src, i) in data">
					<pdm-media-slider-item
							:key="`media-${i}`"
							:src="data[i]"
							:duration="duration"
							:data-index="i"
							:style="{width: itemSize, height: itemSize, backgroundSize: 'cover'}"
							ref="mediaItem"
					/>
				</template>
			</div>
		</div>
		<template v-for="position in ['start', 'end']">
			<transition name="fade">
					<span v-if="position === 'start'? showNavStart : showNavEnd"
					      :data-direction="direction"
					      :class="[`pdm-media-slider-nav_${position}`, `is-${display}`]">
						<i class="pdm-media-slider-nav_icon"
						   @click="onClickMediaNav(position)">
							<img src="../../assets/images/arrow-nav.svg"/>
						</i>
					</span>
			</transition>
		</template>
	</div>
</template>

<script>
	import {debounce} from "./utils"
	import PdmMediaSliderItem from "./PdmMediaSliderItem"

	let checkFileType = function(path) {
		let ext = /(?:\.([^.]+))?$/.exec(path)[1]
		let types = {
			image: /(png|jpe?g|gif|svg)(\?.*)?$/,
			video: /(mp4|webm)(\?.*)?$/,
			audio: /(ogg|mp3|wav|flac|aac)(\?.*)?$/
		}

		let result
		for (let type in types) {
			if (typeof types[type]["test"] === "function") {
				if (types[type].test(ext)) {
					result = type
					break
				}
			}
		}
		return result
	}

	export default {
		name: "pdm-media-slider",
		components: {PdmMediaSliderItem},
		provide: {
			checkFileType
		},
		props: {
			data: {
				type: Array,
				default: () => []
			},
			lazy: {
				type: Boolean,
				default: true
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
			duration: {
				type: Number,
				default: 500
			},
			size: {
				type: String,
				default: 'normal',
				validator: (val) => {
					return ["small", "normal", "large"].indexOf(val) !== -1
				}
			}
		},
		data() {
			return {
				distanceToStart: 0,
				distanceToEnd: 0,
				currentTranslation: 0
			}
		},
		mounted() {
			this.init()
		},
		updated() {

		},
		beforeDestroy() {
			window.removeEventListener("resize", this.handleSliderResize)
		},
		computed: {
			mediaOuter() {
				return this.$refs.mediaOuter
			},
			mediaInner() {
				return this.$refs.mediaInner
			},
			mediaItems() {
				let items = this.$refs.mediaItem
				if (!Array.isArray(items)){
					items = Array.prototype.push.apply(items)
				}
				return items
			},
			componentSizing() {
				let itemSize
				switch (this.size){
					case "small":
						break
					case "normal":
						itemSize = 120
						break
					case "huge":
						break
				}
				return {
					itemSize
				}
			},
			itemSize() {
				return this.display === "tile"
					? `${this.componentSizing.itemSize}px`
					: "100%"
			},
			showNavStart(){
				return this.direction === "rtl"
					? this.distanceToStart < 0
					: this.distanceToStart > 0
			},
			showNavEnd(){
				return this.direction === "rtl"
					? this.distanceToEnd > 0
					: this.distanceToEnd < 0
			}
		},
		watch: {},
		methods: {
			init() {
				this.calculateDistance()
				this.populateItems()
				window.addEventListener("resize", debounce(this.handleSliderResize, 300))
			},
			populateItems() {
				this.mediaItems.forEach((item) => {
					if (typeof item["loadMedia"] === "function") {
						if (this.checkIfWithinBounds(this.mediaOuter, item.$el, false)){
							item.loadMedia()
						}
					}
				})
			},
			onClickMediaNav(to) {
				let maxSlidingDistance = this.mediaOuter.getBoundingClientRect().width / 2
				let [toStart, toEnd] = [this.distanceToStart, this.distanceToEnd]

				let slidingDistance = to === "end"
					? toEnd
					: toStart

				let multiplier = Math.sign(slidingDistance)
				if (Math.abs(maxSlidingDistance) < Math.abs(slidingDistance)){
					slidingDistance = multiplier * maxSlidingDistance
				}

				this.calculateDistance(slidingDistance)
				this.currentTranslation += slidingDistance
				this.slideItem(this.currentTranslation)
			},
			async slideItem(distance){
				this.mediaInner.style.transform = `translate(${distance}px)`
				setTimeout(()=>{
					this.populateItems()
				}, 600)
			},
			handleSliderResize() {
				this.calculateDistance()
			},
			calculateDistance(curX = 0){
				let [start, end] = ["left", "right"]

				if (this.direction === "rtl"){
					[start, end] = [end, start]
				}

				let [outerStart, outerEnd] = [
					this.mediaOuter.getBoundingClientRect()[start] ,
					this.mediaOuter.getBoundingClientRect()[end]
				]

				let [innerStart, innerEnd] = [
					this.mediaInner.getBoundingClientRect()[start] + curX,
					this.mediaInner.getBoundingClientRect()[end] + curX
				]

				this.distanceToStart = outerStart - innerStart
				this.distanceToEnd = outerEnd - innerEnd
			},
			checkIfWithinBounds(container, element, partial = false){
				let isValidElement = [container, element].every((obj)=>{
					let prop = "getBoundingClientRect"
					return typeof obj[prop] === 'function'
				})

				if (!isValidElement){
					throw new Error()
				}

				let [containerStart, containerEnd] = [
					container.getBoundingClientRect().left,
					container.getBoundingClientRect().right
				]

				let [elStart, elEnd] = [
					element.getBoundingClientRect().left,
					element.getBoundingClientRect().right
				]

				let isStartWithin = containerStart <= elStart && elStart <= containerEnd
				let isEndWithin = containerStart <= elEnd && elEnd <= containerEnd
				if (partial) {
					return isStartWithin || isEndWithin
				}
				return isStartWithin && isEndWithin
			},
		}
	}
</script>

<style scoped>

</style>