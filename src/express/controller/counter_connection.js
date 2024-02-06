const { getData, getDataLst } = require('../../utils/serialport_connection');
const { setConfig } = require('../../config.js')
module.exports = {
    POST: async (req, res) => {
        try {
            let reqData = req.body
            let lstData = reqData.ReadingRegistorTime || []
            if (Object.values(setConfig(reqData).setUp).includes(null) || Object.values(setConfig(reqData).SerialPort).includes(null)) {
                throw new Error('Malumotlar tuliq kirg\'zilmagan')
            }

            let data
            if (!lstData.length) {
                data = await getData(reqData) || []
            } else {
                data = await getDataLst(reqData) || []
            }
            
            res.json({result: data, error: null, status: 200})
        } catch (error) {
            res.json({data: null, error: error.message, status: 404})
        }
    },
    GET: async (req, res) => {
        res.json({ data: 'hello serial port', status: 200 });
    }
};