'use strict';

var express = require('express');
var controller = require('./pid.controller');

var router = express.Router();

router.get('/', controller.index);                  // Returns all of the PID documents in the PID Collection
router.get('/:id', controller.show);                // Returns the PID with the supplied document id
router.get('/vehicle/:id', controller.getVehicles); // Returns all PIDs that belong to the specified Vehicle document id
router.post('/', controller.create);                // Creates a new PID document in the PID Collection
router.put('/:id', controller.update);              // Updates information stored in the PID with supplied document id
router.patch('/:id', controller.update);            // Updates information stored in the PID with supplied document id
router.delete('/:id', controller.destroy);          // Deletes the Vehicle with the supplied document id

module.exports = router;
