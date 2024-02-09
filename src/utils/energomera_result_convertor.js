module.exports = { getEnergomeraResult }

function getEnergomeraResult(data, key, opt) {
    try {
        // if (data.toString().toLowerCase().includes('err')) {
        //     return { [key]: null };
        // }
        let value = extractorFunc(data.toString())
        switch (key) {
        case 'version':
            const versionKeys = [67, 69];
            const newVal = [...data].join().split(',13,10')[0].split(`${versionKeys},`)[1].split(',');
            versionKeys.push(...newVal.map(i => +i));
            return { [key]: Buffer.from(versionKeys).toString() };
        case 'voltA':
            return {
                [key]: {
                    Ua: value[0],
                    Ub: value[1],
                    Uc: value[2]
                }
            };
        case 'voltL':
            return {
                [key]: {
                    Uab: value[0],
                    Ubc: value[1],
                    Uca: value[2]
                }
            };
        case 'frequency':
            return { [key]: value[0] };
        case 'current':
            return {
                [key]: {
                    Ia: value[0],
                    Ib: value[1],
                    Ic: value[2]
                }
            };
        case 'powp':
        case 'powq':
        case 'pows':
            return {
                [key]: {
                    [`${key[3].toUpperCase()}a`]: value[0],
                    [`${key[3].toUpperCase()}b`]: value[1],
                    [`${key[3].toUpperCase()}c`]: value[2],
                    [`${key[3].toUpperCase()}sum`]: value[3]
                }
            };
        case 'coriu':
            return {
                [key]: {
                    'COS_F(a)_angle': value[0],
                    'COS_F(b)_angle': value[1],
                    'COS_F(c)_angle': value[2]
                }
            };

        case 'coruu':
            return {
                [key]: {
                    'a_Ua_Ub': value[0],
                    'a_Ub_Uc': value[1],
                    'a_Uc_Ua': value[2]
                }
            }
        case 'cosf':
        case 'tanf':
            return {
                [key]: {
                    [`${key === 'cosf' ? 'COS' : 'TAN'}_fa`]: value[0],
                    [`${key === 'cosf' ? 'COS' : 'TAN'}_fb`]: value[1],
                    [`${key === 'cosf' ? 'COS' : 'TAN'}_fc`]: value[2],
                    [`${key === 'cosf' ? 'COS' : 'TAN'}_fsum`]: value[3]
                }
            };
        case 'currentDate':
            const today = value[0].split(',');
            return { [key]: `${today[0]} ${today[1].replace('.', '/')}` };
        case 'lst':
            return { [key]: value }
        default:
            const ifExist = ['positiveA', 'positiveR', 'negativeA', 'negativeR']
            if (ifExist.includes(key.split('.')[0])) {
                return createResultA_R(value, key)
            } else if (key.includes('profile')) {
                return getProfile(value, opt)
            } else {
                console.log(key, value)
            }
        }
    } catch (error) {
        throw new Error(`Error in getEnergomeraResult function: ${error.message}`)
    }
}

function createResultA_R(param, key) {
    const [date, sum, ...tarifs] = param[0].split(',')
    const result = {
        [key]: {
            date,
            sum,
        }
    };
    tarifs.forEach((tarif, index) => {
        result[key][`tarif${index + 1}`] = tarif;
    });
    return result;
}

function getProfile(param, optDate) {

    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
    let from = new Date(currentTime);
    let to = new Date(currentTime);
    console.log(param)
    if (param[0].split(',').length <= 1) {

        let data = param.map(value => {
            const data = {
                value,
                ...fromToDate(from,to)
            }
            from = new Date(to);
            return data;
        })
        return {
            loagProfile: {
                date: optDate,
                counterData: data
            }
        }
    } else {

        let str = param.shift()
        let [date, ...second] = str.split(',')
        // console.log(date, optDate)
        param = [second.join(','), ...param]

        let data = param.map(value => {
            const [valueRes, status] = value.split(',');
            const data = {
                valueRes,
                status,
                ...fromToDate(from,to)
            }
            from = new Date(to);
            return data;
        })

        return {
            loagProfile: {
                date,
                counterData: data
            }
        }
    }
}

function fromToDate(from, to) {
    to.setMinutes(to.getMinutes() + 30);
    return {
        from: `${from.getHours()}:${from.getMinutes().toString().padStart(2, '0')}`,
        to: `${to.getHours()}:${to.getMinutes().toString().padStart(2, '0')}`
    };
}

function extractorFunc(value){
    let reBrackets = /\((.*?)\)/g;
    let sortedData = []
    let found;
    while ((found = reBrackets.exec(value))) {
        sortedData.push(found[1]);
    }
    return sortedData
}