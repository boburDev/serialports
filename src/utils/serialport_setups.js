const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
const { queryMaker } = require('./crc.js')


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
            resolve(data)
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
            clearTimeout(timeoutId, func());
        }, timeout);
    });
};

async function serialPortEngine(command, port, meterType) {
        try {
            let key = Object.keys(command)[0]
            let dataReq = queryMaker([...Object.values(command)[0]], meterType, command.crc)
            // console.log(key, dataReq);
            if (key == 'closeCommand') {
                await writeToPort(dataReq, port)
                return {key,data:null}
            } 
            await writeToPort(dataReq, port)
            const data = await waitForData(port);
            return {key,data}
        } catch (err) {
            console.log(err)
            throw new Error('Error in serialport engine', err.message)
        }
    }


module.exports = {
    openPort,
    closePort,
    writeToPort,
    waitForData,
    serialPortEngine
}