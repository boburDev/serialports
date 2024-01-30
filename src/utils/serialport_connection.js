function getData (args, port, res, data=[]) {
    let result = [...data]
    try {
        let arg = Object.values(args[0])[0]
        let key = Object.keys(args[0])[0]
        port.open()
        port.once('open', () => {
            port.write(arg)
            port.once('data', (response) => {
                port.close()
                let newArgs = args.shift()
                if (args.length !== 0) {
                    if (['volta', 'voltl'].includes(key)) {
                        result.push({data: getValuesFromParentheses(response.toString())})
                    }
                    setTimeout(()=>{getData(args, port, res, result)}, 80)
                } else {
                    result.push({data: response.toString()})
                    res.json({ data: result, status: 200, error: null })
                }
                port.once('close', error => {
                    if (error) {
                        console.log("error.message")
                    // throw new Error(error.message)
                    }
                })
            })
        })
    } catch (err) {
        console.log("error: error in getData file")
    }
} 




module.exports = getData



function getValuesFromParentheses(param) {
    let sum = ''    
    for(let i of param) {
        if (i == '.' || !!Number(i) || i == ')') {
            if (i == ')') {
                sum += ','
            } else {
                sum += i
            }
        }
    }

    let matches = sum.split(',')
    const result = {
        Ua: matches[0] || "0",
        Ub: matches[1] || "0",
        Uc: matches[2] || "0",
    };
    return result
}