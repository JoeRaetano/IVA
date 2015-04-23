'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SensorSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean
});

module.exports = mongoose.model('Sensor', SensorSchema);
