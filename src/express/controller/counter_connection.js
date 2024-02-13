const { getLstCounterResult, getCounterResult } = require('../../utils/serialport_connection');
const { Validation } = require('../../validation/validation.js');
module.exports = {
    POST: async (req, res) => {
        try {
            const { error, value } = Validation.validate(req.body)
            console.log(error, value);
            
            if (error) throw new Error(error.message)

            // const lstData = value.ReadingRegisterTime
            // const data = lstData ? await getLstCounterResult(value) : await getCounterResult(value)
            res.json({result: 'data', error: false, status: 200})
        } catch (error) {
            res.json({data: null, error: error.message, status: 400})
        }
    },
    GET: async (_, res) => {
        res.json({ data: 'hello serial port', status: 200 });
    }
}
