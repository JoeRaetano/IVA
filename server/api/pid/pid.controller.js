/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Pids = require('./pid.model');
var mongoose = require('mongoose');


// Get list of PIDs
exports.index = function(req, res) {
  Pids.find(function (err, c2s)
  {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single PID
exports.show = function(req, res) {
  Pids.findById(req.params.id, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

exports.getVehicles = function(req, res) {
  var id = req.params.id.toString()

  Pids.find({vehicle : id}, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

// Creates a new PID in the DB.
exports.create = function(req, res) {
  Pids.create(req.body, function(err, c2)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing PID in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pids.findById(req.params.id, function (err, c2)
  {
    if (err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }

    var updated = _.merge(c2, req.body, function(a, b)
      {
        if (_.isArray(a)) {
          return a.concat(b);}}
    );

    updated.save(function (err)
    {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, c2);
    });

  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Pids.findById(req.params.id, function (err, pid) {
    if(err) { return handleError(res, err); }
    if(!pid) { return res.send(404); }

    pid.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
