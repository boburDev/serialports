const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { commandMaker, sendData } = require('../../config')

  // dataBits: 7,
  // stopBits: 2,
  // parity: "none",
  // lock: false,
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


// com port = 194409107

// let startCommand = [72,0]
// let verifyComm = [72,1,1,1,1,1,1,1,1]
// let reqCommand = [72,8,0]

let commandStart = [47,63,33,13,10]
let commandVerify = [7,7,7,7,7,7]
let commandRequest = [72,8,0]

module.exports = {
    GET: async (req, res) => {
        try {

            let startCommand = commandMaker(commandStart)
            let verifyCommand = commandMaker(commandVerify)
            let requestCommand = commandMaker(commandRequest)

            if (true) {
                port.open()

            // CODE STARTS
                port.once('open', () => {
                    port.write(startCommand)
                    port.once('data', (x) => {
                        port.close()
                        // console.log(data.toString('hex'), [...data])
                        port.once('close', () => {
                            port.open()
                            port.once('open', () => {
                                port.write(verifyCommand)
                                port.once('data', (y) => {
                                    port.close()
                                    port.once('close', () => {
                                        port.open()
                                        port.once('open', ()=>{
                                            port.write(requestCommand)
                                            port.once('data', (x)=> {
                                                console.log(x, 'x')
                                            })         
                                        })
                                    })
                                })
                            })
                        })
                    })
                })





                // recursion function base

                // port.once('open', () => {
                //     port.write(startComman)
                //     port.once('data', () => {
                //         port.close()
                //         port.once('close', () => {
                //             port.open()
                //         })
                //     })
                // })



                function getData () {

                }











            } else {
                sendData(200, [], res)
            }
        } catch (error) {
            console.log(error)
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