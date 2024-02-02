const { getData, openPort, closePort } = require('../../utils/serialport_connection')
const queries = require('../../queries/energomera_query.json')


module.exports = {
	GET: async(req,res) => {
        let x = `Reading: ["currentData volta", "positiveA all", "positiveA tarif1"]`
        const q = queries[0]
        // console.log(q)
        console.log(Object.keys(q))
        // console.loq(req.body)
        // const requests = [
        //     { 'version': q.version, crc: false },
        //     { 'hashedPassword': q.hashedPassword, crc: false },
        //     { 'password': q.password },
        //     { 'volta': q.currentData.volta },
        //     { 'voltl': q.currentData.voltl },
        //     { 'frequency': q.currentData.frequency },
        //     { 'current': q.currentData.current },
        //     { 'powp': q.currentData.powp },
        //     { 'powq': q.currentData.powq },
        //     { 'pows': q.currentData.pows },
        //     { 'coriu': q.currentData.coriu },
        //     { 'coruu': q.currentData.coruu },
        //     { 'cosf': q.currentData.cosf },
        //     { 'tanf': q.currentData.tanf },
        //     { 'currentDate': q.currentDate },
        //     { 'closeCommand': q.closeCommand },
        //     ]

        // await openPort()
        // let result1 = await getData(requests[0], false)
        // let result2 = await getData(requests[1], false)
        // let result3 = await getData(requests[2])
        // let result4 = await getData(requests[4])
        // await getData(requests[requests.length-1])
        // await closePort()
        res.json({ data: "success"||"{result1, result4}", status: 200 })
    }
}
// let version = await getData(query.version, false)
// let hashedPassword = await getData(query.hashedPassword, false)
// await closePort()
// console.log(version)
// console.log(hashedPassword)