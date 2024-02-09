const crc16modbus = require('crc/calculators/crc16modbus');
const { crc8 } = require('crc');

module.exports = { queryMaker };

function queryMaker(data, crc, type) {
    if (crc == undefined) {
        return Buffer.from([...data, CRC8(data)], 'ascii')
    } else if (crc == false) {
        return Buffer.from(data, 'ascii')
    }
}

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
    const paddedBinaryString = binaryString.padStart(sumOfDecimal(params).length * 4, '0');
    const last7Bits = paddedBinaryString.slice(-7);
    return parseInt(last7Bits, 2);
}

function sumOfDecimal(nums) {
    const data = verificationArray(nums);
    return data.reduce((acc, num) => acc + num, 0);
}

function verificationArray(data) {
    const soh = 1;
    const stx = 2;
    const etx = 3;
    
    if (data[0] === soh || data[0] === stx) {
        data.shift();
    }
    
    let x;
    for (let i = 0; i < data.length; i++) {
        if (data[i] === etx) {
            x = i;
            break;
        }
    }
    
    return data.slice(0, x + 1);
}