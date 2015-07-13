'use strict';

var express = require('express');
var multer = require('multer');
var fs = require('fs');
var Parse = require('csv-parse');


var controller = require('./file.controller');

var router = express.Router();

router.post('/', [multer({ dest: './uploads/'}), function(req,res)
  {
    console.log(req.files.userFile);
    var filePath = req.files.userFile.path;
    console.log(filePath);
    var columns = true;
    parseCSVFile(filePath, columns, onNewRecord, onError, done);

     res.send("Post call completed");

  }]);

module.exports = router;

var output = [];

function parseCSVFile(sourceFilePath, columns, onNewRecord, handleError, done){

  var source = fs.createReadStream(sourceFilePath);

  var linesRead = 0;

  var parser = Parse({
    delimiter: ',',
    columns: columns
  });

  parser.on("readable", function(){
    var record;
    while (record = parser.read()) {
      linesRead++;
      onNewRecord(record);
    }
  });

  parser.on("error", function(error){
    handleError(error)
  });

  parser.on("end", function(){
    done(linesRead, sourceFilePath);
  });

  source.pipe(parser);
}

function onNewRecord(record){
  console.log(record)
}

function onError(error){
  console.log(error)
}

function done(linesRead, sourceFilePath){
  console.log("Done parsing file");
  console.log(linesRead);
  fs.unlink( sourceFilePath, function (err) {
    if (err) throw err;
    console.log('successfully deleted file after parsing');
  });
}



