'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FunctionSchema = new Schema(
  {
    function : String,  // A short description of this function
    bytes    : String,  // The bytes associated with this function
    pid      : String   // The document id of the PID this function is associated with
  });

module.exports = mongoose.model('Function', FunctionSchema);
