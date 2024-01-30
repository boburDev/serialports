const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const decToHex = require('../../utils/convertor.js')
const { CRC8 } = require('../../utils/crc.js')
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
    const data = [1, 80, 49, 2, 40, 55, 55, 55, 55, 55, 55, 41, 3] // psw check
    const dataVolta = [1, 82, 49, 2, 86, 79, 76, 84, 65, 40, 41, 3]  // volta value
    const dataVoltL = [1, 82, 49, 2, 86, 79, 76, 84, 76, 40, 41, 3] // voltl
    const dataFreq = [1, 82, 49, 2, 70, 82, 69, 81, 85, 40, 41, 3] // frequency
    let data3 = [...dataVolta, CRC8(dataVolta)]
    let data4 = [...dataVoltL, CRC8(dataVoltL)]
    let data5 = [...dataFreq, CRC8(dataFreq)]
    const DATA1 = Buffer.from(data1, 'ascii');
    const DATA2 = Buffer.from(data2, 'ascii');
    const DATA3 = Buffer.from(data3, 'ascii');
    const DATA4 = Buffer.from(data4, 'ascii');
    const DATA5 = Buffer.from(data5, 'ascii');

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
                                port.once('data', volta => {
                                    port.close()
                                    port.once('close', ()=>{
                                        port.open()
                                        port.once('open', () => {
                                            port.write(DATA4)
                                            port.once('data', voltl => {
                                                port.close()
                                                port.once('close', ()=>{
                                                    port.open()
                                                    port.once('open', () => {
                                                        port.write(DATA5)
                                                        port.once('data', freq => {
                                                            port.close()
                                                            console.log(volta, voltl, freq)
                                                            // let data = x.toString()
                                                            // let result = getValuesFromParentheses(data)
                                                            res.json({ data: false || 'result' })
                                                        })
                                                    })
                                                })            
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
};



module.exports = getMeterData;

function getValuesFromParentheses(param) {
    let sum = ''    
    for(let i of param) {
        if (i == '.' || !!Number(i) || i == ')') {
            if (i == ')') {
                sum += ','
            } else {
                sum += i
            }
        }
    }

    let matches = sum.split(',')
    const result = {
        Ua: matches[0] || "0",
        Ub: matches[1] || "0",
        Uc: matches[2] || "0",
    };
    return result
}