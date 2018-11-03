<template>
	<figure class="pdm-media-slider-item is-loading"
			:type="fileType"
	        ref="figure"
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
			}
		},
		mounted(){

		},
		computed: {
			fileType(){
				return this.checkFileType(this.src)
			},
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
		},
		watch: {

		}
	}
</script>

<style scoped>

</style>