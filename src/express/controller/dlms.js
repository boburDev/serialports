const { SerialPort } = require('serialport');
const { openPort, closePort, waitForData, writeToPort } = require('../../utils/serialport_setups');
const { setConfig } = require('../../config');
const { queries } = require('../../queries');
const { TE_Couner_Query } = require('../../utils/obis_maker');

// {
//     path: 'COM3',
//     baudRate: 9600,
//     dataBits: 8, // Adjust if necessary
//     stopBits: 1, // Adjust if necessary
//     parity: 'none', // Adjust if necessary
//     autoOpen: false,
// }



// var hexString = ["7E", "A0", "0A", "00", "02", "7C", "DB", "05", "53", "C0", "74", "7E" ] // Example hex string
// // var hexString = "48656C6C6F20576F726C64"; // Example hex string
// var byteArray = hexStringToByteArray(hexString);
// console.log(Buffer.from(byteArray, 'ascii'));

const getMeterDataByDLMS = async (req, res) => {
    try {
        
        const reqData = req.body;
        const { setUp, serialPort } = setConfig(reqData);
        if (Object.values(setUp).includes(null) || Object.values(serialPort).includes(null)) {
            throw new Error('Malumot tuliq kirgizilmagan');
        }

        let adress = calculateAdress(setUp.adress)

        const getCommands = TE_Couner_Query(reqData.ReadingRegistor, setUp, 'obis')
        const startCommands = TE_Couner_Query(null, setUp)
        
        const key = Object.keys(getCommands[0])[0]
        
        let connect = hexStringToByteArray(insertArgsIntoArray(startCommands[0].version, adress, 5, 2))
        let password = hexStringToByteArray(insertArgsIntoArray(startCommands[1].password, adress, 5, 2))
        let data = hexStringToByteArray(insertArgsIntoArray(getCommands[0][key], adress, 5, 2))
        

        
        const port = new SerialPort(serialPort)
        await openPort(port)
        
        await writeToPort(connect, port);
        const connectRes = await waitForData(port);
        
        await writeToPort(password, port);
        const passwordRes = await waitForData(port);
        
        await writeToPort(data, port);
        const voltRes = await waitForData(port);

        console.log(voltRes)
        
        await closePort(port);

        res.json({ data: key })
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).json({ error: err.message });
    }
}

module.exports = getMeterDataByDLMS;



function hexStringToByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i++) {
        result.push(parseInt(hexString[i], 16));
    }
    return Buffer.from(result, 'ascii')
}

function calculateAdress(adress) {
    if (Number(adress) > 0 && Number(adress) < 255) {
        let shiftRes = adress << 1
        let newBinary = Number(shiftRes).toString(2).padStart(8, 0)
        return ['00', parseInt(newBinary.replace(/.$/,"1"), 2).toString(16)]
    } else {
        let shiftRes = adress << 1
        let newBinary = Number(shiftRes).toString(2).padStart(16, 0)
        let [firstByte, secondByte] = newBinary.replace(/.$/,"1").match(/.{1,8}/g)
        let newFirstByte = (parseInt(firstByte, 2) << 1).toString(2).padStart(8, 0)
        return parseInt((newFirstByte+secondByte), 2).toString(16).toUpperCase().match(/.{1,2}/g)
    }
}

function insertArgsIntoArray(array, args, index = 0, deleteEl = 0) {
	const newArray = [...array];
	newArray.splice(index, deleteEl, ...args);
    newArray.shift()
    let bracket = newArray.pop()
    let crc1commands = []
    for (let i = 0; i < index+3; i++) {
        crc1commands.push(newArray[i]);
    }
    let crc1 = ax25crc16(crc1commands).toUpperCase().match(/.{1,2}/g)
    newArray.splice(8, 2, ...crc1)
    newArray.splice(newArray.length-2, 2)
    let crc2 = ax25crc16(newArray).toUpperCase().match(/.{1,2}/g)
	return [bracket, ...newArray, ...crc2, bracket];
}

function ax25crc16(dataArray) {
    let crc = 0xFFFF;
    const crc16_table = [
        0x0000, 0x1081, 0x2102, 0x3183,
        0x4204, 0x5285, 0x6306, 0x7387,
        0x8408, 0x9489, 0xa50a, 0xb58b,
        0xc60c, 0xd68d, 0xe70e, 0xf78f
    ];

    for (let i = 0; i < dataArray.length; i++) {
        const hexValue = parseInt(dataArray[i], 16);
        crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (hexValue & 0xf)];
        crc = (crc >> 4) ^ crc16_table[(crc & 0xf) ^ (hexValue >> 4)];
    }

    crc = (crc << 8) | ((crc >> 8) & 0xff);
    return (~crc & 0xFFFF).toString(16);
}