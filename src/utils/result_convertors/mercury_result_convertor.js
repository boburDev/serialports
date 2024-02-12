module.exports = { getMercuryResult }

function getMercuryResult(data, key, opt) {
    try {
        // if (data.toString().toLowerCase().includes('err')) {
        //     return { [key]: null };
        // }
        // let value = extractorFunc(data.toString())
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
            const mutatedData = data.map(item => item.toString(16).toUpperCase().slice(-4));
            const [_,second, minute, hour, week, day, month, year, timeZone] = mutatedData;
            const date = `${hour}:${minute}:${second} ${day}.${month}.${year}`;
            return {[key]:date};
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