const { Socket } = require('net');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
const { queryMaker } = require('./crc.js');

const socket = new Socket();

const openPort = (port) => {
    return new Promise((resolve, reject) => {
        if (!checkTCPConnection(port)) {
            port.open(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            socket.connect(port, () => {
                resolve();
            });
            socket.on('error', err => {
                reject(
                    new Error(
                        `Failed to connect to ${port.host}:${port.port}. Error: ${err.message}`
                    )
                );
            });
        }
    });
};

const writeToPort = (data, port) => {
    return new Promise((resolve, reject) => {
        if (!checkTCPConnection(port)) {
            port.write(data, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            socket.write(data, 'ascii', err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });
};

const closePort = (port) => {
    return new Promise((resolve, reject) => {
        if (!checkTCPConnection(port)) {
            port.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            socket.end(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }
    });
};

const waitForData = (port, timeout = 1600) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data);
        };
        if (!checkTCPConnection(port)) {
            port.pipe(
                new InterByteTimeoutParser({
                    interval: 300,
                    maxBufferSize: 10000
                })
            ).once('data', dataHandler);
            const timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                reject(new Error('Timeout waiting for data'));
            }, timeout);
        } else {
            const parser = socket.pipe(
                new InterByteTimeoutParser({ interval: 100, maxBufferSize: 10000 })
            );
            parser.once('data', dataHandler);
            const timeoutId = setTimeout(() => {
                clearTimeout(timeoutId);
                reject(new Error('Timeout waiting for data'));
            }, timeout);
        }
    });
};

async function serialPortEngine(command, port, meterType) {
    try {
        let key = Object.keys(command)[0];
        let dataReq = queryMaker([...Object.values(command)[0]], meterType, command.crc);
        if (key == 'closeCommand') {
            await writeToPort(dataReq, port);
            return { key, data: null };
        }
        await writeToPort(dataReq, port);
        const data = await waitForData(port);
        return { key, data };
    } catch (err) {
        console.log(err);
        throw new Error('Error in serialport engine', err.message);
    }
}

function checkTCPConnection(port) {
    return port.tcp || false;
}

module.exports = {
    openPort,
    closePort,
    writeToPort,
    waitForData,
    serialPortEngine
};
