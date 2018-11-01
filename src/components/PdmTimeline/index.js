import "../../assets/styles/style.scss"

import Vue from "vue"
import PdmTimeline from "./PdmTimeline"

const Components = [
	PdmTimeline
]

Components.forEach((comp)=>{
	Vue.component(comp.name, comp)
})

export default Components


