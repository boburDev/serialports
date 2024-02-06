const queries_CE308 = require('../queries/energomera_query_CE308.json');
const queries_CE303 = require('../queries/energomera_query_CE303.json');
// const queries_CE102M = require('../queries/energomera_query_CE102M.json');

module.exports = { makeQuery, addKeyArrayToRequest };

function makeQuery(data, options, lstData) {
    let dataValue = []
    if (!data && data != null) {
        dataValue = ['0.0', '0.1', '0.2', '0.3']
        return collectRequest(dataValue, options)
    } else if (data == null) {
        dataValue = ['0.0', '0.1', '0.2', '0.4', '0.3']
        return collectRequest(dataValue, options)
    }  else {
        dataValue = data
        return collectRequest(dataValue, options)
    }
    return result
}

function collectRequest(data, options) {
    let result = []
    for(let i of data) {
        let res = getRequest(i, options.meterType)
        if (i == '0.0' && options.adress.length) {
            res.version = addKeyArrayToRequest(res.version, options.adress, 2)
        } else if (i == '0.2') {
            res.password = addKeyArrayToRequest(res.password, options.password, 5)
        }
        result.push(res)
    }
    return result
}

function getRequest(argument, type) {
    const q = typeIdentificator(type)
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

    return ['hashedPassword', 'version'].includes(dataKey) ?
    { [dataKey]: dataR, crc: false } :
    { [dataKey]: dataR }
}

function addKeyArrayToRequest(replaceArray, addArg, index) {
    let newArg = addArg.split ('').map(c => c.charCodeAt (0))
    let newArray = [...replaceArray]
    const from = newArray.splice(0, index)
    return [...from, ...newArg, ...newArray]
}

function typeIdentificator(type) {
    switch (type) {
    case 'CE303':
        return queries_CE303[0]
        break;
    case 'CE308':
        return queries_CE308[0]
        break;
    case 'CE102M':
        // return queries_CE102M[0]
        return queries_CE308[0]
        break;
    default:
        console.log(`Sorry, we are out of ${type}.`);
    }
}