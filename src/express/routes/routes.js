const express = require('express');
const router = express.Router();
const getMeterData = require('../controller/counter');

router.get('/', (_, res) => res.send('working...'));
router.get('/counter', getMeterData);

module.exports = router;
