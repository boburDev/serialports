const express = require('express')
const router = express.Router()

const COUNTERS = require('./routes/counters')

router
.get('/', (_, res) => res.send('working...'))
.get('/counter', COUNTERS.GET)

module.exports = router