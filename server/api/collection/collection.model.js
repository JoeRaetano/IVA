/**
 * Created by jrs on 4/23/15.
 */
'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CollectionSchema = new Schema({
  name: String,
  desc: String,
  active: Boolean
});

module.exports = mongoose.model('Collection', CollectionSchema);
