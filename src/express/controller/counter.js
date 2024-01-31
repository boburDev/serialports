const decToHex = require('../../utils/convertor.js')
const { CRC8 } = require('../../utils/crc.js')
const getData = require('../../utils/serialport_connection.js')

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');


const getMeterData = (req, res) => {

    const port = new SerialPort({ 
        path: 'COM5',
        baudRate: 9600,
        dataBits: 7,
        stopBits: 1,
        parity: 'even',
        autoOpen: false
    });
    const parser = new ReadlineParser();

    const password = [1, 80, 49, 2, 40, 55, 55, 55, 55, 55, 55, 41, 3] // psw check

    const connect = [47, 63, 33, 13, 10]
    const connect_open = [6, 48, 53, 49, 13, 10]
    const dataVolta = [1, 82, 49, 2, 86, 79, 76, 84, 65, 40, 41, 3]  // volta value
    const dataVoltL = [1, 82, 49, 2, 86, 79, 76, 84, 76, 40, 41, 3] // voltl
    const curre = [1, 82, 49, 2, 67, 85, 82, 82, 69, 40, 41, 3] // curre
    const powp = [1, 82, 49, 2, 80, 79, 87, 69, 80, 40, 41, 3] // powp
    const powq = [1, 82, 49, 2, 80, 79, 87, 69, 81, 40, 41, 3] // powq
    const pows = [1, 82, 49, 2, 80, 79, 87, 69, 83, 40, 41, 3] //pows
    const freq = [1, 82, 49, 2, 70, 82, 69, 81, 85, 40, 41, 3] // frequency
    const coriu = [1, 82, 49, 2, 67, 79, 82, 73, 85, 40, 41, 3]
    const coruu = [1, 82, 49, 2, 67, 79, 82, 85, 85, 40, 41, 3]
    const cosf = [1, 82, 49, 2, 67, 79, 83, 95, 102, 40, 41, 3]
    const tangf = [1, 82, 49, 2, 84, 65, 78, 95, 102, 40, 41, 3]
    const dateTime = [1, 82, 49, 2, 87, 65, 84, 67, 72, 40, 41, 3]

    const positiveA = [1, 82, 49, 2, 69, 77, 68, 48, 49, 40, 48, 46, 48, 44, 70, 41, 3]
    const negativeA = [1, 82, 49, 2, 69, 77, 68, 48, 50, 40, 48, 46, 48, 44, 70, 41, 3]
    const positiveR = [1, 82, 49, 2, 69, 77, 68, 48, 51, 40, 48, 46, 48, 44, 70, 41, 3]
    const negativeR = [1, 82, 49, 2, 69, 77, 68, 48, 52, 40, 48, 46, 48, 44, 70, 41, 3]


    // const closePort = [1, 66, 48, 3] // frequency
    // let data6 = [...closePort, CRC8(closePort)]



    const CONNECT = Buffer.from(connect, 'ascii');
    const CONNECT_OPEN = Buffer.from(connect_open, 'ascii');
    const PASSWORD = Buffer.from(password, 'ascii');
    const VOLTA = Buffer.from([...dataVolta, CRC8(dataVolta)], 'ascii');
    const VOLTL = Buffer.from([...dataVoltL, CRC8(dataVoltL)], 'ascii');
    const CURRE = Buffer.from([...curre, CRC8(curre)], 'ascii');
    const POWP = Buffer.from([...powp, CRC8(powp)], 'ascii');
    const POWQ = Buffer.from([...powq, CRC8(powq)], 'ascii');
    const POWS = Buffer.from([...pows, CRC8(pows)], 'ascii');
    const FREQ = Buffer.from([...freq, CRC8(freq)], 'ascii');
    const CORIU = Buffer.from([...coriu, CRC8(coriu)], 'ascii');
    const CORUU = Buffer.from([...coruu, CRC8(coruu)], 'ascii');
    const COSF = Buffer.from([...cosf, CRC8(cosf)], 'ascii');
    const TANGF = Buffer.from([...tangf, CRC8(tangf)], 'ascii');
    const TIME = Buffer.from([...dateTime, CRC8(dateTime)], 'ascii');
    const POSITIVE_A = Buffer.from([...positiveA, CRC8(positiveA)], 'ascii');
    const NEGATIVE_A = Buffer.from([...negativeA, CRC8(negativeA)], 'ascii');
    const POSITIVE_R = Buffer.from([...positiveR, CRC8(positiveR)], 'ascii');
    const NEGATIVE_R = Buffer.from([...negativeR, CRC8(negativeR)], 'ascii');

    const query = [
        {connect: CONNECT },
        {connect_open: CONNECT_OPEN },
        {password: PASSWORD },
        // {volta: VOLTA },
        // {voltl: VOLTL },
        // {curre: CURRE },
        // {powp: POWP },
        // {powq: POWQ },
        // {pows: POWS },
        // {freq: FREQ },
        // {coriu: CORIU },
        // {coruu: CORUU },
        // {cosf: COSF },
        // {tangf: TANGF },
        // {time: TIME },
        {positiveA: POSITIVE_A },
        // {negativeA: NEGATIVE_A },
        // {positiveR: POSITIVE_R },
        // {negativeR: NEGATIVE_R },
        ]
    getData(query, port, res)
};



module.exports = getMeterData;