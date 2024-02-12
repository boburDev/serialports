const express = require('express')
const cors = require('cors')
const http = require('http')
const routes = require('./express/routes/routes')
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

const serverHttp = http.createServer(app)

serverHttp.prependListener("request", (req, res) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
});

serverHttp.listen(PORT, () => console.log(`Server started at ${PORT}`))