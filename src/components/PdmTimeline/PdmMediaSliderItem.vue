<template>
	<figure class="pdm-media-slider-item is-loading"
			:type="fileType"
	        ref="figure"
	        :style="itemStyle"
	>
	</figure>
</template>

<script>
	export default {
		name: "pdm-media-slider-item",
		inject: ['checkFileType'],
		props: {
			src: {
				type: String,
				required: true
			},
			duration: {
				type: Number,
				required: true
			}
		},
		data(){
			return {
				placeholder: "",
				asset: undefined,
				isLoaded: false,
				currentTranslation: 0,
			}
		},
		mounted(){

		},
		computed: {
			fileType(){
				return this.checkFileType(this.src)
			},
			itemStyle(){
				return {
					transition: `transform ${this.duration/1000}s`
				}
			}
		},
		methods: {
			loadMedia(){
				if (this.isLoaded){
					return
				}

				let img = new Image()

				img.addEventListener("load", (e)=>{
					this.isLoaded = true
					this.$refs.figure.appendChild(img)
				})

				img.src = this.src
			},
			slide(distance, direction){
				this.currentTranslation += distance
				this.$refs.figure.style.transform = `translateX(${this.currentTranslation}px)`
			}
		},
		watch: {

		}
	}
</script>

<style scoped>

</style>