const { getData, openPort, closePort } = require('../../utils/serialport_connection')
const { makeQuery } = require('../../utils/makeQuery.js')


module.exports = {
	GET: async(req,res) => {
        let { Reading: data } = {Reading: ["1.0.0", "1.4", "1.5"]}
        
        let queries = await makeQuery(data)
        setTimeout(()=>console.log(queries, 123), 1000)

        

        // console.log(q)
        // console.log(Object.keys(q))
        // console.loq(req.body)
        // const requests = [
        //     { 'version': q.version, crc: false },
        //     { 'hashedPassword': q.hashedPassword, crc: false },
        //     { 'password': q.password },
        //     { 'volta': q.currentData.volta },
        //     // { 'voltl': q.currentData.voltl },
        //     // { 'frequency': q.currentData.frequency },
        //     // { 'current': q.currentData.current },
        //     // { 'powp': q.currentData.powp },
        //     // { 'powq': q.currentData.powq },
        //     // { 'pows': q.currentData.pows },
        //     // { 'coriu': q.currentData.coriu },
        //     // { 'coruu': q.currentData.coruu },
        //     // { 'cosf': q.currentData.cosf },
        //     // { 'tanf': q.currentData.tanf },
        //     { 'currentDate': q.currentDate },
        //     { 'closeCommand': q.closeCommand },
        //     ]

        // let result = []
        // await openPort()
        // for(let i of requests) {
        //     let data = await getData(i)
        //     if (data) {
        //         result.push({[Object.keys(i)[0]]: data})
        //     }
        // }
        // // let result1 = await getData(requests[0], false)
        // // let result2 = await getData(requests[1], false)
        // // let result3 = await getData(requests[2])
        // // let result4 = await getData(requests[4])
        // // console.log(result4)
        // // await getData(requests[requests.length-1])
        // await closePort()
        // console.log(result)
        // res.json({ data: result, status: 200 })
        res.json({ data: 'success', status: 200 })
    }
}
// let version = await getData(query.version, false)
// let hashedPassword = await getData(query.hashedPassword, false)
// await closePort()
// console.log(version)
// console.log(hashedPassword)