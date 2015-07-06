'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PidSchema = new Schema(
  {
    _id: Number,
    pid: Number,
    network: String,
  });

module.exports = mongoose.model('Pid', PidSchema);
