import Vue from "vue"
import PdmTimeline from "./PdmTimeline"
import "../../assets/styles/style.scss"

const Components = [
	PdmTimeline
]

Components.forEach((comp)=>{
	Vue.component(comp.name, comp)
})

export default Components


