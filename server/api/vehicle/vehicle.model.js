/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var VehicleSchema = new Schema(
  {
    make  : String, // The make of the vehicle
    model : String, // The model of the vehicle
    year  : Number  // The year the vehicle was made
  });

module.exports = mongoose.model('Vehicle', VehicleSchema);

