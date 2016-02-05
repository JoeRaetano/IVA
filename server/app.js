/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var multer = require('multer');
var mongoose = require('mongoose');
var config = require('./config/environment');
var upload = multer({dest:'./uploads/'});

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }


//app.use(multer({ dest: 'uploads/' }).fields([{ name: 'avatar', maxCount: 1 }]));
//app.use(multer({dest:'./uploads/'}).single('photo'));

// Setup server
var app = express();
var server = require('http').createServer(app);

//new way to configure multer setup
app.post(upload.single('file'),
  function (req, res) {
  return req+Date.now();
});


/**
  onFileUploadStart, function load (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete, function load (file) {
  console.log(file.originalname + ' uploaded to  ' + file.path);
});
*/

/** old way to configure multer setup
app.use(multer({ dest: './uploads/',
  rename: function (fieldname, filename) {
    return filename+Date.now();
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
  onFileUploadComplete: function (file) {
    console.log(file.originalname + ' uploaded to  ' + file.path);
  },
}));
*/

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
