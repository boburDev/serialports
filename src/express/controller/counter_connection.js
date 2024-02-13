const { serialPort } = require('../../utils/serialport');
module.exports = {
    POST: async (req, res) => {
        try {
            const data = await serialPort(req.body)
            res.json({result: data, error: false, status: 200})
        } catch (error) {
            res.json({data: null, error: error.message, status: 400})
        }
    },
    GET: async (_, res) => {
        res.json({ data: 'hello serial port', status: 200 });
    }
}
