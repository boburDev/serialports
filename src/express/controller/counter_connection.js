const { getData, openPort, closePort } = require('../../utils/serialport_connection')
const queries = require('../../queries/energomera_query.json')


module.exports = {
	GET: async(req,res) => {
        const query = queries[0]

        await openPort()
        let version = await getData(query.version, false)
        let hashedPassword = await getData(query.hashedPassword, false)
        await closePort()
        console.log(version)
        console.log(hashedPassword)
        console.log('closed port')
        res.json({ data: {version, hashedPassword}, status: 200 })
    }
}