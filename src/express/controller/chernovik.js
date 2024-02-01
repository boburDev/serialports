// com port = 194409107
// Working !!!!

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const decToHex = require('../../utils/convertor.js');
const { CRC8 } = require('../../utils/crc.js');
const getData = require('../../utils/serialport_connection.js');
const {
    InterByteTimeoutParser,
} = require('@serialport/parser-inter-byte-timeout');

const port = new SerialPort({
    path: 'COM8',
    baudRate: 9600,
    dataBits: 7,
    stopBits: 1,
    parity: 'even',
    autoOpen: false,
});

const parser = port.pipe(
    new InterByteTimeoutParser({
        interval: 300,
        maxBufferSize: 10000,
    })
);

const versionReq = [47, 63, 33, 13, 10];
const hashedPassReq = [6, 48, 53, 49, 13, 10];
const checkPassReq = [1, 80, 49, 2, 40, 55, 55, 55, 55, 55, 55, 41, 3]; // psw check
const versions = [1, 82, 49, 2, 83, 67, 83, 68, 95, 40, 41, 3];
const serialNumber = [1, 82, 49, 2, 83, 78, 85, 77, 66, 40, 41, 3, 94];
const voltA = [1, 82, 49, 2, 86, 79, 76, 84, 65, 40, 41, 3]; // volta value
const voltL = [1, 82, 49, 2, 86, 79, 76, 84, 76, 40, 41, 3]; // voltl
const freq = [1, 82, 49, 2, 70, 82, 69, 81, 85, 40, 41, 3]; // frequency
const currant = [1, 82, 49, 2, 67, 85, 82, 82, 69, 40, 41, 3]; // Currant
const positiveA = [
    1, 82, 49, 2, 69, 77, 68, 48, 49, 40, 48, 46, 48, 44, 70, 41, 3,
];
const positiveATarif1 = [
    1, 82, 49, 2, 69, 77, 68, 48, 49, 40, 48, 46, 48, 44, 49, 41, 3,
];

const getVersion = Buffer.from(versionReq, 'ascii');
const getHashedPass = Buffer.from(hashedPassReq, 'ascii');
const checkPass = Buffer.from([...checkPassReq, CRC8(checkPassReq)], 'ascii');
const getVoltA = Buffer.from([...voltA, CRC8(voltA)], 'ascii');
const getVoltL = Buffer.from([...voltL, CRC8(voltL)], 'ascii');
const getFreq = Buffer.from([...freq, CRC8(freq)], 'ascii');
const getCurrant = Buffer.from([...currant, CRC8(currant)], 'ascii');
const getVersions = Buffer.from([...versions, CRC8(versions)], 'ascii');
const getSerialNumber = Buffer.from(
    [...serialNumber, CRC8(serialNumber)],
    'ascii'
);
const getPositiveA = Buffer.from([...positiveA, CRC8(positiveA)], 'ascii');
const getPositiveATarif1 = Buffer.from(
    [...positiveATarif1, CRC8(positiveATarif1)],
    'ascii'
);

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

const writeToPort = data => {
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

const getMeterData = async (req, res) => {
    try {
        await openPort();

        // Get Version
        await writeToPort(getVersion);
        const version = await waitForData();

        // Get Hashed Password
        await writeToPort(getHashedPass);
        const hashPass = await waitForData();

        // Check Password
        await writeToPort(checkPass);
        const isChecked = await waitForData();

        // await writeToPort(getVersions);
        // const versions = await waitForData();

        // await writeToPort(getSerialNumber);
        // const serialNumber = await waitForData();

        // Get Frequency Value
        // await writeToPort(getFreq);
        // const freq = await waitForData();

        await writeToPort(getPositiveATarif1);
        const currant = await waitForData();

        await writeToPort(getVoltA);
        const voltA = await waitForData();

        await writeToPort(getPositiveA);
        const positiveA = await waitForData();

        // Close the port
        await closePort();

        setTimeout(
            () =>
                res.json({
                    version,
                    hashPass,
                    isChecked,
                    currant,
                    voltA,
                    positiveA,
                }),
            600
        );
    } catch (err) {
        console.error(`Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

const waitForData = (timeout = 1600) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data.toString());
        };

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