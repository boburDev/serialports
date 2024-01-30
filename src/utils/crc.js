const crc16modbus = require('crc/calculators/crc16modbus');
const {crc8} = require('crc')

// Mercury, ...
function CRC16Modbus(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16))
    let crc1 = parseInt((CRC[2]+CRC[3]), 16)
    let crc2 = parseInt((CRC[0]+CRC[1]), 16)
    return {crc1, crc2}
}

// energomera, ...
function calcCRC8(hexString) {
    const binaryString = parseInt(hexString, 16).toString(2);
    const paddedBinaryString = binaryString.padStart(hexString.length * 4, '0');
    const last7Bits = paddedBinaryString.slice(-7);
    const hexResult = parseInt(last7Bits, 2).toString(16).toUpperCase();

    return hexResult;
}


module.exports = {
    CRC16Modbus,
    calcCRC8
}