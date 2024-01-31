const getValuesFromParentheses = require('./result_convertor.js')

function getData (args, port, res, data=[]) {
    try {
        let result = [...data]
        let arg = Object.values(args[0])[0]
        let key = Object.keys(args[0])[0]

        port.open()
        port.once('open', () => {
            port.write(arg)
            port.once('data', (response) => {
                port.close()
                let newArgs = args.shift()
                if (args.length !== 0) {
                    if (!['connect', 'connect_open', 'password'].includes(key)) {
                        // result.push({ [key]: response.toString()})
                        result.push({ [key]: getValuesFromParentheses(response.toString(), key)})
                    }
                    setTimeout(()=>{getData(args, port, res, result)}, 80)
                } else {
                    // result.push({ [key]: response.toString()})
                    result.push({ [key]: getValuesFromParentheses(response.toString(), key)})
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


