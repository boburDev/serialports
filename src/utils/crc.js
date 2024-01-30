const crc16modbus = require('crc/calculators/crc16modbus');
const { crc8 } = require('crc');
const sumOfHex = require('./sumOfHex.js');
const sumOfDecimal = require('./sumOfHex.js');
// Mercury, ...
function CRC16Modbus(params) {
    const CRC = String(crc16modbus(new Int8Array(params)).toString(16));
    let crc1 = parseInt(CRC[2] + CRC[3], 16);
    let crc2 = parseInt(CRC[0] + CRC[1], 16);
    return { crc1, crc2 };
}

// energomera, ...
function CRC8(params) {
    const binaryString = sumOfDecimal(params).toString(2);
    const paddedBinaryString = binaryString.padStart(
        sumOfHex(params).length * 4,
        '0'
    );
    const last7Bits = paddedBinaryString.slice(-7);
    return parseInt(last7Bits, 2);
}

module.exports = {
    CRC16Modbus,
    CRC8,
};
