const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { commandMaker, getData } = require('../../config')

let port = null
let parser = null
port = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
    autoOpen: false,
    dataBits: 7,
    stopBits: 1,
    parity: "even"
});
parser = new ReadlineParser()

let commandStart = [47,63,33,13,10]
let commandVerify = [6,48,53,49,13,10]
let commandRequest = [1,80,49,2,40,55,55,55,55,55,55,41,3,33]

module.exports = {
    GET: async (req, res) => {
        try {
            let startCommand = commandMaker(commandStart)
            let verifyCommand = commandMaker(commandVerify)
            let requestCommand = commandMaker(commandRequest)

            let parametrs = [startCommand, verifyCommand, requestCommand]
            let result = getData(parametrs, port, res)

        } catch (error) {
            res.status(400).json({ error: error.message, token: null, status: 400, data: null })
        }
    }
}

