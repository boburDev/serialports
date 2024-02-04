const queries = require('../queries/energomera_query.json');

module.exports = { makeQuery };

function makeQuery(data) {
    return data.reduce((result, val) => {
        const requestData = getRequest(val);
        return [
            ...result,
            requestData,
            ...makeQuery(val.children || []),
            ];
    }, []);
}

function getRequest(argument) {
    const q = queries[0];
    let dataR = {};
    let dataY = '';
    let data = argument.split('.')
    let dataKey = ''
    if (data.length > 2) {  
        for (let i in data) {
            if (dataY.length > 0) {
                dataY = Object.keys(dataR)[+data[i]];
                dataR = dataR[dataY];
                if (i >= 1) {
                    if (dataKey.length) {
                        dataKey += `.${dataY}`
                    } else {
                        dataKey += dataY
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
                dataKey = dataY 
            } else {
                let index = Object.keys(q)[+i];
                dataR = q[index];
                dataY = index;
            }
        }
    }
    return {[dataKey]: dataR};
}
