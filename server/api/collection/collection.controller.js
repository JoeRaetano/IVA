/**
 * Created by jrs on 4/23/15.
 */

'use strict';

var _ = require('lodash');
var Collections = require('./collection.model');
var Pids = require('../pid/pid.model');

//var C2 = mongoose.model('Collection', VehicleSchema);

// Get list of modes
exports.index = function(req, res) {
  Collections.find(function (err, c2s)
  {
    if(err) { return handleError(res, err); }
    return res.json(200, c2s);
  });
};

// Get a single mode
exports.show = function(req, res) {
  Collections.findById(req.params.id, function (err, c2)
  {
    if(err) { return handleError(res, err); }
    if(!c2) { return res.send(404); }
    return res.json(c2);
  });
};

// Creates a new mode in the DB.
exports.create = function(req, res) {
  Collections.create(req.body, function(err, c2)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, c2);
  });
};

// Updates an existing mode in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Collections.findById(req.params.id, function (err, c2)
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

// Updates an existing mode in the DB.
exports.updatePid = function(req, res) {
  if(req.body._id) { delete req.body._id; }

  var p = Pids.create(req.body, function(err, pid)
  {
    if(err) { return handleError(res, err); }
    return res.json(201, pid);
  });
  console.log(req.body.pid)

  Collections.findById(req.params.id, function (err, collection)
  {
   // console.log(req.params.id);
    if (err) {
      return handleError(res, err);
    }
    if (!collection) {
      return res.send(404);
    }

    Pids.findOne(req.body, function (err, pid)
    {
      console.log(pid)
      console.log(pid._id)

      if (err) {
        return handleError(res, err);
      }
      if (!pid) {
        return res.send(404);
      }
      collection.pid_id.push(pid);
      collection.save();/*function (err)
      /*{
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, collection);
      });*/
    });
  });
};

// Deletes a mode from the DB.
exports.destroy = function(req, res) {
  Collections.findById(req.params.id, function (err, c2)
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
