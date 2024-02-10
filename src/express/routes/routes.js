const express = require('express');
const router = express.Router();
const getMeterDataConnection = require('../controller/counter_connection.js');
const testCounters = require('../controller/dlms.js');

router.get('/', (req, res) => res.send('working...'));
router.get('/connection', getMeterDataConnection.GET);
router.post('/connection', getMeterDataConnection.POST);
router.post('/test_port', testCounters);

module.exports = router;