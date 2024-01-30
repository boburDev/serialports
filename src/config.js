const crc16modbus = require('crc/calculators/crc16modbus');


module.exports = {
    commandMaker,
    sendData,
    getData
}


function commandMaker(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16))
    let comandWithCRC = [...params, parseInt((CRC[2]+CRC[3]), 16), parseInt((CRC[0]+CRC[1]), 16)]
    return new Buffer.from(comandWithCRC, 'ascii')
}

function sendData(code, msg, res, port) {
    if (res != undefined && port != undefined) {
        res.statusCode = code;
        res.json({ data: msg, status: code, error: null })
        port.close()
    } else {
        // res.statusCode = code;
        res.json({ data: msg, status: code, error: null })
    }
}

function getData (args, port, res, data=[]) {
    let result = [...data]
    try {
        port.open()
        port.once('open', () => {
            port.write(args[0])
            port.once('data', (response) => {
                port.close()
                let newArgs = args.shift()
                if (args.length !== 0) {
                    console.log(result)
                    result.push({data: response})
                    getData(args, port, res, result)
                    // setTimeout(()=>{ , 50)
                    // clearTimeout(timeOut)
                } else {
                    result.push({data: response})
                    res.json({ data: result, status: 200, error: null })
                }
                port.once('close', error => {
                    if (error) {
                        console.log("error.message")
                    // throw new Error(error.message)
                    }
                })
            })
        })
    } catch (err) {
        console.log("error.message")
    }
} 