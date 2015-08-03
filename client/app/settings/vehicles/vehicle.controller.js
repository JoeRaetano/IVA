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
          function : $scope.data.funcDesc,
          bytes    : $scope.data.funcBytes,
          pid      : id.toString()
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
        $http.get('/api/vehicle/query/' + $scope.data.vehicleFunc).success
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

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.VehicleController
     */
    $scope.deleteRecord = function (record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/vehicle/' + record._id, {}).then(function () {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/settings/vehicles/');
      }).catch(function () {
        $scope.errors.other = 'unable to save changes to vehicle mode';
        $scope.message = '';
        dialogs.error('vehicle Record Not Deleted', 'An error occurred while deleting the vehicle.');
      });
    };

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.VehicleController
     */
    $scope.deleteSubRecord = function (record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/pid/' + record._id, {}).then(function () {
        $http.get('/api/vehicle/' + currentId).success(function (vehicleData) {
          $scope.currentItem = vehicleData;
          $scope.crumbs.push({title: $scope.currentItem.name, link: '/settings/vehicles/' + currentId});
        });
        $http.get('/api/vehicle/pid/' + currentId).success(function (vehicleData) {
          $scope.data = vehicleData;
        });
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
      }).catch(function () {
        $scope.errors.other = 'unable to save changes to vehicle mode';
        $scope.message = '';
        dialogs.error('vehicle Record Not Deleted', 'An error occurred while deleting the vehicle.');
      });
    };

    /**
     * @name requestDelete
     * @desc Requests the deletion of an item & forces the user to confirm before continuing
     * @param item The item to be deleted
     * @memberOf IVA.VehicleController
     */
    $scope.requestDelete = function (item) {
      var dlg = dialogs.confirm(
        'Delete Vehicle',
        'Are you certain you want to delete this vehicle (' + item.make + ' ' + item.model + ', ' + item.year + ')?');
      dlg.result.then(function (btn) {
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(item);
        // here's where we actually delete the item
      }, function (btn) {
        // operation was cancelled. Continue on as if nothing happened.
      });
    };

      var dlg = dialogs.confirm(
        'Delete PID',
        'Are you certain you want to delete this PID? (' + item.name + ')');
      dlg.result.then(function (btn) {
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteSubRecord(item);
        // here's where we actually delete the item
      }, function (btn) {
        // operation was cancelled. Continue on as if nothing happened.
      });
    };
  });


