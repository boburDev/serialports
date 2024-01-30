function sumOfDecimal(nums) {
    let data = verificationArray(nums);
    return data.reduce((acc, num) => acc + num, 0);
}

function verificationArray(data) {
    let soh = 1;
    let stx = 2;
    let etx = 3;
    if (data[0] === soh || data[0] === stx) {
        data.shift();
    }
    let x;
    for (let i in data) {
        if (data[i] === etx) {
            x = i;
        }
    }
    return data.splice(0, +x + 1);
}

module.exports = sumOfDecimal;
