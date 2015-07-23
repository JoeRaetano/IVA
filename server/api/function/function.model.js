'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FunctionSchema = new Schema(
  {
    function: String,
    bytes: String,
    pids: Array
  });

module.exports = mongoose.model('Function', FunctionSchema);