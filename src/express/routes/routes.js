const express = require('express');
const router = express.Router();
// const getMeterData = require('../controller/counter');
const getMeterDataConnection = require('../controller/counter_connection.js');

router.get('/', (req, res) => {
	res.send('working...')
});
// router.get('/counter', getMeterData);
router.get('/connection', getMeterDataConnection.GET);

module.exports = router;
