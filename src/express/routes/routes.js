const express = require('express');
const router = express.Router();
const getMeterDataConnection = require('../controller/counter_connection.js');
const getSomething = require('../../main.js');

router.get('/', (req, res) => {
	res.send('working...')
});
router.get('/connection', getMeterDataConnection.GET);
router.get('/something', getSomething);

module.exports = router;
