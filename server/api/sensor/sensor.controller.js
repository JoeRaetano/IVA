/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /sensors              ->  index
 * POST    /sensors              ->  create
 * GET     /sensors/:id          ->  show
 * PUT     /sensors/:id          ->  update
 * DELETE  /sensors/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Sensor = require('./sensor.model');

// Get list of sensors
exports.index = function(req, res) {
  Sensor.find(function (err, sensors) {
    if(err) { return handleError(res, err); }
    return res.json(200, sensors);
  });
};

// Get a single sensor
exports.show = function(req, res) {
  Sensor.findById(req.params.id, function (err, sensor) {
    if(err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    return res.json(sensor);
  });
};

// Creates a new sensor in the DB.
exports.create = function(req, res) {
  Sensor.create(req.body, function(err, sensor) {
    if(err) { return handleError(res, err); }
    return res.json(201, sensor);
  });
};

// Updates an existing sensor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sensor.findById(req.params.id, function (err, sensor) {
    if (err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    var updated = _.merge(sensor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sensor);
    });
  });
};

// Deletes a sensor from the DB.
exports.destroy = function(req, res) {
  Sensor.findById(req.params.id, function (err, sensor) {
    if(err) { return handleError(res, err); }
    if(!sensor) { return res.send(404); }
    sensor.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
