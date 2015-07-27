'use strict';

var express = require('express');
var multer = require('multer');
var fs = require('fs');
var Parse = require('csv-parse');
var vehicle_id;
var Pids = require('../pid/pid.model');
var Functions = require('../function/function.model');
var mongoose = require('mongoose');

var vehicle_id = ""
var controller = require('./file.controller');

var waiting = false;

var router = express.Router();

var pid_array = [];

router.post('/', [multer({ dest: './uploads/'}), function(req,res)
  {
    for( var file in req.files )
    {
      var filePath = req.files[file].path;
      vehicle_id = mongoose.Types.ObjectId(file);
      break
    }

    var columns = true;
    parseCSVFile(filePath, vehicle_id, columns, onNewRecord, onError, done);
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
  console.log("function updateDataBase(record)")
  console.log(record)
  console.log("")

  // Search to see if the PID specified by the record has already been created in the Pids database.
  Pids.find(
    {pid: record.pid, network: record.network, vehicles: vehicle_id},
    function(err, pid_data)
    {
      if(err)
      {return handleError(res, err);}
      console.log("Pids.find(")
      console.log(pid_data)
      console.log("")

      // If the PID has not already been created, then create a new PID with the specified information.
      if(pid_data.length == 0)
      {
        Pids.create({pid: record.pid, network: record.network, vehicles: vehicle_id}, function(err, pid)
        {
          if(err) { return handleError(res, err); }
          console.log("if(pid_data.length == 0)")
          console.log(pid)
          console.log("")

          pid_data = pid;

          findFunction( record.function, record.bytes, pid_data._id)
        });
      }
      else
      {
        findFunction( record.function, record.bytes, pid_data._id)
      }

      // Find the function specified by the record.

      console.log("Done Functions.find")
    }
  );
  console.log("Done Pids.find")
}

function findFunction(argFunc, argBytes, argID)
{
  Functions.find(
    {function: argFunc, bytes: argBytes, pids: argID},
    function(err, func_data)
    {
      if (err)
      {
        return handleError(res, err);
      }
      console.log("Functions.find(")
      console.log(func_data)
      console.log("")


      // If the function has not already been created, create a new function with the specified information.
      if (func_data.length == 0)
      {
        Functions.create
        (
          {
            function: argFunc,
            bytes: argBytes,
            pids: argID
          },
          function (err, func)
          {
            if (err)
            {return handleError(res, err);}
            console.log("Functions.create")
            console.log(func)
            console.log("")
            waiting = false;
          }
        );
        console.log("Done Function Create")

      } // if(!func_data)
      else
      {
        waiting = false;
      }
      console.log("Done if(!func_data)")
    }
  );
}

function onError(error){
 // console.log(error)
}

function done(linesRead, sourceFilePath){
 // console.log("Done parsing file");
 // console.log(linesRead);
  fs.unlink( sourceFilePath, function (err) {
    if (err) throw err;

  //  var i = 0;
  //  while (i < pid_array.length)
  //  {
  //    if( !waiting )
  //    {
  //      updateDataBase(pid_array[i]);
  //      i++;
  //    }
  //    waiting = true;
  //  }
 //   console.log('successfully deleted file after parsing');
    for(var i = 0; i < pid_array.length; i++)
    {
      console.log("starting iteration" + i)
  //    waiting = true;
      updateDataBase(pid_array[i])
      //while(waiting){}
      console.log("ending iteration" + i)

    }
  //  console.log("-----")
  //  console.log(pid_array[0])
  //  console.log("-----")

  //  updateDataBase(pid_array[0])
  //  updateDataBase(pid_array[1])


    //  console.log('done here')
  });
}



