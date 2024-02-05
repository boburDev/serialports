const {
    getData,
    openPort,
    closePort,
} = require('../../utils/serialport_connection');
const { makeQuery } = require('../../utils/makeQuery.js');

module.exports = {
    GET: async (req, res) => {
        let { Reading: data } = { Reading: ['0.0', '0.1', '0.2', '1.4', '1.0.0'] };
        let queries = makeQuery(data);
        console.log(queries)    

        // console.log(q)
        // console.log(Object.keys(q))
        // console.loq(req.body)
        // const requests = [
        //     { version: queries[0]['data'], crc: false },
        //     { hashedPassword: queries[1]['data'], crc: false },
        //     { password: queries[2]['data'] },
        //     { volta: queries[3]['data'] },
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
        //     // { 'currentDate': q.currentDate },
        //     // { 'closeCommand': q.closeCommand },
        // ];

        // let result = [];
        // await openPort();
        // for (let request of requests) {
        //     let data = await getData(request);
        //     console.log(data);
        //     if (data) {
        //         result.push({ [Object.keys(request)[0]]: data });
        //     }
        // }

        // await getData(requests[requests.length - 1]);
        // await closePort();
        res.json({ data: "result", status: 200 });
        // res.json({ data: 'success', status: 200 })
    },
};
// let version = await getData(query.version, false)
// let hashedPassword = await getData(query.hashedPassword, false)
// await closePort()
// console.log(version)
// console.log(hashedPassword)
