const { SerialPort } = require('serialport');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');

const { SerialPortConfig } = require('../config.js')
const { queryMaker, CRC8 } = require('./crc.js')

const { getCurrentDataValues } = require('./convertor.js')


const port = new SerialPort(SerialPortConfig);
const parser = port.pipe(
    new InterByteTimeoutParser({
        interval: 300,
        maxBufferSize: 10000
    }));

const openPort = () => {
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

const writeToPort = (data) => {
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

const closePort = () => {
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

const waitForData = (timeout = 1600) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data);
        }
        parser.once('data', dataHandler);

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


async function getData (data, crc=true) {
    try {
        let key = Object.keys(data)[0]
        let value = Object.values(data)[0]
        let dataReq = queryMaker(value, crc)
        console.log(dataReq, key)
        await writeToPort(dataReq)
        if (key != 'closeCommand') {
            let result = await waitForData()
            if (!['hashedPassword', 'password'].includes(key)) {
                if (key == 'version' || key == 'tanf') {
                    // console.log([...result], result, result.toString(), key)
                }
                return getCurrentDataValues(result.toString(), key)
            }
            return 'success'
        }
    } catch (err) {
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