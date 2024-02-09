const setConfig = (reqData) => ({
        serialPort: {
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
    })

module.exports = {
	setConfig
}
