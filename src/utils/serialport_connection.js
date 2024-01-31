const getValuesFromParentheses = require('./result_convertor.js')
const {CRC8} = require('./crc.js')

function getData (args, port, res, data=[]) {
    try {
        let result = [...data]
        let arg = Object.values(args[0])[0]
        let key = Object.keys(args[0])[0]

        console.log('oooooooook')
        port.open()
        port.once('open', () => {
            port.write(arg)
            port.once('data', (response) => {
                port.close()
                let resultDec = [...response]
                console.log([...arg], resultDec, '1111111111')
                let crc = resultDec.pop()
                console.log(resultDec, CRC8(resultDec), crc, '22222222\n\n\n\n\n\n\n\n\n\n\n')
                let newArgs = args.shift()
                if (args.length !== 0) {
                    if (!['connect', 'connect_open', 'password'].includes(key)) {
                        // console.log(crc == CRC8(resultDec))
                        result.push({ [key]: response.toString()})
                        // result.push({ [key]: getValuesFromParentheses(response.toString(), key)})
                    }
                    setTimeout(()=>{getData(args, port, res, result)}, 80)
                } else {
                    // console.log(crc == CRC8(resultDec))
                    result.push({ [key]: response.toString()})
                    // console.log([...response].pop(), [...response])
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


