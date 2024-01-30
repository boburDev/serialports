function sumHexArray(hexArray) {
    const sumDecimal = hexArray.reduce((acc, hexNumber) => {
        const decimalValue = parseInt(hexNumber, 16);
        if (isNaN(decimalValue)) {
            throw new Error('Invalid hex input in the array');
        }
        return acc + decimalValue;
    }, 0);

    return sumDecimal.toString(16).toUpperCase();
}

module.exports = sumHexArray;
