'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PidSchema = new Schema(
  {
    pid: String,
    network: String,
    vehicles: Array
  });

module.exports = mongoose.model('Pid', PidSchema);
