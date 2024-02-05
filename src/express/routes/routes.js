const express = require('express');
const router = express.Router();
const getMeterDataConnection = require('../controller/counter_connection.js');

router.get('/', (req, res) => res.send('working...'));
router.get('/connection', getMeterDataConnection.GET);
router.post('/connection', getMeterDataConnection.POST);

module.exports = router;
