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

        const getCommands = TE_Couner_Query(reqData.ReadingRegistor, setUp, 'obis')
        const startCommands = TE_Couner_Query(null, setUp)
        let connect = hexStringToByteArray(startCommands[0].version)
        let password = hexStringToByteArray(startCommands[1].password)
        let volta = hexStringToByteArray(getCommands[0].currentDate)
        
        
        
        // console.log(connect);
        // console.log(password);
        // console.log(volta);
        
        const port = new SerialPort(serialPort)
        await openPort(port)
        
        await writeToPort(connect, port);
        const connectRes = await waitForData(port);
        
        await writeToPort(password, port);
        const passwordRes = await waitForData(port);
        
        await writeToPort(volta, port);
        const voltRes = await waitForData(port);

        console.log(voltRes)
        
        await closePort(port);
        res.send('123')
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