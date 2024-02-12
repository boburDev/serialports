const { getRequestCommandFromJson } = require('./toolbox')

const CE_Counter_Commands = {
	requiredCommands: ['0.0', '0.1', '0.2', '0.3'],
	lsts: ['0.0', '0.1', '0.2', '0.4', '0.3']
}

function readCECounterOBIS(obis, options, key) {
	try {
		switch (key) {
		case 'lst':
			return commandsCE(CE_Counter_Commands.lsts, options)
		case 'obis':
			return commandsCE(obis, options)
		default:
			return commandsCE(CE_Counter_Commands.requiredCommands, options)
		}
	} catch (error) {
		throw new Error(`Error in energomera_obis.js : ${error.message}`)
	}
}

function commandsCE(data, options) {
	return data.map(i => {
		let result = getRequestCommandFromJson(i, options.meterType)
		if (i === '0.0' && options.address.length) {
			result.version = insertArgsIntoArray(result.version, options.address, 2)
		} else if (i === '0.2') {
			result.password = insertArgsIntoArray(result.password, options.password, 5)
		}
		return result
	})
}

function insertArgsIntoArray(array, args, index = 0) {
	const newArg = Array.isArray(args) ? args : Array.from(args, c => c.charCodeAt(0));
	const newArray = [...array];
	const from = newArray.splice(0, index);
	return [...from, ...newArg, ...newArray];
}

module.exports = {
	readCECounterOBIS,
	insertArgsIntoArray
}