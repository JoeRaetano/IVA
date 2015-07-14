'use strict';

var express = require('express');
var multer = require('multer');
var fs = require('fs');
var Parse = require('csv-parse');
var vehicle_id;
var Pids = require('../pid/pid.model');
var Functions = require('../function/function.model');
var mongoose = require('mongoose');


var controller = require('./file.controller');

var router = express.Router();

var pid_array = [];

router.post('/', [multer({ dest: './uploads/'}), function(req,res)
  {
    var filePath = req.files.userFile.path;
    vehicle_id = mongoose.Types.ObjectId(req.headers.referer.replace(/^.*(\\|\/|\:)/, ''));

    var columns = true;
    parseCSVFile(filePath, vehicle_id, columns, onNewRecord, onError, done);
    console.log('done')
    //res.redirect('/settings/vehicles/' + vehicle_id);
  }]);

module.exports = router;


function parseCSVFile(sourceFilePath, vehicleId, columns, onNewRecord, handleError, done){

  var source = fs.createReadStream(sourceFilePath);

  var linesRead = 0;

  var parser = Parse({
    delimiter: ',',
    columns: columns
  });

  parser.on("readable", function(){
    var record;
    while (record = parser.read())
    {
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

function onNewRecord(record) {
  //console.log(record.pid)
  // console.log(record.pid.toString())
  // console.log(vehicle_id)
  pid_array.push(record);
}

function updateDataBase(record)
{
  console.log(record)
  // Search to see if the PID specified by the record has already been created in the Pids database.
  Pids.find(
    {pid: record.pid, network: record.network, vehicles: vehicle_id},
    function(err, pid_data)
    {
      if(err)
      {return handleError(res, err);}
      console.log("*****")
      console.log(pid_data)
      console.log("*****")

      // If the PID has not already been created, then create a new PID with the specified information.
      if(pid_data.length == 0)
      {
        Pids.create({pid: record.pid, network: record.network, vehicles: vehicle_id}, function(err, pid)
        {
          if(err) { return handleError(res, err); }
          console.log(pid)
          pid_data = pid;
        });
      }

      // Find the function specified by the record.
      Functions.find(
        {function: record.function, bytes: record.bytes, pids: pid_data._id},
        function(err, func_data)
        {
          if (err)
          {
            return handleError(res, err);
          }

          // If the function has not already been created, create a new function with the specified information.
          if (func_data.length == 0)
          {
            Functions.create(
              {
                function: record.function,
                bytes: record.bytes,
                pids: pid_data._id
              },
              function (err, func) {
                if (err)
                {return handleError(res, err);}
              });
          } // if(!func_data)
        }
      );
    }
  );
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
    for(var i = 0; i < pid_array.length; i++)
    {
      updateDataBase(pid_array[i])
    }
    console.log('done here')
  });
}



