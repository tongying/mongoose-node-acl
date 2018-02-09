const express = require('express');
const router = express.Router();
const { block } = require('../controller/index');
/* GET home page. */
router.all('/add', block.add);

router.all('/remove', block.remove);

router.all('/update', block.update);

router.all('/query', block.query);

module.exports = router;
