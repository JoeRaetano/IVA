'use strict';

var express = require('express');
var controller = require('./pid.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/vehicle/:id', controller.showPidsForVehicle);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/func/:id', controller.updateFunc);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
