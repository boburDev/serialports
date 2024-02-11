const { SerialPort } = require('serialport');
const { queryMaker } = require('./crc.js')
const { openPort, closePort, writeToPort, waitForData } = require('./serialport_setups.js')
const { setConfig } = require('../config.js')
const ObisQuery = require('./obis_maker')
const { getEnergomeraResult } = require('./energomera_result_convertor.js')
const { getMercuryResult } = require('./mercury_result_convertor.js')

module.exports = {
    getCounterResult,
    getLstCounterResult
}

async function getCounterResult(data) {
    try {
        const result = []
        const { setUp, serialPort } = setConfig(data);
        const port = new SerialPort(serialPort)
        let type = setUp.meterType.split('_')
        
        if (setUp.meterType.includes('CE')) {
            const getCommands = ObisQuery[`${type[0]}_Couner_Query`](data.ReadingRegistor, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Couner_Query`](null, setUp)
            for(let i of getCommands) {
                startCommands.splice(3,0,i)
                await openPort(port)
                for (let j of startCommands) {
                    let { data, key } = await serialPortEngine(j, port)
                    if (data && !['hashedPassword', 'password'].includes(key)) {
                        let resValue = getEnergomeraResult(data,key)
                        if (resValue.version && !resValue.version.includes(type.join(''))) {
                            throw new Error('connection error check parametres')
                        } else if (key != 'version') {
                            result.push(resValue)
                        }
                    }
                }
                startCommands.splice(3,1)
                await closePort(port)
            }
            return result
        } else if (setUp.meterType.includes('Mercury')) {
            let getCommands = ObisQuery[`${type[0]}_Couner_Query`](data.ReadingRegistor, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Couner_Query`](null, setUp)

            for(let i of getCommands) {
                startCommands.splice(startCommands.length,0,i)
                await openPort(port)
                for (let j of startCommands) {
                    let { data, key } = await serialPortEngine(j, port, type[0])
                    if (data && !['version', 'password'].includes(key)) {
                        let resValue = getMercuryResult(data,key)
                        console.log(resValue)
                        // if (resValue.version && !resValue.version.includes(type.join(''))) {
                        //     throw new Error('connection error check parametres')
                        // } else if (key != 'version') {
                        //     result.push(resValue)
                        // }
                    }
                }
                startCommands.splice(startCommands.length,1)
                await closePort(port)
            }
            // return result

            return 'counter in progress'
        } else {
            return [{data: 'this type of counter not riten yet'}]
        }
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
            const getCommands = ObisQuery[`${type[0]}_Couner_Query`](data.ReadingRegistor, setUp, 'obis')
            const startCommands = ObisQuery[`${type[0]}_Couner_Query`](null, setUp)

            const lstReq = data.ReadingRegistorTime
            let lstResult
            let lstResultIndex

            if (['308'].includes(type[1])) {
                const lstCommands = ObisQuery[`${type[0]}_Couner_Query`](null, setUp, 'lst')

                await openPort(port)
                for(let i of lstCommands) {
                    let {data,key} = await serialPortEngine(i, port)
                    if (data && !['hashedPassword', 'password'].includes(key)) {
                        let resValue = getEnergomeraResult(data,key)
                        if (resValue.version && !resValue.version.includes(type.join(''))) {
                            throw new Error('connection error check parametres')
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
                    return result
                } else if (!['308'].includes(type[1])) {
                    let date = dateConvertor(lstReq,null,'YYYY-MM-DD')
                    lstResultIndex = getDaysArray(new Date(date.from),new Date(date.to)).map(i => strToDec(i))
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
                                        throw new Error('connection error check parametres')
                                    } else if (key != 'version') {
                                        result.push(resValue)
                                    }
                                }
                            }
                            startCommands.splice(3,1)
                            await closePort(port)
                        }
                    }
                    return result
                }
            } else {
                return [{data: 'this type of counter not riten yet'}]
            }
        } catch (error) {
            throw new Error(`Error in getLstCounterResult function: ${error.message}`)
        }
    }

    async function serialPortEngine(command, port, meterType) {
        try {
            let key = Object.keys(command)[0]
            let dataReq = meterType ? queryMaker([...Object.values(command)[0]], null, meterType) : queryMaker([...Object.values(command)[0]], command.crc)
            // console.log(dataReq, key)
            if (key == 'closeCommand') {
                await writeToPort(dataReq, port)
                return {key,data:null}
            } 
            await writeToPort(dataReq, port)
            const data = await waitForData(port);
            return {key,data}
        } catch (err) {
            console.log(err)
            throw new Error('Error in serialport engine', err.message)
        }
    }

    function dateConvertor(data, compareData, format = 'MM.DD.YY') {
        const yyyy = format.includes('YYYY');
        const pad2 = (n) => n.toString().padStart(2, '0');
        const getDatePart = (dateArray, startIndex) => ({
            [yyyy ? 'YYYY' : 'YY']: yyyy ? dateArray[startIndex] : String(dateArray[startIndex]).match(/.{1,2}/g)[1],
            MM: pad2(dateArray[startIndex + 1]),
            DD: pad2(dateArray[startIndex + 2]),
            hh: pad2(0),
            mm: pad2(0),
            ss: pad2(0),
        });
        const map = getDatePart(data, 0);
        const map2 = getDatePart(data, 3);
        const formatDate = (map) => Object.entries(map).reduce((prev, [key, value]) => prev.replace(key, value), format);
        let date = {
            from: formatDate(map),
            to: formatDate(map2)
        };
        if (compareData) { 
            let sortedData = { date: [], index: [] };
            for (let i in compareData) {
                const compareDate = reverseDatePlace(compareData[i]);
                if (Date.parse(date.from) <= Date.parse(compareDate) && Date.parse(compareDate) <= Date.parse(date.to)) {
                    sortedData.index.push(i);
                    sortedData.date.push(compareData[i]);
                }
            }
            return sortedData;
        }
        return date;
    }

    function reverseDatePlace(str) {
        let [day, month, year] = str.split('.');
        return `${month}.${day}.${year}`;
    }

    function getDaysArray(start, end, format = 'DD.MM.YY') {
        const yyyy = format.includes('YYYY');
        const arr = [];
        for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            const date = new Date(dt);
            const fullYear = date.getFullYear();
            const year = yyyy ? fullYear : `${fullYear}`.match(/.{1,2}/g)[1];
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const formattedDate = format
            .replace(yyyy ? 'YYYY' : 'YY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('hh', '00')
            .replace('mm', '00')
            .replace('ss', '00');
            arr.push(formattedDate);
        }
        return arr;
    }

    function strToDec(str) {
        return Array.from(str, c => c.charCodeAt(0));
    }