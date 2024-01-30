const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const decToHex = require('../../utils/convertor.js')

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

    port.open();
    port.once('open', () => {
        port.write(DATA1);
        port.once('data', () => {
            port.close();
            port.once('close', ()=>{
                port.open()
                port.once('open', () =>{
                    port.write(DATA2)
                    port.once('data', () => {
                        port.close()
                        port.once('close', ()=>{
                            port.open()
                            port.once('open', () => {
                                port.write(DATA3)
                                port.once('data', x => {
                                    console.log(x)
                                    res.json({ data: x.toString('hex') })
                                })
                            })
                        })
                    })
                })
            })
        });
    });
};

module.exports = getMeterData;
