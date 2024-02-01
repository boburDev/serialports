const net = require('net');
const port = 4000
const host = '127.0.0.1'


;(async()=>{
  async function connectToServer() {
    return new Promise((resolve, reject) => {
      let client = net.Socket()
      client.connect(port, host, async (socket) => {
        let requestString = `ok`
        client.write(requestString)
      })
    }) 
  }

  console.log(await connectToServer())
})()
