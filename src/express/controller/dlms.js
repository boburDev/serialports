const { SerialPort } = require('serialport');
const {
    InterByteTimeoutParser,
} = require('@serialport/parser-inter-byte-timeout');
const crc16Modbus = require('../../utils/crcMaker');
const { calcResult, calcDateTime } = require('../../utils/result');

const serialPort = new SerialPort({
    path: 'COM10',
    baudRate: 9600,
    dataBits: 8, // Adjust if necessary
    stopBits: 1, // Adjust if necessary
    parity: 'none', // Adjust if necessary
    autoOpen: false,
});

const parser = serialPort.pipe(
    new InterByteTimeoutParser({
        interval: 100,
        maxBufferSize: 10000,
    })
);

const getMeterDataByDLMS = async (req, res) => {
    try {
        const data = req.body;
        await openPort();

        const currentTime = [
            0x7e, 0xa0, 0x1c, 0x00, 0x02, 0x7c, 0xdb, 0x05, 0x32, 0x4b, 0xeb,
            0xe6, 0xe6, 0x00, 0xc0, 0x01, 0xc1, 0x00, 0x03, 0x01, 0x00, 0x48,
            0x07, 0x00, 0xff, 0x02, 0x00, 0x6c, 0x25, 0x7e,
        ];

        // Uncomment the following lines if CRC calculation is required
        // const { crc1, crc2 } = crc16Modbus(currentTime);
        // currentTime.push(crc1, crc2);

        const getCurrentTime = Buffer.from(currentTime);
        console.log(getCurrentTime);

        await writeToPort(getCurrentTime);
        const currentTimeResponse = await waitForData();
        console.log(currentTimeResponse);
        await closePort();

        res.json({
            currentTime: currentTimeResponse,
        });
    } catch (err) {
        console.error(`Error: ${err.message}`);
        await closePort();
        res.status(500).json({ error: err.message });
    }
};

const openPort = () => {
    return new Promise((resolve, reject) => {
        serialPort.open(err => {
            if (err) {
                reject(new Error(`Failed to open port. Error: ${err.message}`));
            } else {
                resolve();
            }
        });
    });
};

const writeToPort = data => {
    return new Promise((resolve, reject) => {
        serialPort.write(data, 'ascii', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const waitForData = (timeout = 2000) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data);
        };
        parser.once('data', dataHandler);

        const timeoutId = setTimeout(() => {
            parser.removeListener('data', dataHandler);
            reject(new Error('Timeout waiting for data'));
        }, timeout);

        const clearTimer = () => {
            clearTimeout(timeoutId);
            parser.removeListener('data', dataHandler);
        };

        parser.once('data', clearTimer);
    });
};

const closePort = () => {
    return new Promise((resolve, reject) => {
        serialPort.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = getMeterDataByDLMS;
