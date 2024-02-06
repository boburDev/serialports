const { SerialPort } = require('serialport');
const {
    getData,
    openPort,
    closePort,
} = require('../../utils/serialport_connection');
const { makeQuery } = require('../../utils/makeQuery.js');

module.exports = {
    POST: async (req, res) => {
        try {
            let reqData = req.body
            let configuration = serialPortConfig(reqData)
            if (Object.values(configuration.setUp).includes(null) ||
                Object.values(configuration.SerialPort).includes(null)) {
                throw new Error('Malumotlar tuliq kirg\'zilmagan')
        }
        const port = new SerialPort(configuration.SerialPort)
        const queries = makeQuery(reqData.ReadingRegistor, configuration.setUp)
        // console.log(queries)
        let result = [];
        await openPort(port);

        for (let request of queries) {
            let data = await getData(request, port);
            if (data) {
                if (Object.keys(data)[0] == 'version' &&
                    !data.version.includes(configuration.setUp.meterType)) {
                    throw new Error('version confuse')
            } else {
                result.push(data);
            }
        }
    }
    await closePort(port);
    console.log(result)
    res.json({result, error: null, status: 200})
    // res.json({result: [], error: null, status: 200})
}
catch (error) {
    res.json({data: null, error: error.message, status: 404})
}
},
GET: async (req, res) => {
        // let { Reading: data } = { Reading: ["0.0", "0.1", "0.2", "1.4", "1.0.0"] };
        // let queries = makeQuery(data);
        // let result = [];
        // await openPort();
        // for (let request of queries) {
        //     let data = await getData(request);
        //     if (data) {result.push({ data })}}
        // await closePort();
        // res.json({ data: result, status: 200 });
    res.json({ data: 'hello serial port', status: 200 });
}
};


function serialPortConfig(reqData) {
    return {
        SerialPort: {
            path: reqData.commDetail1 || null,
            baudRate: reqData.commDetail2 || null,
            dataBits: reqData.dataBit || null,
            stopBits: reqData.stopBit || null,
            parity: reqData.parity || null,
            autoOpen: false
        },
        setUp: {
            adress: reqData.MeterAdress || '',
            password: reqData.MeterPassword || null,
            meterType: reqData.MeterType || null
        }
    }
}