const { getData, openPort, closePort } = require('../../utils/serialport_connection')
const queries = require('../../queries/energomera_query.json')


module.exports = {
	GET: async(req,res) => {
        const q = queries[0]
        // console.log(query)
        const requests = [
            { 'version': q.version, crc: false },
            { 'hashedPassword': q.hashedPassword, crc: false },
            { 'password': q.password },
            { 'volta': q.volta },
            { 'voltl': q.voltl },
            { 'frequency': q.frequency },
            { 'currant': q.currant },
            { 'powp': q.powp },
            { 'powq': q.powq },
            { 'pows': q.pows },
            { 'coriu': q.coriu },
            { 'coruu': q.coruu },
            { 'cosf': q.cosf },
            { 'tanf': q.tanf },
            { 'currentDate': q.currentDate },
            { 'closeCommand': q.closeCommand },
            ]

        await openPort()
        
        getData(requests[0])

        // await closePort()
        res.json({ data: null, status: 200 })
    }
}
// let version = await getData(query.version, false)
// let hashedPassword = await getData(query.hashedPassword, false)
// await closePort()
// console.log(version)
// console.log(hashedPassword)