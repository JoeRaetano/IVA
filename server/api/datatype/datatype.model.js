'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DatatypeSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean
});

module.exports = mongoose.model('Datatype', DatatypeSchema);
