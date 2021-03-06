'use strict';

var controller = require('./file.controller');
var express    = require('express');
var fs         = require('fs');
var Functions  = require('../function/function.model');
var mongoose   = require('mongoose');
var multer     = require('multer');
var natural    = require('natural');
var Parse      = require('csv-parse');
var Pids       = require('../pid/pid.model');
//var search     = require('js-search');

var router = express.Router();

var pid_array = [];
var vehicle_id = ""

router.post('/', [multer({ dest: './uploads/'}), function(req,res)
  {
    for( var file in req.files )
    {
      var filePath = req.files[file].path;
      var isCSV = fileSecurityCheck(filePath);
      vehicle_id = mongoose.Types.ObjectId(file);
      break
    }

    if(isCSV == true)
    {
      var columns = true;
      parseCSVFile(filePath, vehicle_id, columns, onNewRecord, onError, done);
    }
    else
    {
      unlinkFile(filePath);
    }
    return res.redirect('/settings/vehicles')
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
    handleError(sourceFilePath, error);
  });

  parser.on("end", function(){
    done(linesRead, sourceFilePath);
  });

  source.pipe(parser);
}

function onNewRecord(record)
{
  natural.PorterStemmer.attach();
  record.tags = record.function.toLowerCase().tokenizeAndStem().sort()

  pid_array.push(record);
}

function updateDataBase(index)
{
  var record = pid_array[index]

  // Search to see if the PID specified by the record has already been created in the Pids database.
  Pids.find
  (
    {pid: record.pid, network: record.network, vehicle: vehicle_id},
    function (err, pid_data) {
      if(err) { return handleError(res, err); }

      // If the PID has not already been created, then create a new PID with the specified information.
      if (pid_data.length == 0)
      {
        Pids.create
        (
          {
            pid: record.pid,
            network: record.network,
            vehicle: vehicle_id
          },
          function (err, pid)
          {
            if (err) { return handleError(res, err)}

            pid_data = pid;
            findFunction(record.tags, record.bytes, pid_data._id, index);
          }
        );
      }
      else
      {
        findFunction(record.tags, record.bytes, pid_data[0]._id, index)
      }
    }
  )
}

function findFunction(argTags, argBytes, argID, index)
{
  Functions.find
  (
    {function: argTags, bytes: argBytes, pid: argID},
    function(err, func_data)
    {
      if(err) { return handleError(res, err); }

      // If the function has not already been created, create a new function with the specified information.
      if (func_data.length == 0)
      {
        Functions.create
        (
          {
            tags: argTags,
            bytes: argBytes,
            pid: argID
          },
          function (err, func)
          {
            if(err) { return handleError(res, err); }

            index += 1;
            if( index < pid_array.length )
            {
              updateDataBase( index )
            }
          }
        );
      } // if(!func_data)
      else
      {
        index += 1;
        if( index < pid_array.length )
        {
          updateDataBase( index )
        }
      }
    }
  );
}

function onError(sourceFilePath,error){
  unlinkFile(sourceFilePath)
  console.log(error)
}

function done(linesRead, sourceFilePath)
{
  unlinkFile(sourceFilePath);
  if( pid_array.length > 0)
  {
        updateDataBase(0)
  }
};

function fileSecurityCheck(sourceFilePath)
{
  var length = sourceFilePath.length
  var expectedExt = "csv"
  var actualExt = ""
  var isExtCorrect = true
  for(var i = (length - 3); i < length; i++)
  {
    actualExt += sourceFilePath[i]
  }
  if(actualExt != expectedExt)
  {
    isExtCorrect = false
  }
  return isExtCorrect
}

function unlinkFile(sourceFilePath)
{
  fs.unlink(sourceFilePath, function(err)
  {
    if(err) throw err;
  })
}

