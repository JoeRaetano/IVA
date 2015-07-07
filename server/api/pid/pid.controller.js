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
var Functions = require('../function/function.model');

// Get list of things
exports.index = function(req, res) {
  Pids.find(function (err, c2s)
  {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Pids.findById(req.params.id, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Pids.create(req.body, function(err, c2)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing thing in the DB.
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
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, c2);
    });
  });
};

exports.updateFunc = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  Functions.create(req.body, function(err, func)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, func);
  });

  Pids.findById(req.params.id, function (err, pid)
  {
    if (err) {
      return handleError(res, err);
    }
    if (!pid) {
      return res.send(404);
    }

    Functions.findOne(req.body, function (err, func)
    {
      if (err) {
        return handleError(res, err);
      }
      if (!func) {
        return res.send(404);
      }
      pid.funcs.push(func);
      pid.save();
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Pids.findById(req.params.id, function (err, c2) {
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
