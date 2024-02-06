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
    // console.log(sumOfDecimal(params), params)
    const binaryString = sumOfDecimal(params).toString(2);
    const paddedBinaryString = binaryString.padStart(
        sumOfHex(params).length * 4,
        '0'
        );
    const last7Bits = paddedBinaryString.slice(-7);
    return parseInt(last7Bits, 2);
}

function queryMaker(data, crc, type) {
    if (crc == true) {
        return Buffer.from([...data, CRC8(data)], 'ascii')
    } else if (crc == false) {
        return Buffer.from(data, 'ascii')
    }
}

module.exports = {
    queryMaker
};
