const { queries } = require('../queries')

const CE_Counter_Commands = {
	requiredCommands: ['0.0', '0.1', '0.2', '0.3'],
	lsts: ['0.0', '0.1', '0.2', '0.4', '0.3']
}

module.exports = {
	CE_Couner_Query: readCECounterOBIS,
	parseValue: insertArgsIntoArray
}

function readCECounterOBIS(obis, options, key) {
	try {
		switch (key) {
		case 'lst':
			return commmandsCE(CE_Counter_Commands.lsts, options)
		case 'obis':
			return commmandsCE(obis, options)
		default:
			return commmandsCE(CE_Counter_Commands.requiredCommands, options)
		}
	} catch (error) {
		throw new Error(`Error in readCECounterOBIS function: ${error.message}`)
	}
}

function commmandsCE(data, options) {
	return data.map(i => {
		let result = getRequest(i, options.meterType)
		if (i === '0.0' && options.adress.length) {
			result.version = insertArgsIntoArray(result.version, options.adress, 2)
		} else if (i === '0.2') {
			result.password = insertArgsIntoArray(result.password, options.password, 5)
		}
		return result
	})
}

function getRequest(argument, type) {
	const queriesOfType = queries[type] || [];
	if (!Object.keys(queriesOfType).length) return {};

	let dataR = {};
	let dataY = '';
	let data = argument.split('.');
	let dataKey = '';

	for (let i = 0; i < data.length; i++) {
		if (dataY.length > 0) {
			dataY = Object.keys(dataR)[+data[i]];
			dataR = dataR[dataY];
			if (i >= 1) {
				dataKey += (dataKey.length ? '.' : '') + dataY;
			}
		} else {
			let index = Object.keys(queriesOfType)[+data[i]];
			dataR = queriesOfType[index];
			dataY = index;
		}
	}
	return ['hashedPassword', 'version'].includes(dataKey) ?
	{ [dataKey]: dataR, crc: false } :
	{ [dataKey]: dataR };
}

function insertArgsIntoArray(array, args, index = 0) {
	const newArg = Array.isArray(args) ? args : Array.from(args, c => c.charCodeAt(0));
	const newArray = [...array];
	const from = newArray.splice(0, index);
	return [...from, ...newArg, ...newArray];
}
