<template>
	<div class="pdm-media-slider">
		<div class="pdm-media-slider-inner"
		     :data-direction="direction"
		     ref="mediaContainer">
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

	let checkFileType = function(path){
		let ext = /(?:\.([^.]+))?$/.exec(path)[1]
		let types = {
			image: /(png|jpe?g|gif|svg)(\?.*)?$/,
			video: /(mp4|webm)(\?.*)?$/,
			audio: /(ogg|mp3|wav|flac|aac)(\?.*)?$/
		}

		let result
		for(let type in types){
			if (typeof types[type]['test'] === 'function'){
				if (types[type].test(ext)){
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
			}
		},
		data() {
			return {
				firstVisibleItemIndex: 0,
				lastVisibleItemIndex: Infinity,
				mediaCache: new Map(),
				showNavStart: false,
				showNavEnd: false,
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
			mediaContainer() {
				return this.$refs.mediaContainer
			},
			mediaItems() {
				let items = this.$refs.mediaItem
				return !Array.isArray(items)
					? Array.prototype.push.apply(items)
					: items
			},
			itemSize(){
				return this.display === 'tile'
					? "8rem"
					: "100%"
			}
		},
		watch: {
			firstVisibleItemIndex(newVal, oldVal){

			},
			lastVisibleItemIndex(newVal, oldVal){

			}
		},
		methods: {
			init() {
				this.updateNavigationDisplay()
				this.populateItems()
					.then(()=>{
						window.addEventListener("resize", debounce(this.handleSliderResize, 300))
					})
					.catch(()=>{

					})
			},
			async populateItems() {
				this.mediaItems.forEach((item, index)=>{
					if (typeof item['loadMedia'] === 'function'){
						if (this.lazy){
							if (index > this.lastVisibleItemIndex  + 1){
								return
							}
						}
						item.loadMedia()
					}
				})
			},
			onClickMediaNav(where) {
				let toStart = 200,
					toEnd = -200
				if (this.direction === 'rtl'){
					[toStart, toEnd] = [toEnd, toStart]
				}

				this.mediaItems.forEach((item, index)=>{
					if (typeof item['slide'] === 'function'){
						item.slide(where === 'start' ? toStart : toEnd)
						if (!item.isLoaded){
							item.loadMedia()
						}
					}
				})

				setTimeout(()=>{
					this.updateNavigationDisplay()
				}, this.duration + 1)
			},
			handleSliderResize() {
				this.updateNavigationDisplay()
			},
			updateNavigationDisplay() {
				this.firstVisibleItemIndex = this.findFirstVisibleElement().index
				this.lastVisibleItemIndex = this.findLastVisibleElement().index

				this.showNavStart = this.firstVisibleItemIndex > 0
				this.showNavEnd = this.lastVisibleItemIndex < (this.data.length - 1)
			},
			findFirstVisibleElement(partial) {
				return this.findVisibleElement("first", partial)
			},
			findLastVisibleElement(partial) {
				return this.findVisibleElement("last", partial)
			},
			findVisibleElement(position, partial) {
				let element, elementIndex

				if (this.mediaContainer && typeof this.mediaContainer['getBoundingClientRect'] === 'function'){
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
				}

				return {
					element: element,
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