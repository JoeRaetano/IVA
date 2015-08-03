'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PidSchema = new Schema(
  {
    pid     : String, // The PID value
    network : String, // The network the PID is on
    vehicle : String  // The document id of the vehicle that this PID is on
  });

module.exports = mongoose.model('Pid', PidSchema);
