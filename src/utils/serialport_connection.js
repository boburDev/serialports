const { SerialPort } = require('serialport');
const { openPort, closePort, serialPortEngine } = require('./serialport_setups.js')
const { setConfig } = require('../config.js')
const ObisQuery = require('./obis_results')
const { getEnergomeraResult } = require('./result_convertors/energomera_result_convertor.js')
const { getMercuryResult } = require('./result_convertors/mercury_result_convertor.js');
const { dateConvertor, getDaysArray } = require('./dateUtils.js');
const { getTE_73Result } = require('./result_convertors/TE_73CAS.js');

async function getCounterResult(data) {
    try {
        const result = []
        const { setUp, tcpConnection, serialPort } = setConfig(data);
        
        const port = setUp?.connectionType === 1 ? tcpConnection : setUp?.connectionType === 0 ? new SerialPort(serialPort) : undefined
        if (!port) throw new Error('commMedia is not valid')
        let type = setUp.meterType.split('_')
        
        if (setUp.meterType.includes('CE')) {
            const getCommands = ObisQuery[`${type[0]}_Counter_Query`](data.ReadingRegister, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Counter_Query`](null, setUp)
            for(let i of getCommands) {
                startCommands.splice(3,0,i)
                await openPort(port)
                for (let j of startCommands) {
                    let { data, key } = await serialPortEngine(j, port)
                    if (data && !['hashedPassword', 'password'].includes(key)) {
                        let resValue = getEnergomeraResult(data,key)
                        if (resValue.version && !resValue.version.includes(type.join(''))) {
                            throw new Error('connection error check parameters')
                        } else if (key != 'version') {
                            result.push(resValue)
                        }
                    }
                }
                startCommands.splice(3,1)
                await closePort(port)
            }
        } else if (setUp.meterType.includes('Mercury')) {
            let getCommands = ObisQuery[`${type[0]}_Counter_Query`](data.ReadingRegister, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Counter_Query`](null, setUp)
            
            for(let i of getCommands) {
                startCommands.splice(startCommands.length,0,i)
                await openPort(port)
                for (let j of startCommands) {
                    let { data, key } = await serialPortEngine(j, port, type[0])
                    if (data && !['version', 'password'].includes(key)) {
                        let resValue = getMercuryResult(data,key)
                        // if (resValue.version && !resValue.version.includes(type.join(''))) {
                        //     throw new Error('connection error check parametres')
                        // } else if (key != 'version') {
                        result.push(resValue)
                        // }
                    }
                }
                startCommands.splice(startCommands.length,1)
                await closePort(port)
            }
        } else if (setUp.meterType.includes('TE')) {
            const getCommands = ObisQuery[`${type[0]}_Counter_Query`](data.ReadingRegister, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Counter_Query`](null, setUp)
            for(let i of getCommands) {
                startCommands.splice(startCommands.length-1,0,i)
                await openPort(port)
                for (let j of startCommands) {
                    let { data, key } = await serialPortEngine(j, port, type[0])
                    if (data && !['version', 'password'].includes(key)) {
                        console.log(key, data);
                        let resValue = getTE_73Result(data,key)
                        // console.log(resValue)
                        // if (resValue.version && !resValue.version.includes(type.join(''))) {
                        //     throw new Error('connection error check parametres')
                        // } else if (key != 'version') {
                        result.push(resValue)
                        // }
                    }
                }
                startCommands.splice(startCommands.length,1)
                await closePort(port)
            }
        } else {
            return [{data: 'this type of counter not riten yet'}]
        }
        return result
    } catch (error) {
        throw new Error(`Error in getCounterResult function: ${error.message}`)
    }
}

async function getLstCounterResult(data) {
    try {
        const result = []
        const { setUp, serialPort } = setConfig(data);
        const port = new SerialPort(serialPort)
        let type = setUp.meterType.split('_')
        
        if (setUp.meterType.includes('CE')) {
            const getCommands = ObisQuery[`${type[0]}_Counter_Query`](data.ReadingRegister, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Counter_Query`](null, setUp)
            
            const lstReq = data.ReadingRegisterTime
            let lstResult
            let lstResultIndex
            
            if (['308'].includes(type[1])) {
                const lstCommands = ObisQuery[`${type[0]}_Counter_Query`](null, setUp, 'lst')
                
                await openPort(port)
                for(let i of lstCommands) {
                    let {data,key} = await serialPortEngine(i, port)
                    if (data && !['hashedPassword', 'password'].includes(key)) {
                        let resValue = getEnergomeraResult(data,key)
                        if (resValue.version && !resValue.version.includes(type.join(''))) {
                            throw new Error('connection error check parameters')
                        } else if (key != 'version') {
                            lstResult=resValue
                        }
                        
                        
                    }
                }
                await closePort(port)
                lstResultIndex = dateConvertor(lstReq, lstResult.lst).index
                
                if (!lstResultIndex.length) { return [] }
                
                for(let i of getCommands) {
                    for(let j of lstResultIndex) {
                        let insert = {[Object.keys(i)[0]]: ObisQuery.parseValue(Object.values(i)[0],j,10)}
                        startCommands.splice(3,0,insert)
                        await openPort(port)
                        for(let k of startCommands) {
                            let {data,key} = await serialPortEngine(k, port)
                            if (data && !['hashedPassword', 'password', 'version'].includes(key)) {
                                result.push(getEnergomeraResult(data,key))
                            }
                        }
                        startCommands.splice(3,1)
                        await closePort(port)
                    }
                }
            } else if (!['308'].includes(type[1])) {
                let date = dateConvertor(lstReq,null,'YYYY-MM-DD')
                lstResultIndex = getDaysArray(new Date(date.from),new Date(date.to)).map(i => Array.from(i, c => c.charCodeAt(0)))
                for(let i of getCommands) {
                    for(let j of lstResultIndex) {
                        let insert = {[Object.keys(i)[0]]: ObisQuery.parseValue(Object.values(i)[0],j,10)}
                        startCommands.splice(3,0,insert)
                        await openPort(port)
                        for(let k of startCommands) {
                            let {data,key} = await serialPortEngine(k, port)
                            if (data && !['hashedPassword', 'password'].includes(key)) {
                                let resValue = getEnergomeraResult(data,key,String.fromCharCode(...j))
                                if (resValue.version && !resValue.version.includes(type.join(''))) {
                                    throw new Error('connection error check parameters')
                                } else if (key != 'version') {
                                    result.push(resValue)
                                }
                            }
                        }
                        startCommands.splice(3,1)
                        await closePort(port)
                    }
                }
            }
        } else {
            return [{data: 'this type of counter not written yet'}]
        }
        return result
    } catch (error) {
        throw new Error(`Error in getLstCounterResult function: ${error.message}`)
    }
}

module.exports = { getCounterResult, getLstCounterResult }