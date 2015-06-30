/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PID = require('../pid/pid.model');

var VehicleSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  pids: [ PID ],
  desc: String
});

module.exports = mongoose.model('Collection', VehicleSchema);
