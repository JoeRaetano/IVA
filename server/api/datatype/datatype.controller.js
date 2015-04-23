/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /datatypes              ->  index
 * POST    /datatypes              ->  create
 * GET     /datatypes/:id          ->  show
 * PUT     /datatypes/:id          ->  update
 * DELETE  /datatypes/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Datatype = require('./datatype.model');

// Get list of datatypes
exports.index = function(req, res) {
  Datatype.find(function (err, datatypes) {
    if(err) { return handleError(res, err); }
    return res.json(200, datatypes);
  });
};

// Get a single datatype
exports.show = function(req, res) {
  Datatype.findById(req.params.id, function (err, datatype) {
    if(err) { return handleError(res, err); }
    if(!datatype) { return res.send(404); }
    return res.json(datatype);
  });
};

// Creates a new datatype in the DB.
exports.create = function(req, res) {
  Datatype.create(req.body, function(err, datatype) {
    if(err) { return handleError(res, err); }
    return res.json(201, datatype);
  });
};

// Updates an existing datatype in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Datatype.findById(req.params.id, function (err, datatype) {
    if (err) { return handleError(res, err); }
    if(!datatype) { return res.send(404); }
    var updated = _.merge(datatype, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, datatype);
    });
  });
};

// Deletes a datatype from the DB.
exports.destroy = function(req, res) {
  Datatype.findById(req.params.id, function (err, datatype) {
    if(err) { return handleError(res, err); }
    if(!datatype) { return res.send(404); }
    datatype.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
