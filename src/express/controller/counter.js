const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { CRC16Modbus } = require('../../utils/crc');

const config = {
    // pnpId: 'USB\\VID_067B&PID_2303\\11111111',
    baudRate: 9600,
    dataBits: 7,
    stopBits: 1,
    parity: 'none',
    autoOpen: false,
};
const path = 'COM8';

const port = new SerialPort({ ...config, path });
const parser = new ReadlineParser();

let commandStart = [47, 63, 33, 13, 10];
let commandVerify = [6, 48, 53, 49, 13, 10];
let time = [1, 82, 49, 2, 87, 65, 84, 67, 72, 40, 41, 3, 80];

const getMeterData = (req, res) => {
    let startCommand = CRC16Modbus(commandStart);
    let verifyCommand = CRC16Modbus(commandVerify);
    let requestCommand = CRC16Modbus(time);

    port.open();
    port.once('open', () => {
        port.write(startCommand);
        port.once('data', x => {
            port.close();
            port.once('close', () => {
                port.open();
                port.once('open', () => {
                    port.write(verifyCommand);
                    port.once('data', y => {
                        port.close();
                        port.once('close', () => {
                            port.open();
                            port.once('open', () => {
                                port.write(requestCommand);
                                port.once('data', z => {
                                    console.log(z, 'z');
                                    res.json({ data: z });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = getMeterData;
