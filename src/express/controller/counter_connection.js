const { getLstCounterResult, getDataLst, getCounterResult } = require('../../utils/serialport_connection');
const { setConfig } = require('../../config.js')
module.exports = {
    POST: async (req, res) => {
        try {
            const reqData = req.body;
            const { setUp, serialPort } = setConfig(reqData);

            if (Object.values(setUp).includes(null) || Object.values(serialPort).includes(null)) {
                throw new Error('Malumot tuliq kirgizilmagan');
            }
            const lstData = reqData.ReadingRegistorTime || [];
            const data = lstData.length ? await getLstCounterResult(reqData) : await getCounterResult(reqData);
            res.json({result: data, error: false, status: 200})
        } catch (error) {
            res.json({data: null, error: error.message, status: 404})
        }
    },
    GET: async (req, res) => {
        res.json({ data: 'hello serial port', status: 200 });
    }
}
