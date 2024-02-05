const { SerialPort } = require('serialport');
const {
    getData,
    openPort,
    closePort,
} = require('../../utils/serialport_connection');
const { makeQuery } = require('../../utils/makeQuery.js');

module.exports = {
    GET: async (req, res) => {
        // let { Reading: data } = { Reading: ["0.0", "0.1", "0.2", "1.4", "1.0.0"] };
        // let queries = makeQuery(data);

        // let result = [];
        // await openPort();
        // for (let request of queries) {
        //     let data = await getData(request);
        //     if (data) {
        //         result.push({ data });
        //     }
        // }
        // await closePort();
        // res.json({ data: result, status: 200 });
        res.json({ data: 'hello serial port', status: 200 });
    },
    POST: async (req, res) => {
        let reqData = req.body
        const setUp = {
            adress: reqData.MeterAdress,
            password: reqData.MeterPassword
        }
        const port = new SerialPort(serialPortConfig(reqData))
        const queries = makeQuery(reqData.ReadingRegistor, setUp)
        let result = [];
        await openPort(port);

        for (let request of queries) {
            let data = await getData(request, port);
            if (data) {
                result.push({ data });
            }
        }
        await closePort(port);
        res.json({result, status: 200})
    }
};


function serialPortConfig(reqData) {
    return {
        path: reqData.commDetail1 || 'COM6',
        baudRate: reqData.commDetail2 || 9600,
        dataBits: reqData.dataBit || 8,
        stopBits: reqData.stopBit || 1,
        parity: reqData.parity || 'none',
        autoOpen: false
    }
}