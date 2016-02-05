/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * vehicle Controller
 * @namespace IVA.VehicleController
 */
angular.module('IVA_App')
  .controller('VehicleController', function ($scope, $http, Auth, $location, $routeParams, dialogs)
  {
    // Local variable
    var vehicleRoute  = '/api/vehicle/';
    var pidRoute      = '/api/pid/';
    var functionRoute = '/api/function/';

    // Determines if the page should show query results or all of the data
    var queryMode = false;

    // general page initialization stuff
    $scope.errors = {};
    $scope.pageTitle = 'Vehicle Management';
    $scope.pageSubTitle = 'manage vehicle data';
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Vehicles', link: '/settings/vehicles'}
    );

    // Required data structures
    $scope.data = [];             // Base structure for all data.
    $scope.data.vehicles = {};    // Hash Table that stores arrays of Vehicle documents by "base"
    $scope.data.pids = {};        // Hash Table that stores arrays of PID documents by vehicle ID
    $scope.data.functions = {};   // Hash Table that stores arrays of Function documents by PID ID
    $scope.data.tags = {};        // Hash Table that stores arrays of Tags by first letter of Tag
    $scope.data.expression = [];  // Stores components of expression that will be used to query the Functions

    // The initial get, to get all of the vehicles to display on the vehicles.
    $http.get(vehicleRoute).success(function (vehicleData)
    {
      // The vehcile data is stored at "base" for robustness and ease of expansion.
      // If the developers wanted to create a new higher level collection of information, say car manufacturers,
      // the data structure for the vehicles to be stored in is ready to go. All that is needed is to store each
      // manufacturers collection of cars under the manucafurers id, instead of storing the data under "base".
      $scope.data.vehicles['base'] = vehicleData;
    });

    /**
     * @name addToExpression
     * @desc Adds a component to the expression that will be used to query the functions.
     * @param {string} The word to add to the generated expression.
     * @memberOf IVA.VehicleController
     */
    $scope.addToExpression = function( string )
    {
      // Push the string onto the end of the generated expression.
      $scope.data.expression.push(string);
    };

    /**
     * @name removeFromExpression
     * @desc Removes a component from the expression that will be used to query the functions.
     * @memberOf IVA.VehicleController
     */
    $scope.removeFromExpression = function()
    {
      // Pop the last string added to the end of the generated expression off.
      $scope.data.expression.pop();
    };

    /**
     * @name removeFromExpression
     * @desc Removes a component from the expression that will be used to query the functions.
     * @memberOf IVA.VehicleController
     */
    $scope.clearExpression = function()
    {
      // Pop the last string added to the end of the generated expression off.
      $scope.data.expression = [];
    };

    /**
     * @name getTags
     * @desc Gets all of the unique tags that are used to describe functions.
     * @memberOf IVA.VehicleController
     */
    $scope.getTags = function()
    {
      // Get all of the unique tags used to describe functions from the Function collection.
      $http.get(functionRoute + 'tags').success(function(tagData)
      {
        $scope.data.tags = tagData;
      });
    };

    /**
     * @name addRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.addRecord = function (collection, form, id)
    {
      var postRoute = '';      // The route to POST to.
      var getRoute = '';       // The route to GET from.
      var collectionData = {}; // The data to POST.

      // If the record being added is a Vehicle:
      if( collection === 'vehicle' )
      {
        postRoute = vehicleRoute;   // The route to POST to is "/api/vehicle/"
        getRoute  = vehicleRoute;   // The route to GET from is "/api/vehicle/"
        // The data to POST to "/api/vehicle/"
        collectionData =
        {
          make  : $scope.data.vehicleMake,
          model : $scope.data.vehicleModel,
          year  : $scope.data.vehicleYear
        };

      }
      // Else if the record being added is a PID:
      else if( collection === 'pid' )
      {
        postRoute = pidRoute;                 // The route to POST to is "/api/pid/"
        getRoute  = pidRoute + 'vehicle/';    // The route to GET from is "/api/pid/vehicle/"
        // The data to POST to "/api/pid/"
        collectionData =
        {
          pid     : $scope.data.vehiclePid,
          network : $scope.data.vehicleNet,
          vehicle : id.toString()
        };

      }
      // Else if the record being added is a function:
      else if( collection === 'function' )
      {
        postRoute = functionRoute;            // The route to POST to is "/api/function/"
        getRoute  = functionRoute + 'pid/';   // The route to GET from is "/api/function/pid/"
        // The data to POST to "/api/pid/"
        collectionData =
        {
          tags  : $scope.data.funcDesc,
          bytes : $scope.data.funcBytes,
          pid   : id.toString()
        };
      }
      // Else return without doing anything.
      else {
        return;
      }
      // If the form is valid
      if (form.$valid)
      {
        // Creates a new record in the Collection specified by the preset POST route.
        // The new record is created with the information specified by the preset collection data.
          $http.post
          (
            postRoute, // Post to Vehicle Collection
            collectionData
          )
            .then // Once the post has been made, perform the following commands:
          (
            function () {
              // Fetch the updated Collection data specified by the preset GET route.
              $scope.getRecordDetails( getRoute, id );

            }
          )
            .catch // Catch any thrown errors
          (
            function () {
              // set invalid
              $scope.errors.other = 'Unable to save vehicle';
              $scope.message = '';
              dialogs.error('Vehicle Record Not Created', 'An error occurred while creating the vehicle.');
            }
          );
      }

      // Reset the form values to blank
      if( collection === 'vehicle' )
      {
        $scope.data.vehicleMake  = '';
        $scope.data.vehicleModel = '';
        $scope.data.vehicleYear  = '';
      }
      else if( collection === 'pid' )
      {
        $scope.data.vehiclePid   = '';
        $scope.data.vehicleNet   = '';
      }
      else if( collection === 'function' )
      {
        $scope.data.funcDesc     = '';
        $scope.data.funcBytes    = '';
      }
    };

    /**
     * @name getRecordDetails
     * @desc Gets the documents associated with the specified document ID
     * @param {get_route} Route to GET the documents from
     * @param {id} Document ID of the record to GET the associated documents from
     * @memberOf IVA.VehicleController
     */
    $scope.getRecordDetails = function ( getRoute, id )
    {

      if( queryMode )
      { return }

      //dialogs.confirm(id)
      $http.get( getRoute + id ).success( function (recordData)
      {
        // If the supplied route is the vehicle route, then the data retrieved is the list of all of the Vehicles Documents.
        if( getRoute === vehicleRoute )
        {
          // Store the retrieved Documents in the Vehicles hash table under "base" as this is the base level of data.
          $scope.data.vehicles['base'] = recordData;
        }
        // If the supplied route is the pid route + "vehicles/" then the data retrieved is the list of Vehicle Documents that
        // the PID with the supplied ID belongs to.
        else if( getRoute === (pidRoute + 'vehicle/') )
        {
          // Store the retrieved Documents in the PID hash table under the specified Document ID.
          $scope.data.pids[id] = recordData;
        }
        // If the supplied route is the function route + "pid/" then the data retrieved is the list of PID Documents that
        // the Function with the supplied ID belongs to.
        else if( getRoute === functionRoute + 'pid/' )
        {
          // Store the retrieved Documents in the Function Hash Table under the specified ID.
          $scope.data.functions[id] = recordData;
        }
      });
    };

    $scope.queryRecords = function (form)
    {
      var parenStack = []; // Stack for keeping track of matching parenthesis.
      var logicStack = []; // Stack for keeping track of current logical operation.
      var logic = [ 'AND', 'OR', 'NOT'];              // Simplifies code by allowing generic comparisons.
      var notTag = [ '(', ')', 'AND', 'OR', 'NOT'];  // Simplifies code by allowing generic comparisons.
      var expression = $scope.data.expression;        // Simplifies code by making things more compact.
      var isLogicSet = false; // There cannot be two different types of logic operators separated by tags, but not be
                                // parenthesis. This will be set to true when a logic operator is found, and logicStack
                                // will be used to compare future logic operators to the current scopes logic operation.

      if (form.$valid)
      {
        // If the expression string is empty then you "find" everything.
        if( expression.length === 0 ) {
          return
        }
        // Check to make sure the first element is not an OR or AND.
        if( expression[0] === 'OR' || expression[0] === 'AND' )
        {
          dialogs.error('Query Not Performed', 'An ' + expression[0] + ' must have a tag on either side.');
          return
        }
        // Check to make sure the last element is not an OR, AND, or NOT.
        if( logic.indexOf( expression[ expression.length-1 ] ) !== -1 )
        {
          dialogs.error('Query Not Performed', 'An ' + expression[ expression.length-1 ] + ' must have a tag on either side.');
          return
        }

        // Test generated expression for errors
        for( var i = 0; i < expression.length; i++ )
        {
          // Check to make sure no two logic operations are side by side.
          if( (logic.indexOf(expression[i]) !== -1) && (logic.indexOf(expression[i+1]) !== -1) && (i+1 < expression.length) )
          {
            dialogs.error('Query Not Performed', 'An ' + expression[i] + ' must have a tag on either side.');
            return
          }

          // Check to make sure no two tags are side by side.
          if( (notTag.indexOf(expression[i]) === -1) && (notTag.indexOf(expression[i+1]) === -1) && (i+1 < expression.length) )
          {
            dialogs.error('Query Not Performed', 'Tags must have a logical operator between them.');
            return
          }

          switch( expression[i])
          {
            case 'AND':
              if( !isLogicSet )
              {
                logicStack.push('AND');
                isLogicSet = true;
              }
              else if( logicStack[ logicStack.length-1 ] !== 'AND' )
              {

                dialogs.error('Query Not Performed', 'Different logic operation cannot exist in the same scope. Use parenthesis to specify order of operations.');
                return
              }
              break;

            case  'OR':
              if( !isLogicSet )
              {
                logicStack.push('OR');
                isLogicSet = true;
              }
              else if( logicStack[ logicStack.length-1 ] !== 'OR' )
              {
                dialogs.error('Query Not Performed', 'Different logic operation cannot exist in the same scope. Use parenthesis to specify order of operations.');
                return
              }
              break;

            case 'NOT':
              if( !isLogicSet )
              {
                logicStack.push('NOT');
                isLogicSet = true;
              }
              else if( logicStack[ logicStack.length-1 ] !== 'NOT' )
              {
                dialogs.error('Query Not Performed', 'Different logic operation cannot exist in the same scope. Use parenthesis to specify order of operations.');
                return
              }

              if( i !== 0 && expression[i-1] !== '(' )
              {
                // Check to make sure no two logic operations are side by side.
                dialogs.error('Query Not Performed', 'An ' + expression[i] + ' can only only have one tag adjacent to its left. Use parenthesis to specify order of operations.');
                return
              }
              break;

            case   '(' :
              parenStack.push( '(' );
              isLogicSet = false;
              break;

            case   ')' :
              if( parenStack.length <= 0 )
              {
                dialogs.error('Query Not Performed', 'There are mismatched parenthesis.');
                return
              }
              parenStack.pop();
              logicStack.pop();
              isLogicSet = false;

              if( logicStack.length > 0 )
              {
                isLogicSet = true;
              }
              break;

            default   :
              isLogicSet = isLogicSet;
          }
        }

        if( parenStack.length > 0 )
        {
          dialogs.error('Query Not Performed', 'There are mismatched parenthesis.');
          return
        }

        $http.get
        (
          functionRoute + 'query/' + $scope.data.expression.join(' ')
        ).success
        (
          function (functionData) {
            queryMode = true;
            $scope.data.vehicles   = {};
            $scope.data.pids       = {};
            $scope.data.functions  = {};
            $scope.data.expression = [];

            handleFunction(functionData, 0);
          }
        );
      }
    };

    function handleFunction(functionData, index)
    {
      if( index < functionData.length )
      {
        if( $scope.data.functions[functionData[index].pid] === undefined )
        {
          $scope.data.functions[functionData[index].pid] = [ functionData[index] ];
        }
        else
        {
          $scope.data.functions[functionData[index].pid].push(functionData[index]);
        }

        $http.get
        (
            pidRoute + functionData[index].pid
        ).success
        (
          function ( pid )
          {

            if( $scope.data.pids[pid.vehicle] === undefined )
            {
              $scope.data.pids[pid.vehicle] = [ pid ];
            }
            else
            {
              var isDuplicate = false;
              for( var i = 0; i < $scope.data.pids[pid.vehicle].length; i++ )
              {
                if( $scope.data.pids[pid.vehicle][i]._id === pid._id )
                {
                  isDuplicate = true;
                }
              }

              if( !isDuplicate )
              {
                $scope.data.pids[pid.vehicle].push(pid);
              }
            }

            $http.get
            (
              vehicleRoute + pid.vehicle
            ).success
            (
              function( vehicle )
              {
                //dialogs.confirm($scope.data.vehicles["base"].contains( vehicle ));
                if( $scope.data.vehicles['base'] === undefined )
                {
                  $scope.data.vehicles['base'] = [ vehicle ];
                }
                else
                {
                  var isDuplicate = false;
                  for( var i = 0; i < $scope.data.vehicles['base'].length; i++ )
                  {
                    if( $scope.data.vehicles['base'][i]._id === vehicle._id )
                    {
                      isDuplicate = true;
                    }
                  }

                  if( !isDuplicate )
                  {
                    $scope.data.vehicles['base'].push(vehicle);
                  }
                }

                index++;
                handleFunction(functionData, index)
              }
            );
          }
        );
      }
    }


    /**
     * @name editRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.editRecord = function (collection, form, recordId, subrecordId)
    {
      var postRoute = '';
      var getRoute = '';
      var collectionData = {};

      if( collection === 'vehicle' )
      {
        postRoute = vehicleRoute;
        getRoute  = vehicleRoute;
        collectionData =
        {
          make  : $scope.data.vehicleMake,
          model : $scope.data.vehicleModel,
          year  : $scope.data.vehicleYear
        }

      }
      else if( collection === 'pid' )
      {
        postRoute = pidRoute;
        getRoute  = pidRoute + 'vehicle/';
        collectionData =
        {
          pid     : $scope.data.vehiclePid,
          network : $scope.data.vehicleNet,
          vehicle : recordId.toString()
        }

      }
      else if( collection === 'function' )
      {
        postRoute = functionRoute;
        getRoute  = functionRoute + 'pid/';
        collectionData =
        {
          function : $scope.data.funcDesc,
          bytes    : $scope.data.funcBytes,
          pid      : recordId.toString()
        }
      }
      else { return }

      if (form.$valid) {
        // Creates a new record in the Vehicle Collection.
        // The new record is created with the information specified in the supplied form.
        $http.put
        (
          postRoute + subrecordId.toString(), // Post to Vehicle Collection
          collectionData
        )
          .then // Once the post has been made, perform the following commands:
        (
          function () {
            // Fetch the updated Vehicle Collection data
            queryMode = false;
            $scope.getRecordDetails( getRoute,recordId )
          }
        )
          .catch // Catch any thrown errors
        (
          function () {
            // set invalid
            $scope.errors.other = 'Unable to save vehicle';
            $scope.message = '';
            dialogs.error('Vehicle Record Not Created', 'An error occurred while creating the vehicle.');
          }
        );
      }

      // Reset the form values to blank
      if( collection === 'vehicle' )
      {
        $scope.data.vehicleMake  = '';
        $scope.data.vehicleModel = '';
        $scope.data.vehicleYear  = '';
      }
      else if( collection === 'pid' )
      {
        $scope.data.vehiclePid   = '';
        $scope.data.vehicleNet   = '';
      }
      else if( collection === 'function' )
      {
        $scope.data.funcDesc     = '';
        $scope.data.funcBytes    = '';
      }
    };

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.VehicleController
     */
    $scope.deleteRecord = function (collection, record)
    {
      var deleteRoute = '';
      var getRoute    = '';
      var getId       = '';

      if (!record || record._id === '') { return; }

      if( collection === 'Vehicle' )
      {
        deleteRoute = vehicleRoute;
        getRoute    = vehicleRoute;
        getId       = '';
      }
      else if( collection === 'PID' )
      {
        deleteRoute = pidRoute;
        getRoute    = pidRoute + 'vehicle/';
        getId       = record.vehicle;
      }
      else if( collection === 'Function' )
      {
        deleteRoute = functionRoute;
        getRoute    = functionRoute + 'pid/';
        getId       = record.pid;
      }


      $http.delete(deleteRoute + record._id, {}).then(function () {
        queryMode = false;
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $scope.getRecordDetails( getRoute, getId );
        //$location.path('/settings/vehicles/');
      }).catch(function () {
        $scope.errors.other = 'unable to save changes to item';
        $scope.message = '';
        dialogs.error( collection + ' Record Not Deleted', 'An error occurred while deleting the ' + collection);
      });
    };

    /**
     * @name requestDelete
     * @desc Requests the deletion of an item & forces the user to confirm before continuing
     * @param item The item to be deleted
     * @memberOf IVA.VehicleController
     */
    $scope.requestDelete = function (collection, item)
    {
      var itemData = '';
      if( collection === 'Vehicle' )
      {
        itemData = item.make + ' ' + item.model + ' ' + item.year;
      }
      else if( collection === 'PID' )
      {
        itemData = item.pid + ' On Network ' + item.network;
      }
      else if( collection === 'Function' )
      {
        itemData = item.function + ' With Byte Sequence ' + item.bytes
      }
      else{ return }

      var dlg = dialogs.confirm(
        'Delete ' + collection,
        'Are you certain you want to delete this ' + collection + ' (' + itemData + ')?');
      dlg.result.then(function (btn) {
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(collection, item);
        // here's where we actually delete the item
      }, function (btn) {
        // operation was cancelled. Continue on as if nothing happened.
      });
    };


  });

  function confirmSubmit()
  {
    alert('File is being uploaded. \nIf the file is not the correct format nothing will be added to the database and you ' +
      'will be redirected to the vehicles page.\nThe template for uploading data is on the homepage')
  }

