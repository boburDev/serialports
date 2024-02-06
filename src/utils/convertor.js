function getCurrentDataValues(value, key) {
    // console.log(value)
    let reBrackets = /\((.*?)\)/g;
    let sortedData = [];
    let found;

    while ((found = reBrackets.exec(value))) {
        sortedData.push(returnValue(found[1]));
    }
    // if (value.toLowerCase().includes('err')) {
    //     let numberError = ErrorCounter(sortedData[0].split('ERR')[1])
    //         return { [key]: `Ошибка(${sortedData[0].split('ERR')[1]}): ${numberError}` } 
    //     // return { [key]: value }
    // }

    if (key == 'version') {
        return { [key]: value }
    } else if (key == 'volta') {
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
        return {
            [key]: `${today[0]} ${today[1].replace('.', '/')}`
        };
    } else if (['positiveA', 'positiveR', 'negativeA', 'negativeR'].includes(key.split('.')[0])) {
        return createResultA_R(sortedData, key)
    } else if (key == 'lst') {
        return {
            [key]: sortedData
        }
    } else {
        return getProfile(sortedData)
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

    let str = param.shift()
    let [date, ...second] = str.split(',')
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


module.exports = {
    getCurrentDataValues
};

function returnValue(value) {
    return ['', '.'].includes(value) ? '0.0' : value;
}

function fromToDate(from, to) {
    to.setMinutes(to.getMinutes() + 30);
    return {
        from: `${from.getHours()}:${from.getMinutes()}`,
        to: `${to.getHours()}:${to.getMinutes()}`
    }
}

function ErrorCounter(val) {
    switch (val) {
    case '11':
        return 'Команда не поддерживается устройством'
        break;
    case '12':
        return 'Неизвестный параметр (имя)'
        break;
    case '13':
        return 'Неправильная структура параметра'
        break;
    case '14':
        return 'Ненажата кнопка ДСТП'
        break;
    case '15':
        return 'Отказано в доступе к параметру (запись/чтение по списку)'
        break;
    case '16':
        return 'Запрещено программирование (нет перемычки)'
        break;
    case '17':
        return 'Недопустимое значение параметра'
        break;
    case '18':
        return 'Несуществующая дата/отсутствует фиксация'
        break;
    case '19':
        return 'Занят доступ для программирования (запись по другому порту)'
        break;
    case '22':
        return 'Превышен допустимый размер ответа" (групповой запрос)'
        break;
    case '30':
        return 'Проблемы с питанием (нет записи в NV-память)'
        break;
    case '31':
        return 'Проблемы аппаратные i2c'
        break;
    case '32':
        return 'Проблемы с NV-памятью (достоверность)'
        break;
    case '33':
        return 'Проблемы с NV-памятью (запись)'
        break;
    default:
        console.log(`Sorry, we are out of ${type}.`);
    }
}