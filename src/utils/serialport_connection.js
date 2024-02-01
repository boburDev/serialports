const getValuesFromParentheses = require('./result_convertor.js')
const {CRC8} = require('./crc.js')
const decimalToHex = require('./convertor.js')
function getData (args, port, res, data=[]) {
    try {
        let result = [...data]
        let arg = Object.values(args[0])[0]
        let key = Object.keys(args[0])[0]

        port.open()
        port.once('open', () => {
            port.write(arg)
            port.once('data', (response) => {
                console.log(response.toString());
                port.close()
                console.log(port.read(response.length), response.length)
                let resultDec = [...response]
                // console.log(decimalToHex(resultDec), decimalToHex([...arg]))
                // console.log([...arg], resultDec, '1111111111')
                let crc = resultDec.pop()
                // console.log(resultDec, CRC8(resultDec), crc, '22222222\n\n\n\n\n\n\n\n\n\n\n')
                let newArgs = args.shift()
                if (args.length !== 0) {
                    if (!['connect', 'connect_open', 'password'].includes(key)) {
                        result.push({ [key]: response.toString()})
                        // result.push({ [key]: getValuesFromParentheses(response.toString(), key)})
                    }
                    setTimeout(() => getData(args, port, res, result), 100)
                } else {
                    result.push({ [key]: response.toString()})
                    // result.push({ [key]: getValuesFromParentheses(response.toString(), key)})
                    res.json({ data: result, status: 200, error: null })
                }
                port.once('close', error => {

                    if (error) {
                        console.log('port closed', error)
                    }
                })
            })
        })
    } catch (err) {
        console.log("error: error in getData file", err)
    }
} 




module.exports = getData


function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
