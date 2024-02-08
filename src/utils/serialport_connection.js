const { SerialPort } = require('serialport');
const { makeQuery, addKeyArrayToRequest } = require('./makeQuery.js')
const { queryMaker } = require('./crc.js')
const { getCurrentDataValues } = require('./convertor.js')
const { setConfig } = require('../config.js')
const { openPort, closePort, writeToPort, waitForData } = require('./serialport_setups.js')

async function getData(data) {
    try {
        let port = new SerialPort(setConfig(data).SerialPort)
        let getCommands = makeQuery(data.ReadingRegistor,setConfig(data).setUp)
        let startCommands = [...makeQuery('', setConfig(data).setUp)]
        // console.log(getCommands)

        const result = []
        for(let i of getCommands) {
            startCommands.splice(3,0,i)
            await openPort(port)
            for (let j of startCommands) {
                let data = await serialPortEngine(j, port)
                if (data && !['hashedPassword', 'password', 'version'].includes(data.key)) {
                    // console.log(data.data.toString())
                    result.push(getCurrentDataValues(data.data.toString(), data.key))
                } 
                // else if (data && data.key == 'version') {
                //     for(let i of result) {
                //         if (Object.keys(i)[0] != 'version') {
                //             result.push({[data.key]:data.data.toString()})
                //         }
                //     }
                // }
            }
            startCommands.splice(3,1)
            await closePort(port)
        }
        return result
    } catch (err) {
        console.log('Error in serialport connection file', err.message)
    }
}

async function getDataLst(data, lst) {
    try {
        const config = setConfig(data)
        const port = new SerialPort(config.SerialPort)

        let result = []
        const getCommands = makeQuery(data.ReadingRegistor,setConfig(data).setUp)
        const startCommands = [...makeQuery('', setConfig(data).setUp)]

        const lstReq = data.ReadingRegistorTime
        let lstResult
        let lstResultIndex

        if (config.setUp.meterType == 'CE303') {
            let date = dateConvertor(lstReq,null,'YYYY-MM-DD')
            lstResultIndex = getDaysArray(new Date(date.from),new Date(date.to)).map(i => strToDec(i))
            for(let i of getCommands) {
                for(let j of lstResultIndex) {
                    startCommands.splice(3,0,{[Object.keys(i)[0]]: addKeyArrayToRequest(Object.values(i)[0],j,10)})
                    await openPort(port)
                    for(let k of startCommands) {
                        let data = await serialPortEngine(k, port)
                        if (data && !['hashedPassword', 'password', 'version'].includes(data.key)) {
                            result.push(getCurrentDataValues(data.data.toString(), data.key))
                        }
                    }
                    startCommands.splice(3,1)
                    await closePort(port)
                }
            }
            return result
        }

        if (config.setUp.meterType != 'CE303') {
            const lstCommands = [...makeQuery(null, setConfig(data).setUp)]

            await openPort(port)
            for(let i of lstCommands) {
                let data = await serialPortEngine(i, port)
                if (data && !['hashedPassword', 'password', 'version'].includes(data.key)) {
                    lstResult=getCurrentDataValues(data.data, data.key)
                }
            }
            await closePort(port)

            lstResultIndex = dateConvertor(lstReq, lstResult.lst).index

            for(let i of getCommands) {
                for(let j of lstResultIndex) {
                    startCommands.splice(3,0,{[Object.keys(i)[0]]: addKeyArrayToRequest(Object.values(i)[0],j,10)})
                    await openPort(port)
                    for(let k of startCommands) {
                        let data = await serialPortEngine(k, port)
                        if (data && !['hashedPassword', 'password', 'version'].includes(data.key)) {
                            result.push(getCurrentDataValues(data.data.toString(), data.key))
                        }
                    }
                    startCommands.splice(3,1)
                    await closePort(port)
                }
            }
            return result            
        }

    } catch (err) {
        console.log('Error in serialport connection file', err.message)
    }
}


async function serialPortEngine(command, port) {
    try {
        let key = Object.keys(command)[0]
        let dataReq = queryMaker([...Object.values(command)[0]], command.crc)
        
        if (key == 'closeCommand') {
            await writeToPort(dataReq, port)
            return;
        }
        await writeToPort(dataReq, port)
        const data = await waitForData(port);
        if (!['password', 'closeCommand', 'hashedPassword', 'version'].includes(key)) {
            console.log(key, dataReq)
            console.log(data.toString())
        }
        return {data, key}
    } catch (err) {
        console.log('Error in serialport connection file', err.message)
    }
}


module.exports = {
    getData,
    getDataLst
}


function dateConvertor(data, compareData, format='MM-DD-YY') {
    const yyyy = format.includes('YYYY') ? true : false
    const pad2 = (n) => n.toString().padStart(2, '0');
    let year = `${data[0]}`.match(/.{1,2}/g)[1]
    const map = {
        [yyyy ? 'YYYY' : 'YY']: yyyy ? data[0] : year,
        MM: pad2(data[1]),
        DD: pad2(data[2]),
        hh: pad2(0),
        mm: pad2(0),
        ss: pad2(0),
    };
    const map2 = {
        [yyyy ? 'YYYY' : 'YY']: yyyy ? data[3] : `${data[3]}`.match(/.{1,2}/g)[1],
        MM: pad2(data[4]),
        DD: pad2(data[5]),
        hh: pad2(0),
        mm: pad2(0),
        ss: pad2(0),
    };
    let date = {
        from: Object.entries(map).reduce((prev, entry) => prev.replace(...entry), format),
        to: Object.entries(map2).reduce((prev, entry) => prev.replace(...entry), format)
    }

    if (compareData) { 
        let sortedData = {date:[], index: []}
        for(let i in compareData) {
            if (Date.parse(date.from) <= Date.parse(reverseDatePlace(compareData[i])) && Date.parse(reverseDatePlace(compareData[i])) <= Date.parse(date.to)) {
                sortedData.index.push(i)
                sortedData.date.push(compareData[i])
            }
        }
        return sortedData
    }
    return date
}

function reverseDatePlace(str) {
    let x = str.split('.')
    return `${x[1]}.${x[0]}.${x[2]}`
}

var getDaysArray = function(start, end, format='DD.MM.YY') {
    const yyyy = format.includes('YYYY') ? true : false
    const pad2 = (n) => n.toString().padStart(2, '0');
    const arr = []
    for(let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)){

        let date = new Date(dt)
        let fullYear = date.getFullYear()
        let year = `${fullYear}`.match(/.{1,2}/g)[1]
        const map = {
            [yyyy ? 'YYYY' : 'YY']: yyyy ? fullYear : year,
            MM: date.getMonth()+1,
            DD: date.getDate(),
            hh: pad2(0),
            mm: pad2(0),
            ss: pad2(0),
        };
        arr.push(Object.entries(map).reduce((prev, entry) => prev.replace(...entry), format))
    }
    return arr;
};

function strToDec(str) {
    return str.split('').map(c => c.charCodeAt (0))
}