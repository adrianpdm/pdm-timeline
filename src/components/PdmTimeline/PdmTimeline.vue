<template>
	<div :class="['pdm_tl', `is-${this.position}`]">
		<template v-for="data in groupedData">
			<div :key="`${data.group}`"
			     class="pdm-tl_group"
			     :aria-label="formatGroupName(data.group, true)"
			>
				<span class="pdm-tl_group-title">{{formatGroupName(data.group)}}</span>
				<ul class="pdm-tl_group-events"
				>
					<PdmTimelineItem
							v-for="(item, i) in data.events"
							:keys="`item-${i}`"
							:position="getItemPosition(item.date)"
							:date="item.date"
							:title="item.title"
							:subtitle="item.subtitle"
							:description="item.description"
							:media-layout="item.mediaLayout"
							:media="item.media"
					>
					</PdmTimelineItem>
				</ul>
				<div class="pdm-tl_group-end"></div>
			</div>
		</template>
	</div>
</template>

<script>
	import PdmTimelineItem from "./PdmTimelineItem"
	import {DateUtils} from "./utils"

	export default {
		name: "pdm-timeline",
		components: {PdmTimelineItem},
		props: {
			data: {
				type: Array,
				required: true,
				validator: (data) => {
					return data.length > 0
						&& data.every((obj) => {
							return obj.hasOwnProperty("date")
						})
				}
			},
			position: {
				type: String,
				default: "alternate",
				validator: (val) => {
					return ["alternate", "left", "right"].indexOf(val) !== -1
				}

			},
			groupBy: {
				type: String,
				default: "yearMonth",
				validator: (val) => {
					return ["yearMonth", "year"].indexOf(val) !== -1
				}
			}
		},
		data() {
			return {}
		},
		computed: {
			sortedData(){
				return this.data.sort((a, b) => {
					return b.date.getTime() - a.date.getTime()
				})
			},
			groupedData() {
				let result = []
				let byYearMonth = this.groupBy === "yearMonth"


				this.sortedData.forEach((obj) => {
					let year = obj.date.getFullYear()
					let month = obj.date.getMonth()
					let group = byYearMonth ? `${year}-${month}` : `${year}`
					let target = result.find((o) => {
						return o.group === group
					})

					if (!target) {
						target = {
							group,
							events: []
						}
						result.push(target)
					}

					target.events.push(obj)
				})

				return result
			},
		},
		methods: {
			formatGroupName(string, inverse) {
				let date = string.split("-")
				if (date.length === 1) {
					return string
				}
				return DateUtils.format(new Date(date[0], date[1]), inverse? "YYYY MMMM" : "MMMM YYYY")
			},
			getItemPosition(itemDate){
				let index = this.sortedData.findIndex((o)=>{
					return o.date === itemDate
				})

				return this.position === 'alternate'
					? (index + 1) % 2 === 0 ? 'right' : 'left'
					: this.position
			}
		}

	}
</script>

<style>

</style>