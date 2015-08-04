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
var Functions = require('./function.model');
var natural = require('natural')

// Get list of things
exports.index = function(req, res) {
  Functions.find(function (err, c2s) {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Functions.findById(req.params.id, function (err, c2) {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

exports.getPids = function(req, res) {
  var id = req.params.id.toString()

  Functions.find({pid : id}, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};


// Creates a new thing in the DB.
exports.create = function(req, res) {
  natural.PorterStemmer.attach();
  console.log(req.body.function)
  console.log(req.body.function.toLowerCase().tokenizeAndStem())
  Functions.create(req.body, function(err, c2) {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Functions.findById(req.params.id, function (err, c2) {
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

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Functions.findById(req.params.id, function (err, c2) {
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
