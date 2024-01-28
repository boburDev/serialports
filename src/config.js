const crc16modbus = require('crc/calculators/crc16modbus');


module.exports = {
    commandMaker,
    sendData
}


function commandMaker(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16))
    let comandWithCRC = [...params, parseInt((CRC[2]+CRC[3]), 16), parseInt((CRC[0]+CRC[1]), 16)]
    return new Buffer.from(comandWithCRC, 'ascii')
}

function sendData(code, msg, res) {
    res.statusCode = code;
    res.json({ data: msg, status: code, error: null })
    port.close()
}