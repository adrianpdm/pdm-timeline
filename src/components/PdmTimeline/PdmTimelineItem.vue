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
			<div v-if="media.length" class="pdm-tl_item-media-outer">
				<pdm-media-slider
					:data="media"
					:direction="position === 'left' ? 'rtl' : 'ltr'">
				</pdm-media-slider>
			</div>
			<span class="pdm-tl_item-description">{{description}}</span>
		</div>
	</li>
</template>

<script>
	import {DateUtils} from "./utils"
	import PdmMediaSlider from "./PdmMediaSlider"

	export default {
		components: {PdmMediaSlider},
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

			}
		},
		mounted() {

		},
		beforeDestroy() {

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

		}
	}
</script>

<style>

</style>