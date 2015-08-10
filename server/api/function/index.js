'use strict';

var express = require('express');
var controller = require('./function.controller');

var router = express.Router();

router.get('/', controller.index);          // Returns all of the Function documents in the Function Collection
router.get('/pid/:id', controller.getPids); // Returns all Functions that belong to the specified PID document id
router.get('/query/:expression', controller.query);
router.get('/tags', controller.getTags);
router.get('/:id', controller.show);        // Returns the PID with the supplied document id
router.post('/', controller.create);        // Creates a new PID document in the PID Collection
router.put('/:id', controller.update);      // Updates information stored in the PID with supplied document id
router.patch('/:id', controller.update);    // Updates information stored in the PID with supplied document id
router.delete('/:id', controller.destroy);  // Deletes the Vehicle with the supplied document id

module.exports = router;
