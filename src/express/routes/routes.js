const express = require('express');
const router = express.Router();
const getMeterDataConnection = require('../controller/counter_connection.js');
const testCounters = require('../controller/test_counter.js');

router.get('/', (req, res) => res.send('working...'));
router.get('/connection', getMeterDataConnection.GET);
router.post('/connection', getMeterDataConnection.POST);
router.get('/test_port', testCounters.GET);

module.exports = router;