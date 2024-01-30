const crc16modbus = require('crc/calculators/crc16modbus');
const {crc8} = require('crc')

const data3 = [80, 49, 2, 40, 55, 55, 55, 55, 55, 55, 41, 3]

const CRC = (crc8(new Int8Array(data3)))
console.log(CRC)


function CRC16Modbus(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16))
    let crc1 = parseInt((CRC[2]+CRC[3]), 16)
    let crc2 = parseInt((CRC[0]+CRC[1]), 16)
    return {crc1, crc2}
}

module.exports = {
    CRC16Modbus
}