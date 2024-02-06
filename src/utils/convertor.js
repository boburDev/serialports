function getCurrentDataValues(value, key) {
    let reBrackets = /\((.*?)\)/g;
    let sortedData = [];
    let found;

    while ((found = reBrackets.exec(value))) {
        sortedData.push(returnValue(found[1]));
    }

    if (key == 'volta') {
        return {
            [key]: {
                Ua: sortedData[0],
                Ub: sortedData[1],
                Uc: sortedData[2],
            }
        }
    } else if (key == 'voltl') {
        return {
            [key]: {
                Uab: sortedData[0],
                Ubc: sortedData[1],
                Uca: sortedData[2],
            }
        }
    } else if (key == 'frequency') {
        return { frequ: sortedData[0] };
    } else if (key == 'current') {
        return {
            [key]: {
                Ia: sortedData[0],
                Ib: sortedData[1],
                Ic: sortedData[2],
            }
        };
    } else if (key == 'powp') {
        return {
            [key]: {
                Psum: sortedData[3],
                Pa: sortedData[0],
                Pb: sortedData[1],
                Pc: sortedData[2],
            }
        };
    } else if (key == 'powq') {
        return {
            [key]: {
                Qsum: sortedData[3],
                Qa: sortedData[0],
                Qb: sortedData[1],
                Qc: sortedData[2],
            }
        };
    } else if (key == 'pows') {
        return {
            [key]: {
                Ssum: sortedData[3],
                Sa: sortedData[0],
                Sb: sortedData[1],
                Sc: sortedData[2],
            }
        };
    } else if (key == 'coriu') {
        return {
            [key]: {
                'COS_F(a)_angle': sortedData[0],
                'COS_F(b)_angle': sortedData[1],
                'COS_F(c)_angle': sortedData[2],
            }
        };
    } else if (key == 'coruu') {
        return {
            [key]: {
                a_Ua_Ub: sortedData[0],
                a_Ub_Uc: sortedData[1],
                a_Uc_Ua: sortedData[2],
            }
        };
    } else if (key == 'cosf') {
        return {
            [key]: {
                COS_fa: sortedData[0],
                COS_fb: sortedData[1],
                COS_fc: sortedData[2],
                COS_fsum: sortedData[3],
            }
        };
    } else if (key == 'tanf') {
        return {
            [key]: {
                TAN_fa: sortedData[0],
                TAN_fb: sortedData[1],
                TAN_fc: sortedData[2],
                TAN_fsum: sortedData[3],
            }
        };
    } else if (key == 'currentDate') {
        let today = sortedData[0].split(',');
        // console.log(today)
        return {
            [key]: `${today[0]} ${today[1].replace('.', '/')}`
        };
    } else if (key == 'version') {
        return { [key]: value };
    } else if (['positiveA', 'positiveR', 'negativeA', 'negativeR'].includes(key.split('.')[0])) {
        return createResultA_R(sortedData, key)
    } else {
        return getProfile(value)
    }
}

function createResultA_R(param, key) {
    let dateSum = param[0].split(',') 
    return {
        [key]: {
            date: dateSum[0],
            sum: dateSum[1],
            tarif1: param[1],
            tarif2: param[2],
            tarif3: param[3],
            tarif4: param[4]
        }
    }
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
