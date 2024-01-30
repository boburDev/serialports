function CRC8(hexArray) {
    let data = verificationArray(hexArray);
    const sumDecimal = data.reduce((acc, hexNumber) => {
        const decimalValue = parseInt(hexNumber, 16);
        if (isNaN(decimalValue)) {
            throw new Error('Invalid hex input in the array');
        }
        return acc + decimalValue;
    }, 0);

    return calcCRC(sumDecimal.toString(16).toUpperCase());
}
let x = CRC8([
    '01',
    '50',
    '30',
    '02',
    '28',
    '31',
    '44',
    '34',
    '36',
    '30',
    '43',
    '37',
    '35',
    '29',
    '03',
]);
console.log(x);

module.exports = CRC8;

function verificationArray(data) {
    let soh = '01';
    let stx = '02';
    let etx = '03';
    if (data[0] === soh || data[0] === stx) {
        data.shift();
    }
    let x;
    for (let i in data) {
        if (data[i] === '03') {
            x = i;
        }
    }
    return data.splice(0, +x + 1);
}

function calcCRC(hexString) {
    const binaryString = parseInt(hexString, 16).toString(2);
    const paddedBinaryString = binaryString.padStart(hexString.length * 4, '0');
    const last7Bits = paddedBinaryString.slice(-7);
    const hexResult = parseInt(last7Bits, 2).toString(16).toUpperCase();

    return hexResult;
}
