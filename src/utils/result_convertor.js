module.exports = getValuesFromParentheses


function getValuesFromParentheses(param, key) {
	// if (key == 'time') {console.log(param)}
	// console.log(param)
		let sum = ''    
	for(let i of param) {
		if (i == 0 || (i == '.' || !!Number(i) || i == ')')) {

			if (i == ')') {
				sum += ','
			} else {
				sum += i
			}
		}
	}


	let matches = (sum.split('\r\n')).map((_,index,data) => (data[index].split(','))[0])

	let result = {}


	matches.map((_, index, data) => {

		if (key == 'volta') {
			result[`U${index == 0 ? 'a' :  index == 1 ? 'b' : 'c'}`] = returnValue(data[index])
		} else if (key == 'voltl') {
			result[`U${index == 0 ? 'ab' :  index == 1 ? 'bc' : 'ca'}`] = returnValue(data[index])
		} else if (key == 'voltl') {
			result[`U${index == 0 ? 'ab' :  index == 1 ? 'bc' : 'ca'}`] = returnValue(data[index])
		} else if (key == 'curre') {
			result[`I${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key == 'powp') {
			result[`P${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key == 'powq') {
			result[`Q${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key == 'pows') {
			result[`S${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key === 'freq' && data[index].length > 1) {
			result['value'] = data[index]
		} else if (key == 'coriu') {
			result[`COS_F(${index == 0 ? 'a' :  index == 1 ? 'b' : 'c'})_angle`] = returnValue(data[index])
		} else if (key == 'coruu') {
			result[`a_U${index == 0 ? 'a' :  index == 1 ? 'b' : 'c'}_U${index == 0 ? 'b' :  index == 1 ? 'c' : 'a'}`] = returnValue(data[index])
		} else if (key == 'cosf') {
			result[`COS_f${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key == 'tangf') {
			result[`TAN_f${index == 0 ? 'a' :  index == 1 ? 'b' : index == 2 ? 'c' : 'sum'}`] = returnValue(data[index])
		} else if (key == 'time' && data[index].length > 1){
			result['current'] = getCurrectTimeEnergomeraCounter(data[index])
		} else {
			// console.log(data)
			result[`data${index}`] = data[index]
		}
	})

	return result
}


function returnValue (value) {
	return ['', '.'].includes(value) ? '0.0' : value
}

function getCurrectTimeEnergomeraCounter(input) {
	let date = input.split('.')
	let time = date[0].match(/.{1,2}/g)
	let result = `${time[0]}:${time[1]}:${time[2]} - ${date[1]}/${date[2]}/${date[3]}`
	return result
}
