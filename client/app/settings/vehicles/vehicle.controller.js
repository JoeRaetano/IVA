/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * vehicle Controller
 * @namespace IVA.VehicleController
 */
angular.module('IVA_App')
  .controller('VehicleController', function ($scope, $http, Auth, $location, $routeParams, dialogs) {

    // Local variable
    var vehicle_route  = "/api/vehicle/"
    var pid_route      = "/api/pid/"
    var function_route = "/api/function/"


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
    $scope.data = [];
    $scope.data.vehicles = {};
    $scope.data.pids = {};
    $scope.data.functions = {};
    $scope.data.tags = {};
    $scope.data.expression = [];

      //$scope.v_range = {};
    //$scope.p_range = {};

    //$scope.currentItem = null;
    $scope.inEditMode = false;

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function (open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $http.get(vehicle_route).success(function (vehicleData) {
      $scope.data.vehicles["base"] = vehicleData;
    });

      
    $scope.addToExpression = function( string )
    {
      $scope.data.expression.push(string);
    };
      
    $scope.removeFromExpression = function()
    {
      $scope.data.expression.pop();
    };
      
    $scope.getTags = function()
    {
      
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
          vehicle : id.toString()
        }

      }
      else if( collection == "function" )
      {
        post_route = function_route;
        get_route  = function_route + "pid/";
        collection_data =
        {
          tags  : $scope.data.funcDesc,
          bytes : $scope.data.funcBytes,
          pid   : id.toString()
        }
      }
      else { return }

      if (form.$valid)
      {
        // Creates a new record in the Vehicle Collection.
        // The new record is created with the information specified in the supplied form.
          $http.post
          (
            post_route, // Post to Vehicle Collection
            collection_data
          )
            .then // Once the post has been made, perform the following commands:
          (
            function () {
              // Fetch the updated Vehicle Collection data
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

    $scope.getRecordDetails = function ( get_route, id )
    {
      //dialogs.confirm(id)
      $http.get( get_route + id ).success( function (recordData)
      {
        if( get_route == vehicle_route )
        {
          $scope.data.vehicles["base"] = recordData;
        }
        else if( get_route == (pid_route + "vehicle/") )
        {
          $scope.data.pids[id] = recordData;
        }
        else if( get_route == function_route + "pid/" )
        {
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
            $scope.data = vehicleData;
          }
        )
        $scope.data.vehicleFunc = '';
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


