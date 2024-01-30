function getData (args, port, res, data=[]) {
    let result = [...data]
    try {
        port.open()
        port.once('open', () => {
            port.write(args[0])
            port.once('data', (response) => {
                port.close()
                let newArgs = args.shift()
                if (args.length !== 0) {
                    console.log(result)
                    result.push({data: response})
                    getData(args, port, res, result)
                    // setTimeout(()=>{ , 50)
                    // clearTimeout(timeOut)
                } else {
                    result.push({data: response})
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
        console.log("error.message")
    }
} 




module.exports = getData