'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FunctionSchema = new Schema(
  {
    desc: String,
    bytes: String
  });

module.exports = mongoose.model('Function', FunctionSchema);
