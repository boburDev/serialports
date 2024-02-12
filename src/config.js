const setConfig = (reqData) => ({
        serialPort: {
            path: reqData.commDetail1,
            baudRate: reqData.commDetail2,
            dataBits: reqData.dataBit,
            stopBits: reqData.stopBit,
            parity: reqData.parity,
            autoOpen: false
        },
        setUp: {
            address: reqData.MeterAddress || '',
            password: reqData.MeterPassword,
            meterType: reqData.MeterType
        }
    })

module.exports = {
	setConfig
}
