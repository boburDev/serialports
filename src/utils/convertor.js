function getCurrentDataValues(value, key) {
    var reBrackets = /\((.*?)\)/g;
    var sortedData = [];
    var found;
    while ((found = reBrackets.exec(value))) {
        sortedData.push(returnValue(found[1]));
    }
    console.log(sortedData, key)

    if (key == 'volta') {
        return {
            volta: {
                Ua: sortedData[0] || '0.0',
                Ub: sortedData[1] || '0.0',
                Uc: sortedData[2] || '0.0',
            }
        }
    } else if (key == 'voltl') {
        return {
            voltl: {
                Uab: sortedData[0] || '0.0',
                Ubc: sortedData[1] || '0.0',
                Uca: sortedData[2] || '0.0',
            }
        }
    } else if (key == 'frequency') {
        return { frequ: sortedData[0] || '0.0' };
    } else if (key == 'current') {
        return {
            current: {
                Ia: sortedData[0] || '0.0',
                Ib: sortedData[1] || '0.0',
                Ic: sortedData[2] || '0.0',
            }
        };
    } else if (key == 'powp') {
        return {
            powp: {
                Psum: sortedData[3] || '0.0',
                Pa: sortedData[0] || '0.0',
                Pb: sortedData[1] || '0.0',
                Pc: sortedData[2] || '0.0',
            }
        };
    } else if (key == 'powq') {
        return {
            powq: {
                Qsum: sortedData[3] || '0.0',
                Qa: sortedData[0] || '0.0',
                Qb: sortedData[1] || '0.0',
                Qc: sortedData[2] || '0.0',
            }
        };
    } else if (key == 'pows') {
        return {
            pows: {
                Ssum: sortedData[3] || '0.0',
                Sa: sortedData[0] || '0.0',
                Sb: sortedData[1] || '0.0',
                Sc: sortedData[2] || '0.0',
            }
        };
    } else if (key == 'coriu') {
        return {
            coriu: {
                'COS_F(a)_angle': sortedData[0] || '0.0',
                'COS_F(b)_angle': sortedData[1] || '0.0',
                'COS_F(c)_angle': sortedData[2] || '0.0',
            }
        };
    } else if (key == 'coruu') {
        return {
            coruu: {
                a_Ua_Ub: sortedData[0] || '0.0',
                a_Ub_Uc: sortedData[1] || '0.0',
                a_Uc_Ua: sortedData[2] || '0.0',
            }
        };
    } else if (key == 'cosf') {
        return {
            cosf: {
                COS_fa: sortedData[0] || '0.0',
                COS_fb: sortedData[1] || '0.0',
                COS_fc: sortedData[2] || '0.0',
                COS_fsum: sortedData[3] || '0.0',
            }
        };
    } else if (key == 'tanf') {
        return {
            tanf: {
                TAN_fa: sortedData[0] || '0.0',
                TAN_fb: sortedData[1] || '0.0',
                TAN_fc: sortedData[2] || '0.0',
                TAN_fsum: sortedData[3] || '0.0',
            }
        };
    } else if (key == 'currentDate') {
        let today = sortedData[0].split(',');
        return {
            today: `${today[0]} ${today[1].replace('.', '/')}`
        };
    } else if (key == 'version') {
        return { version: value };
    } else if (['positiveA', 'positiveR', 'negativeA', 'negativeR'].includes(key.split('.')[0])) {
        return createResultA_R(value, key)
    } else {
        return getProfile(value)
    }
}

function createResultA_R(param, key) {
    const result = { [key]: {} };
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
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
    let from = new Date(currentTime);
    let to = new Date(currentTime);

    const result = {};

    let values = getValuesFromParentheses(param);
    const firstValue = values[0].split(',');
    result['date'] = firstValue[0];
    values = [
        `${firstValue[1]},${firstValue[2]}`,
        ...values.slice(1, values.length),
        ];

    result['values'] = values.map(value => {
        const [valueRes, status] = value.split(',');
        to.setMinutes(to.getMinutes() + 30);
        const response = {
            valueRes,
            status,
            from: `${from.getHours()}:${from.getMinutes()}`,
            to: `${to.getHours()}:${to.getMinutes()}`,
        };
        from = new Date(to);
        return response;
    });

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
    getCurrentDataValues
};
