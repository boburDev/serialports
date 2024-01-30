const express = require('express')
const router = express.Router()

const COUNTER = require('./routes/counter')

router
.get('/', (_, res) => res.send('working...'))
.get('/counter', COUNTER.GET)

module.exports = router