const setConfig = (reqData) => ({
        serialPort: {
            path: reqData.commDetail1,
            baudRate: reqData.commDetail2,
            dataBits: reqData.dataBit,
            stopBits: reqData.stopBit,
            parity: reqData.parity,
            autoOpen: false
        },
        tcpConnection: {
            host: reqData.commDetail1,
            port: reqData.commDetail2,
            tcp: true
        },
        setUp: {
            address: reqData.MeterAddress || '',
            password: reqData.MeterPassword,
            meterType: reqData.MeterType,
            connectionType: reqData.commMedia
        }
    })

module.exports = {
	setConfig
}
