const { SerialPort } = require('serialport');
const { InterByteTimeoutParser } = require('@serialport/parser-inter-byte-timeout');
const { makeQuery } = require('../../utils/makeQuery.js');
const { queryMaker } = require('../../utils/crc.js')

const openPort = (port) => {
    return new Promise((resolve, reject) => {
        port.open(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const writeToPort = (data, port) => {
    return new Promise((resolve, reject) => {
        port.write(data, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const closePort = (port) => {
    return new Promise((resolve, reject) => {
        port.close(err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const waitForData = (port, timeout = 1600) => {
    return new Promise((resolve, reject) => {
        const dataHandler = data => {
            resolve(data);
        }
        port.pipe(
            new InterByteTimeoutParser({
                interval: 300,
                maxBufferSize: 10000
            })).once('data', dataHandler);

        const func = () => {
            port.removeListener('data', dataHandler);
            reject(new Error('Timeout waiting for data'));
        };

        const timeoutId = setTimeout(() => {
            clearTimeout(timeoutId, func());
        }, timeout);
    });
};


module.exports = {
    POST: async (req, res) => {
        try {
            let reqData = req.body
            let reqTime = reqData?.ReadingRegistorTime || []
            let configuration = serialPortConfig(reqData)
            if (Object.values(configuration.setUp).includes(null) || Object.values(configuration.SerialPort).includes(null)) {
                throw new Error('Malumotlar tuliq kirg\'zilmagan')
            }

            // console.log(reqData.ReadingRegistor, configuration.setUp)
            const port = new SerialPort(configuration.SerialPort)
            const queries = makeQuery(reqData.ReadingRegistor, configuration.setUp)
            // console.log(queries)
            const vr = queryMaker(queries[0].version, queries[0].crc)
            const hp = queryMaker(queries[1].hashedPassword, queries[1].crc)
            const pw = queryMaker(queries[2].password)
            const v = queryMaker(queries[3].volta)
            const cc = queryMaker(queries[4].closeCommand)
            // console.log(vr)
            // console.log(hp)
            // console.log(pw)
            // console.log(v)
            // console.log(cc)
            await openPort(port)

            // Get Version
            await writeToPort(vr, port);
            const version = await waitForData(port);
            console.log(version.toString())


            // Get Hashed Password
            await writeToPort(hp, port);
            const hashPass = await waitForData(port);

            // Check Password
            await writeToPort(pw, port);
            const isChecked = await waitForData(port);

            // Check Volta
            await writeToPort(v, port);
            const volta = await waitForData(port);
            console.log(volta.toString())

            
            // Check Close
            await writeToPort(cc, port);
            await closePort(port);


            res.json({result: {
                version: version.toString(),
                volta: volta.toString()
            }, error: null, status: 200})


        } catch (error) {
            res.json({data: null, error: error.message, status: 404})
        }
    },
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


