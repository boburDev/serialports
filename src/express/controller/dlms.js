const { SerialPort } = require('serialport');
const { openPort, closePort, waitForData, writeToPort } = require('../../utils/serialport_setups');
const { setConfig } = require('../../config');
const { TE_Counter_Query } = require('../../utils/obis_results');

const getMeterDataByDLMS = async (req, res) => {
    try {
        
        const reqData = req.body;
        const { setUp, serialPort } = setConfig(reqData);
        if (Object.values(setUp).includes(null) || Object.values(serialPort).includes(null)) {
            throw new Error('Malumot tuliq kirgizilmagan');
        }
        
        let address = calculateAddress(setUp.address)
        
        const getCommands = TE_Counter_Query(reqData.ReadingRegister, setUp, 'obis')
        // const startCommands = TE_Counter_Query(null, setUp)
        
        const key = Object.keys(getCommands[0])[0]
        
        // console.log(startCommands, address);
        console.log(getCommands, address, 123);
        // let connect = createNewRequestCommand(startCommands[0].version, address)
        // let password = createNewRequestCommand(startCommands[1].password, address)
        // let data = createNewRequestCommand(getCommands[0][key], address)
        
        // const port = new SerialPort(serialPort)
        // await openPort(port)
        
        // await writeToPort(connect, port);
        // const connectRes = await waitForData(port);
        
        // await writeToPort(password, port);
        // const passwordRes = await waitForData(port);
        
        // await writeToPort(data, port);
        // const voltRes = await waitForData(port);
        
        // console.log(voltRes)
        
        // await closePort(port);
        
        res.json({ data: key })
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).json({ error: err.message });
    }
}

module.exports = getMeterDataByDLMS;

function createNewRequestCommand(array, args, index = 5, deleteEl = 2) {
    const newArray = [...array];
    newArray.splice(index, deleteEl, ...args)
    
    const startCommand = newArray.shift();
    const endCommand = newArray.pop();
    
    let crc1commands = newArray.slice(0, index + 3);
    let crc1 = ax25crc16(crc1commands).toUpperCase().match(/.{1,2}/g)
    
    newArray.splice(8, 2, ...crc1);
    
    newArray.splice(newArray.length - 2, 2);
    
    let crc2 = ax25crc16(newArray).toUpperCase().match(/.{1,2}/g);
    
    return hexStringToByteArray([startCommand, ...newArray, ...crc2, endCommand])
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

function calculateAddress(address) {
    const isByte = Number(address) > 0 && Number(address) < 255;
    let shiftRes = address << 1;
    
    if (isByte) {
        let newBinary = shiftRes.toString(2).padStart(8, '0');
        return ['00', parseInt(newBinary.replace(/.$/, '1'), 2).toString(16).toUpperCase()];
    } else {
        let newBinary = shiftRes.toString(2).padStart(16, '0');
        let [firstByte, secondByte] = newBinary.replace(/.$/, '1').match(/.{1,8}/g);
        let newFirstByte = (parseInt(firstByte, 2) << 1).toString(2).padStart(8, '0');
        return parseInt(newFirstByte + secondByte, 2).toString(16).toUpperCase().match(/.{1,2}/g);
    }
}

function hexStringToByteArray(hexString) {
    const result = [];
    for (var i = 0; i < hexString.length; i++) {
        result.push(parseInt(hexString[i], 16));
    }
    return Buffer.from(result)
}