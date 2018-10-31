import moment from "moment"

function format(date, dateFormat){
	return moment(date).format(dateFormat)
}

const DateUtils = {
	format
}

export {DateUtils}