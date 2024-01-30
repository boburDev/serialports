const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { CRC16Modbus } = require('../../utils/crc');
const decToHex = require('../../utils/convertor.js')
const config = {
    // pnpId: 'USB\\VID_067B&PID_2303\\11111111',
    baudRate: 9600,
    dataBits: 7,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
};
const path = 'COM8';

const port = new SerialPort({ 
    path: 'COM5',
    baudRate: 9600,
    dataBits: 7,
    stopBits: 1,
    parity: 'even',
    autoOpen: false
});

const parser = new ReadlineParser();
const getMeterData = (req, res) => {
    const data = [47, 63, 33, 13, 10]
    const commandStart = Buffer.from(data, 'ascii');
    console.log(decToHex([47, 63, 33, 13, 10]))

    port.open();
    port.once('open', () => {
        port.write(commandStart);
        port.once('data', x => {
            console.log(x)
            port.close();
            res.json({data: x.toString()})
        });
    });
};

module.exports = getMeterData;
