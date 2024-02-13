module.exports = { getTE_73Result };

function getTE_73Result(data, key) {
    try {
        console.log(data);
        const hexString = data.toString('hex');
        let dataBufArray = hexString
            .split(hexString.split('').slice(0, 26).join(''))[1]
            .match(/.{1,2}/g)
            .slice(0, -3);
        let pad2 = n => String(n).padStart(2, '0');
        const result = dataBufArray.join('').slice(-8);
        if (key == 'currentDate') {
            let year = parseInt(dataBufArray[7] + dataBufArray[8], 16);
            let month = parseInt(dataBufArray[9], 16);
            let day = parseInt(dataBufArray[10], 16);
            let hour = parseInt(dataBufArray[12], 16);
            let minute = parseInt(dataBufArray[13], 16);
            let second = parseInt(dataBufArray[14], 16);
            const result = `${pad2(day)}-${pad2(month)}-${year} ${pad2(
                hour
            )}:${pad2(minute)}:${pad2(second)}`;
            return { [key]: result };
        } else if (key === 'frequency') {
            const frequency = parseInt(result.slice('-4'), 16) / 100;
            return { [key]: frequency };
        } else {
            console.log(data);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}
