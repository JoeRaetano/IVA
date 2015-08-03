/**
 * Created by jrs on 4/23/15.
 */

'use strict';

var _ = require('lodash');
var Vehicles = require('./vehicle.model');
var Pids = require('../pid/pid.model');
var Functions = require('../function/function.model')
var mongoose = require('mongoose');

// Get list of modes
exports.index = function(req, res) {
  Vehicles.find(function (err, c2s)
  {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single mode
exports.show = function(req, res) {
  Vehicles.findById(req.params.id, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

exports.query = function( req, res )
{
  console.log(req.params.term)

  Functions
    .find
    (
      { function: req.params.term },
      function(err, funcs)
      {
        if(err) { return handleError(res, err); }
        if(!funcs) {return}

        console.log(funcs)
      }
    );
};

// Creates a new mode in the DB.
exports.create = function(req, res) {
  Vehicles.create(req.body, function(err, c2)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing mode in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Vehicles.findById(req.params.id, function (err, c2)
  {
    if (err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }

    var updated = _.merge(c2, req.body, function(a, b)
      {
        if (_.isArray(a)) {
          return a.concat(b);}}
    );
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, c2);
    });
  });
};

// Deletes a mode from the DB.
exports.destroy = function(req, res) {
  Vehicles.findById(req.params.id, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    c2.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
