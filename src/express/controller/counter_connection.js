const { getData, openPort, closePort } = require('../../utils/serialport_connection')
const queries = require('../../queries/energomera_query.json')


module.exports = {
	GET: async(req,res) => {
        let { Reading: data } = {Reading: ["1.0.0", "1.0.1", "1.0.2"]}
        let query = data.map(i => i.replace('_', '.').replace(' ', '.'))
        



        const q = queries[0]
        const requests = query.map(i => {
            console.log(q['currentData']['volta'])
        })
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