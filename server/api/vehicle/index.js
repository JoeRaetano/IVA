/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var express = require('express');
var controller = require('./vehicle.controller');

var router = express.Router();

router.get('/', controller.index);            // Returns all of the Vehicle documents in the Vehicle Collection.
router.get('/:id', controller.show);          // Returns the Vehicle with the supplied document id
//router.get('/query/:term', controller.query); //
router.post('/', controller.create);          // Creates a new Vehicle document in the Vehicle Collection
router.put('/:id', controller.update);        // Updates information stored in the Vehicle with the supplied document id
router.patch('/:id', controller.update);      // Updates information stored in the Vehicle with the supplied document id
router.delete('/:id', controller.destroy);    // Deletes the Vehicle with the supplied document id

module.exports = router;
