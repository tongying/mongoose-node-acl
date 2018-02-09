const express = require('express');
const router = express.Router();
const { tag } = require('../controller/index');
/* GET home page. */
router.all('/add', tag.add);

router.all('/remove', tag.remove);

router.all('/update', tag.update);

router.all('/query', tag.query);

module.exports = router;
