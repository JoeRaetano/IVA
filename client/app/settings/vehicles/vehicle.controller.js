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
    var vehicle_route  = "/api/vehicle/";
    var pid_route      = "/api/pid/";
    var function_route = "/api/function/";
      
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
    $http.get(vehicle_route).success(function (vehicleData) {
      // The vehcile data is stored at "base" for robustness and ease of expansion.
      // If the developers wanted to create a new higher level collection of information, say car manufacturers,
      // the data structure for the vehicles to be stored in is ready to go. All that is needed is to store each
      // manufacturers collection of cars under the manucafurers id, instead of storing the data under "base".
      $scope.data.vehicles["base"] = vehicleData;
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
      $http.get(function_route + "tags").success(function(tagData)
      {
        $scope.data.tags = tagData;
      })
    };
    
    /**
     * @name addRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.addRecord = function (collection, form, id) {
      var post_route = "";      // The route to POST to.
      var get_route = "";       // The route to GET from.
      var collection_data = {}; // The data to POST.

      // If the record being added is a Vehicle:
      if( collection == "vehicle" )
      {
        post_route = vehicle_route;   // The route to POST to is "/api/vehicle/"
        get_route  = vehicle_route;   // The route to GET from is "/api/vehicle/"
        // The data to POST to "/api/vehicle/"
        collection_data =
        {
          make  : $scope.data.vehicleMake,
          model : $scope.data.vehicleModel,
          year  : $scope.data.vehicleYear
        }

      }
      // Else if the record being added is a PID:
      else if( collection == "pid" )
      {
        post_route = pid_route;                 // The route to POST to is "/api/pid/"
        get_route  = pid_route + "vehicle/";    // The route to GET from is "/api/pid/vehicle/"
        // The data to POST to "/api/pid/"
        collection_data =
        {
          pid     : $scope.data.vehiclePid,
          network : $scope.data.vehicleNet,
          vehicle : id.toString()
        }

      }
      // Else if the record being added is a function:
      else if( collection == "function" )
      {
        post_route = function_route;            // The route to POST to is "/api/function/"
        get_route  = function_route + "pid/";   // The route to GET from is "/api/function/pid/"
        // The data to POST to "/api/pid/"
        collection_data =
        {
          tags  : $scope.data.funcDesc,
          bytes : $scope.data.funcBytes,
          pid   : id.toString()
        }
      }
      // Else return without doing anything.
      else { return }

      // If the form is valid
      if (form.$valid)
      {
        // Creates a new record in the Collection specified by the preset POST route.
        // The new record is created with the information specified by the preset collection data.
          $http.post
          (
            post_route, // Post to Vehicle Collection
            collection_data
          )
            .then // Once the post has been made, perform the following commands:
          (
            function () {
              // Fetch the updated Collection data specified by the preset GET route.
              $scope.getRecordDetails( get_route, id )

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
      if( collection == "vehicle" )
      {
        $scope.data.vehicleMake  = '';
        $scope.data.vehicleModel = '';
        $scope.data.vehicleYear  = '';
      }
      else if( collection == "pid" )
      {
        $scope.data.vehiclePid   = '';
        $scope.data.vehicleNet   = '';
      }
      else if( collection == "function" )
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
    $scope.getRecordDetails = function ( get_route, id )
    {
      //dialogs.confirm(id)
      $http.get( get_route + id ).success( function (recordData)
      {
        // If the supplied route is the vehicle route, then the data retrieved is the list of all of the Vehicles Documents.
        if( get_route == vehicle_route )
        {
          // Store the retrieved Documents in the Vehicles hash table under "base" as this is the base level of data.
          $scope.data.vehicles["base"] = recordData;
        }
        // If the supplied route is the pid route + "vehicles/" then the data retrieved is the list of Vehicle Documents that 
        // the PID with the supplied ID belongs to.
        else if( get_route == (pid_route + "vehicle/") )
        {
          // Store the retrieved Documents in the PID hash table under the specified Document ID.
          $scope.data.pids[id] = recordData;
        }
        // If the supplied route is the function route + "pid/" then the data retrieved is the list of PID Documents that
        // the Function with the supplied ID belongs to.
        else if( get_route == function_route + "pid/" )
        {
          // Store the retrieved Documents in the Function Hash Table under the specified ID.
          $scope.data.functions[id] = recordData;
        }
      });
    };

    $scope.queryRecords = function (form) {
      $scope.submitted = true;

      if (form.$valid) {
        $http.get
        (
          function_route + 'query/' + $scope.data.expression.join(" ")
        ).success
        (
          function (vehicleData) {
            // Set the scope's data to the fetched data
            //$scope.data = vehicleData;
          }
        )
        //$scope.data.vehicleFunc = '';
      }
    }


    /**
     * @name editRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.editRecord = function (collection, form, record_id, subrecord_id) {
      var post_route = "";
      var get_route = "";
      var collection_data = {};

      if( collection == "vehicle" )
      {
        post_route = vehicle_route;
        get_route  = vehicle_route;
        collection_data =
        {
          make  : $scope.data.vehicleMake,
          model : $scope.data.vehicleModel,
          year  : $scope.data.vehicleYear
        }

      }
      else if( collection == "pid" )
      {
        post_route = pid_route;
        get_route  = pid_route + "vehicle/";
        collection_data =
        {
          pid     : $scope.data.vehiclePid,
          network : $scope.data.vehicleNet,
          vehicle : record_id.toString()
        }

      }
      else if( collection == "function" )
      {
        post_route = function_route;
        get_route  = function_route + "pid/";
        collection_data =
        {
          function : $scope.data.funcDesc,
          bytes    : $scope.data.funcBytes,
          pid      : record_id.toString()
        }
      }
      else { return }

      if (form.$valid) {
        // Creates a new record in the Vehicle Collection.
        // The new record is created with the information specified in the supplied form.
        $http.put
        (
          post_route + subrecord_id.toString(), // Post to Vehicle Collection
          collection_data
        )
          .then // Once the post has been made, perform the following commands:
        (
          function () {
            // Fetch the updated Vehicle Collection data
            $scope.getRecordDetails( get_route, record_id )
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
      if( collection == "vehicle" )
      {
        $scope.data.vehicleMake  = '';
        $scope.data.vehicleModel = '';
        $scope.data.vehicleYear  = '';
      }
      else if( collection == "pid" )
      {
        $scope.data.vehiclePid   = '';
        $scope.data.vehicleNet   = '';
      }
      else if( collection == "function" )
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
    $scope.deleteRecord = function (collection, record) {
      var delete_route = "";
      var get_route    = "";
      var get_id       = "";

      if (!record || record._id === '') { return; }

      if( collection == "Vehicle" )
      {
        delete_route = vehicle_route;
        get_route    = vehicle_route;
        get_id       = "";
      }
      else if( collection == "PID" )
      {
        delete_route = pid_route;
        get_route    = pid_route + 'vehicle/'
        get_id       = record.vehicle;
      }
      else if( collection == "Function" )
      {
        delete_route = function_route;
        get_route    = function_route + 'pid/'
        get_id       = record.pid;
      }


      $http.delete(delete_route + record._id, {}).then(function () {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $scope.getRecordDetails( get_route, get_id )
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
    $scope.requestDelete = function (collection, item) {
      var item_data = "";
      if( collection == "Vehicle" )
      {
        item_data = item.make + " " + item.model + " " + item.year;
      }
      else if( collection == "PID" )
      {
        item_data = item.pid + " On Network " + item.network;
      }
      else if( collection == "Function" )
      {
        item_data = item.function + " With Byte Sequence " + item.bytes
      }
      else{ return }

      var dlg = dialogs.confirm(
        'Delete ' + collection,
        'Are you certain you want to delete this ' + collection + ' (' + item_data + ')?');
      dlg.result.then(function (btn) {
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(collection, item);
        // here's where we actually delete the item
      }, function (btn) {
        // operation was cancelled. Continue on as if nothing happened.
      });
    };
  });


