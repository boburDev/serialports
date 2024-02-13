module.exports = { getTE_73Result };

function getTE_73Result(data, key) {
    try {
        const hexString = data.toString('hex');
        if (key == 'currentDate') {
            let dateBufArray = hexString
                .split(hexString.split('').slice(0, 28).join(''))[1]
                .match(/.{1,2}/g)
                .slice(0, -3);
            let year = parseInt(dateBufArray[6] + dateBufArray[7], 16);
            let month = parseInt(dateBufArray[8], 16);
            let day = parseInt(dateBufArray[9], 16);
            let hour = parseInt(dateBufArray[11], 16);
            let minute = parseInt(dateBufArray[12], 16);
            let second = parseInt(dateBufArray[13], 16);
            const result = `${day}-${month}-${year} ${hour}:${minute}:${String(
                second
            ).padStart(2, '0')}`;
            return result;
        } else if (key === 'frequency') {
            const result = hexString.slice(-10, -6);
            const frequency = parseInt(result, 16) / 100;
            return frequency;
        } else {
            let dateBufArray = hexString
                .split(hexString.split('').slice(0, 28).join(''))[1]
                .match(/.{1,2}/g)
                .slice(0, -3);
            console.log(dateBufArray);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}
