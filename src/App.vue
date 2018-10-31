<template>
	<div id="app">
		<pdm-timeline
				:data="timelineData"
				group-by="yearMonth"
		>
		</pdm-timeline>
	</div>
</template>

<script>
	import Data from "../test/data"
	import PdmTimeline from "./components/PdmTimeline/PdmTimeline"

	export default {
		name: "app",
		components: {PdmTimeline},
		data() {
			return {
				timelineData: Data
			}
		},
		mounted() {

		}
	}
</script>

<style scoped>
	body {
		padding: 0;
		margin: 0;
	}
	#app /deep/ {
		font-family: 'Roboto', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin: 0 auto;
	}
</style>
