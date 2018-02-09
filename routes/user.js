const express = require('express');
const router = express.Router();
const { user } = require('../controller/index');
/* GET home page. */

router.all('/remove', user.remove);

router.all('/update', user.update);

router.all('/query', user.query);

module.exports = router;
