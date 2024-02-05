const queries = require('../queries/energomera_query_CE308.json');

module.exports = { makeQuery };

function makeQuery(data, setup) {
    let dataValue = ['0.0', '0.1', '0.2', ...data, '0.3',]
    let result = []
    for(let i of dataValue) {
        let res = getRequest(i)
        if (i == '0.0' && setup.adress != '') {
            res.version = addKeyArrayToRequest(res.version, setup.adress, 2)
        } else if (i == '0.2') {
            res.password = addKeyArrayToRequest(res.password, setup.password, 2)
        }
        result.push(res)
    }
    return result
}

function getRequest(argument) {
    const q = queries[0];
    let dataR = {};
    let dataY = '';
    let data = argument.split('.');
    let dataKey = '';
    if (data.length > 2) {
        for (let i in data) {
            if (dataY.length > 0) {
                dataY = Object.keys(dataR)[+data[i]];
                dataR = dataR[dataY];
                if (i >= 1) {
                    if (dataKey.length) {
                        dataKey += `.${dataY}`;
                    } else {
                        dataKey += dataY;
                    }
                }
            } else {
                let index = Object.keys(q)[+data[i]];
                dataR = q[index];
                dataY = index;
            }
        }
    } else {
        for (let i of data) {
            if (dataY.length > 0) {
                dataY = Object.keys(dataR)[+i];
                dataR = dataR[dataY];
                dataKey = dataY;
            } else {
                let index = Object.keys(q)[+i];
                dataR = q[index];
                dataY = index;
            }
        }
    }
    if (['hashedPassword', 'version'].includes(dataKey)) {
        return { [dataKey]: dataR, crc: false };
    } else {
        return { [dataKey]: dataR };
    }
}

function addKeyArrayToRequest(replaceArray, addArg, index) {
    let newArg = addArg.split ('').map (function (c) { return c.charCodeAt (0); })
    let newArray = [...replaceArray]
    const from = newArray.splice(0, index)
    return [...from, ...newArg, ...newArray]
} 