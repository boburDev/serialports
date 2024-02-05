const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');

const { queryMaker, CRC8 } = require('./crc.js')
const { getCurrentDataValues } = require('./convertor.js')

const openPort = (port) => {
    return new Promise((resolve, reject) => {
        port.open(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const writeToPort = (data, port) => {
    return new Promise((resolve, reject) => {
        port.write(data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const closePort = (port) => {
    return new Promise((resolve, reject) => {
        port.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const waitForData = (port, timeout = 1600) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data);
        }
        port.pipe(
            new InterByteTimeoutParser({
                interval: 300,
                maxBufferSize: 10000
            })).once('data', dataHandler);

        const func = () => {
            port.removeListener('data', dataHandler);
            reject(new Error('Timeout waiting for data'));
        };

        const timeoutId = setTimeout(() => {
            func();
            clearTimeout(timeoutId, func());
        }, timeout);
    });
};


async function getData (data, port, crc=true) {
    try {
        let key = Object.keys(data)[0]
        let value = Object.values(data)[0]
        let dataReq = queryMaker([...value], data.crc == undefined ? true : false)
        if (key == 'closeCommand') {
            await writeToPort(dataReq,port)
        } else if (key != 'closeCommand') {
            await writeToPort(dataReq,port)
            let result = await waitForData(port)
            if (!['hashedPassword', 'password'].includes(key)) {
                return getCurrentDataValues(result.toString(), key)
            }
        }
    } catch (err) {
        await closePort()
        console.log('Error in serialport connection file', err.message)
    }
}




module.exports = {
    openPort,
    closePort,
    getData
}




function getVersionSubstring(str) {
    let check = ''
    for(let i in str) {
        if (str[i] == 2 || str[i] == 3) {
            check += `${i},`
        }
    }
    let x = check.split(',').filter(i => i)
    let result = ''
    for(let i in str) {
        if (i > +x[0] && i < +x[x.length-1]) {
            result += str[i]
        }
    }
    return result
}