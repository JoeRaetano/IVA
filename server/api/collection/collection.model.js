/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

//var PID = require('../pid/pid.model');

var PidSchema = new Schema(
  {
    pid: Number,
    network: String
  });

var VehicleSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  pid_id: [{ type: Schema.ObjectId, ref: 'Pid' }],
  desc: String
});

module.exports = mongoose.model('Collection', VehicleSchema);
