'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ModeSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean
});

module.exports = mongoose.model('Mode', ModeSchema);
