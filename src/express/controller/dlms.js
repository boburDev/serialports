const { Socket } = require('net');
const {
    InterByteTimeoutParser,
} = require('@serialport/parser-inter-byte-timeout');
const { setConfig } = require('../../config');
const { TE_Counter_Query } = require('../../utils/obis_results');
const { getTE_73Result } = require('../../utils/result_convertors/TE_73CAS');

const host = '176.96.236.223';
const port = 10100;

const socket = new Socket();
const parser = socket.pipe(
    new InterByteTimeoutParser({
        interval: 100,
        maxBufferSize: 10000,
    })
);

const getMeterDataByDLMS = async (req, res) => {
    try {
        const reqData = req.body;
        const { setUp, serialPort } = setConfig(reqData);
        if (
            Object.values(setUp).includes(null) ||
            Object.values(serialPort).includes(null)
        ) {
            throw new Error('Malumot tuliq kirgizilmagan');
        }

        let address = calculateAddress(setUp.address);

        const getCommands = TE_Counter_Query(
            reqData.ReadingRegister,
            setUp,
            'obis'
        );
        const startCommands = TE_Counter_Query(null, setUp);

        const key = Object.keys(getCommands[0])[0];

        // console.log(startCommands, address);
        // console.log(getCommands, address, 123);
        let connect = createNewRequestCommand(
            startCommands[0].version,
            address
        );
        let password = createNewRequestCommand(
            startCommands[1].password,
            address
        );
        let data = createNewRequestCommand(getCommands[0][key], address);

        await openPort();

        await writeToPort(connect);
        const connectRes = await waitForData();

        await writeToPort(password);
        const passwordRes = await waitForData();
        console.log(data);
        await writeToPort(data);
        const resData = await waitForData();
        console.log(key, resData);
        // const response = getTE_73Result(resData, key);

        const closeCommand = [
            0x7e, 0xa0, 0x0a, 0x00, 0x02, 0x4c, 0x73, 0x05, 0x53, 0x27, 0xf1,
            0x7e,
        ];
        const getClose = Buffer.from(closeCommand);
        await writeToPort(getClose);
        await closePort();
        res.json({ data: resData });
    } catch (err) {
        const closeCommand = [
            0x7e, 0xa0, 0x0a, 0x00, 0x02, 0x4c, 0x73, 0x05, 0x53, 0x27, 0xf1,
            0x7e,
        ];
        const getClose = Buffer.from(closeCommand);
        await writeToPort(getClose);
        await closePort();
        console.error(`Error: ${err}`);
        res.status(500).json({ error: err.message });
    }
};
module.exports = getMeterDataByDLMS;

function createNewRequestCommand(array, args, index = 5, deleteEl = 2) {
    const newArray = [...array];
    newArray.splice(index, deleteEl, ...args);

    const startCommand = newArray.shift();
    const endCommand = newArray.pop();

    let crc1commands = newArray.slice(0, index + 3);
    let crc1 = ax25crc16(crc1commands)
        .toUpperCase()
        .match(/.{1,2}/g);

    newArray.splice(8, 2, ...crc1);

    newArray.splice(newArray.length - 2, 2);

    let crc2 = ax25crc16(newArray)
        .toUpperCase()
        .match(/.{1,2}/g);

    return hexStringToByteArray([
        startCommand,
        ...newArray,
        ...crc2,
        endCommand,
    ]);
}

function ax25crc16(dataArray) {
    let crc = 0xffff;
    const crc16_table = [
        0x0000, 0x1081, 0x2102, 0x3183, 0x4204, 0x5285, 0x6306, 0x7387, 0x8408,
        0x9489, 0xa50a, 0xb58b, 0xc60c, 0xd68d, 0xe70e, 0xf78f,
    ];

    for (let i = 0; i < dataArray.length; i++) {
        const hexValue = parseInt(dataArray[i], 16);
        crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (hexValue & 0xf)];
        crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (hexValue >> 4)];
    }

    crc = (crc << 8) | ((crc >> 8) & 0xff);
    return (~crc & 0xffff).toString(16);
}

function calculateAddress(address) {
    const isByte = Number(address) > 0 && Number(address) < 255;
    let shiftRes = address << 1;

    if (isByte) {
        let newBinary = shiftRes.toString(2).padStart(8, '0');
        return [
            '00',
            parseInt(newBinary.replace(/.$/, '1'), 2)
                .toString(16)
                .toUpperCase(),
        ];
    } else {
        let newBinary = shiftRes.toString(2).padStart(16, '0');
        let [firstByte, secondByte] = newBinary
            .replace(/.$/, '1')
            .match(/.{1,8}/g);
        let newFirstByte = (parseInt(firstByte, 2) << 1)
            .toString(2)
            .padStart(8, '0');
        return parseInt(newFirstByte + secondByte, 2)
            .toString(16)
            .toUpperCase()
            .match(/.{1,2}/g);
    }
}   
   
function hexStringToByteArray(hexString) {
    const result = [];
    for (var i = 0; i < hexString.length; i++) {
        result.push(parseInt(hexString[i], 16));
    }
    return Buffer.from(result);
}

const openPort = () => {
    return new Promise((resolve, reject) => {
        socket.connect({ port, host }, () => {
            resolve();
        });

        socket.on('error', err => {
            reject(
                new Error(
                    `Failed to connect to ${host}:${port}. Error: ${err.message}`
                )
            );
        });
    });
};

const writeToPort = data => {
    return new Promise((resolve, reject) => {
        socket.write(data, 'ascii', err => {
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
        socket.end(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
