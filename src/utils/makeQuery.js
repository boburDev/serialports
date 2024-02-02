const queries = require('../queries/energomera_query.json')

module.exports = { makeQuery }


function makeQuery (data, response=[]) {
	let result = [...response]
	if (data.length) {
		let val = data.shift()

		result.push({data: getRequest(val)})
		makeQuery(data, result)
	} else {
		console.log(result)
		new Promise((resolve,reject)=>{
			resolve(result)
		})
	}

}


function getRequest(argument) {
	const q = queries[0]
	let dataR = {}
	let dataY = ''
	for (let i of argument.split('.')) {
		if (dataY.length>0) {
			dataY = Object.keys(dataR)[+i]
			dataR = dataR[dataY]
		} else {
			let index = Object.keys(q)[+i]
			dataR = q[index]
			dataY = index
		}
	}
	return dataR
}
