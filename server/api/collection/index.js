/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var express = require('express');
var controller = require('./collection.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/pid/:id', controller.updatePid);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
