'use strict';

var _ = require('lodash');
var Mode = require('./mode.model');

// Get list of modes
exports.index = function(req, res) {
  Mode.find(function (err, modes) {
    if(err) { return handleError(res, err); }
    return res.json(200, modes);
  });
};

// Get a single mode
exports.show = function(req, res) {
  Mode.findById(req.params.id, function (err, mode) {
    if(err) { return handleError(res, err); }
    if(!mode) { return res.send(404); }
    return res.json(mode);
  });
};

// Creates a new mode in the DB.
exports.create = function(req, res) {
  Mode.create(req.body, function(err, mode) {
    if(err) { return handleError(res, err); }
    return res.json(201, mode);
  });
};

// Updates an existing mode in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Mode.findById(req.params.id, function (err, mode) {
    if (err) { return handleError(res, err); }
    if(!mode) { return res.send(404); }
    var updated = _.merge(mode, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, mode);
    });
  });
};

// Deletes a mode from the DB.
exports.destroy = function(req, res) {
  Mode.findById(req.params.id, function (err, mode) {
    if(err) { return handleError(res, err); }
    if(!mode) { return res.send(404); }
    mode.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}