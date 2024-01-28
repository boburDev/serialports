const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { commandMaker, sendData } = require('../../config')

let port = null
let parser = null
port = new SerialPort({path: 'COM4', baudRate: 9600,autoOpen: false});
parser = new ReadlineParser()

let startCommand = [72,0]
let reqCommand = [72,8,0]

module.exports = {
    GET: async (req, res) => {
        try {

            let startComman = commandMaker(startCommand)
            let verifyCommand = commandMaker([72,1,1,1,1,1,1,1,1])
            let commandRequest = commandMaker(reqCommand)
            
            if (true) {
                port.open()

            // CODE STARTS
                port.once('open', () => {
                    port.write(startComman)
                    port.once('data', (data) => {
                        port.close()
                        port.once('close', () => {
                            port.open()
                            port.once('open', () => {
                                port.write(verifyCommand)
                                port.once('data', () => {
                                    port.close()
                                    port.once('close', () => {
                                        port.open()
                                        port.once('open', ()=>{
                                            port.write(commandRequest)
                                            port.once('data', (data)=> {




                                            })         
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            } else {
                sendData(200, [], res)
            }
        } catch (error) {
            res.status(400).json({ error: error.message, token: null, status: 400, data: null })
        }
    }
}








// if (check) {
//     console.log(data, [...data])
//     const x = data.toString('hex').match(/.{1,2}/g)
//                                          // console.log(x)
//     let result = `${x[3]}:${x[2]}:${x[1]} - ${x[4]} - ${x[5]}/${x[6]}/${x[7]} - ${x[8]}` 
//     sendData(200, result)

// } else {
//     const mutatedData = [...data]
//     const serialNumber = String(String(mutatedData[1]) + String(mutatedData[2]) + String(mutatedData[3]) + String(mutatedData[4]))
//     const manufactureDate = 
//     new Date(String(mutatedData[6]+1) + '/' + String(mutatedData[5]) + '/' + String(mutatedData[7])).getDate() +
//     '/' +
//     new Date(String(mutatedData[6]+1) + '/' + String(mutatedData[5]) + '/' + String(mutatedData[7])).getMonth() +
//     '/' +
//     new Date(String(mutatedData[6]+1) + '/' + String(mutatedData[5]) + '/' + String(mutatedData[7])).getFullYear()
//     sendData(200, {'serial number': serialNumber, 'manufacture date': manufactureDate});
// }