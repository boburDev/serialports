function sumHexArray(hexArray) {
    let data = verificationArray(hexArray)
        const sumDecimal = data.reduce((acc, hexNumber) => {
            const decimalValue = parseInt(hexNumber, 16);
            if (isNaN(decimalValue)) {
                throw new Error('Invalid hex input in the array');
            }
            return acc + decimalValue;
        }, 0);
        return sumDecimal.toString(16).toUpperCase();
}

// console.log(sumHexArray(['01', '50', '31', '02', '28', '37', '37', '37', '37', '37', '37', '29', '03']))

module.exports = sumHexArray;

function verificationArray (data) {
    let soh = '01'
    let stx = '02'
    let etx = '03'
    if (data[0] === soh || data[0] === stx) {
        data.shift()
    }
    let x
    for(let i in data) {
        if (data[i] === '03') {
            x = i
        }
    }
    return data.splice(0, +x+1)
}