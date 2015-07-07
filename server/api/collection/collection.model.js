/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Pids = require('../pid/pid.model');

var VehicleSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  pid_id: [],
  desc: String
});

module.exports = mongoose.model('Collection', VehicleSchema);

