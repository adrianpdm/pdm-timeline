import Vue from "vue"
import PdmTimeline from "./PdmTimeline"
import "../../assets/styles/pdm-timeline.scss"
import "../../assets/styles/pdm-media-slider.scss"

const Components = [
	PdmTimeline
]

Components.forEach((comp)=>{
	Vue.component(comp.name, comp)
})

export default Components


