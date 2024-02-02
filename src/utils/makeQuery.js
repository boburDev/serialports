const queries = require('../queries/energomera_query.json');

module.exports = { makeQuery };

function makeQuery(data) {
    return data.reduce((result, val) => {
        const requestData = getRequest(val);
        return [
            ...result,
            { data: requestData },
            ...makeQuery(val.children || []),
        ];
    }, []);
}

function getRequest(argument) {
    const q = queries[0];
    let dataR = {};
    let dataY = '';
    for (let i of argument.split('.')) {
        if (dataY.length > 0) {
            dataY = Object.keys(dataR)[+i];
            dataR = dataR[dataY];
        } else {
            let index = Object.keys(q)[+i];
            dataR = q[index];
            dataY = index;
        }
    }
    return dataR;
}
