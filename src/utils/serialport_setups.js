const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
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

module.exports = {
    openPort,
    closePort,
    writeToPort,
    waitForData
}