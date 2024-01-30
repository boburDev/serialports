const crc16modbus = require('crc/calculators/crc16modbus');


function CRC16Modbus(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16))
    let crc1 = parseInt((CRC[2]+CRC[3]), 16)
    let crc2 = parseInt((CRC[0]+CRC[1]), 16)
    return {crc1, crc2}
}




module.exports = {
    CRC16Modbus
}