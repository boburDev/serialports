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
    const data1 = [47, 63, 33, 13, 10]
    const data2 = [6, 48, 53, 49, 13, 10]
    const data3 = [1, 80, 49, 2, 40, 55, 55, 55, 55, 55, 55, 41, 3, 33]

    const DATA1 = Buffer.from(data1, 'ascii');
    const DATA2 = Buffer.from(data2, 'ascii');
    const DATA3 = Buffer.from(data3, 'ascii');
    // console.log(decToHex(data1))
    // console.log(decToHex(data2))

    port.open();
    port.once('open', () => {
        port.write(DATA1);
        port.once('data', () => {
            port.close();
            port.once('close', ()=>{
                port.open()
                port.once('open', () =>{
                    port.write(DATA2)
                    port.once('data', x => {
                        console.log(x)
                        res.json({ data: x.toString() })
                    })
                })
            })
        });
    });
};

module.exports = getMeterData;
