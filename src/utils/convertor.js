function getCurrentDataValues(value, key) {
    var reBrackets = /\((.*?)\)/g;
    var sortedData = [];
    var found;
    while ((found = reBrackets.exec(value))) {
        sortedData.push(returnValue(found[1]));
    }

    if (key == 'volta') {
        return {
            Ua: sortedData[0],
            Ub: sortedData[1],
            Uc: sortedData[2],
        };
    } else if (key == 'voltl') {
        return {
            Uab: sortedData[0],
            Ubc: sortedData[1],
            Uca: sortedData[2],
        };
    } else if (key == 'frequency') {
        return { frequ: sortedData[0] };
    } else if (key == 'current') {
        // console.log(value, sortedData)
        return {
            Ia: sortedData[0],
            Ib: sortedData[1],
            Ic: sortedData[2],
        };
    } else if (key == 'powp') {
        return {
            Psum: sortedData[3],
            Pa: sortedData[0],
            Pb: sortedData[1],
            Pc: sortedData[2],
        };
    } else if (key == 'powq') {
        return {
            Qsum: sortedData[3],
            Qa: sortedData[0],
            Qb: sortedData[1],
            Qc: sortedData[2],
        };
    } else if (key == 'pows') {
        return {
            Ssum: sortedData[3],
            Sa: sortedData[0],
            Sb: sortedData[1],
            Sc: sortedData[2],
        };
    } else if (key == 'coriu') {
        return {
            'COS_F(a)_angle': sortedData[0],
            'COS_F(b)_angle': sortedData[1],
            'COS_F(c)_angle': sortedData[2],
        };
    } else if (key == 'coruu') {
        return {
            a_Ua_Ub: sortedData[0],
            a_Ub_Uc: sortedData[1],
            a_Uc_Ua: sortedData[2],
        };
    } else if (key == 'cosf') {
        return {
            COS_fa: sortedData[0],
            COS_fb: sortedData[1],
            COS_fc: sortedData[2],
            COS_fsum: sortedData[3],
        };
    } else if (key == 'tanf') {
        return {
            TAN_fa: sortedData[0],
            TAN_fb: sortedData[1],
            TAN_fc: sortedData[2],
            TAN_fsum: sortedData[3],
        };
    } else if (key == 'currentDate') {
        let today = sortedData[0].split(',');
        return { today: `${today[0]} ${today[1].replace('.', '/')}` };
    } else if (key == 'version') {
        let version = value.split('/EMR5\\2')[1].split('\r\n')[0];
        return { version };
    }
}

function createResultA_R(param, key) {
    param = param.toString();
    const result = { key: {} };
    const values = getValuesFromParentheses(param);
    result[key]['date'] = values[0].split(',')[0];
    result[key]['sum'] = values[0].split(',')[1];
    if (values.length === 2) {
        result[key]['tarif'] = values[1];
    } else if (values.length === 5) {
        result[key]['tarif1'] = values[1];
        result[key]['tarif2'] = values[2];
        result[key]['tarif3'] = values[3];
        result[key]['tarif4'] = values[4];
    }

    return result;
}

function getProfile(param) {
    const result = {};
    param = param.toString();
    const values = getValuesFromParentheses(param);
    result['date'] = values[0].split(',')[0];
    result['values'] = [
        values[0].split(',')[1],
        ...values.slice(1, values.length),
    ];

    return result;
}

function getListOfDays(param) {
    param = param.toString();
    return getValuesFromParentheses(param);
}

function returnValue(value) {
    return ['', '.'].includes(value) ? '0.0' : value;
}

function getValuesFromParentheses(inputString) {
    const regex = /\(([^)]+)\)/g;
    const matches = [];

    let match;
    while ((match = regex.exec(inputString))) {
        matches.push(match[1]);
    }

    return matches;
}

module.exports = {
    getCurrentDataValues,
    createResultA_R,
    getProfile,
};
