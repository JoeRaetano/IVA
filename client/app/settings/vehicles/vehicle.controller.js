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
    $scope.data.vehicle = [];
    $scope.data.pid = [];
    $scope.range = [];

    $scope.currentItem = null;
    $scope.inEditMode = false;

    $scope.status = {
      isopen: false
    };

    $scope.toggled = function(open) {
      $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };

    $http.get('/api/vehicle').success(function(vehicleData) {
      $scope.data.vehicle = vehicleData;

      for( var i = 0; i < $scope.data.vehicle.length; i++)
      {
        $scope.range.push(i);
      }
      $scope.data.vehicle.length
    })

    } else {
      $http.get('/api/vehicle').success(function(vehicleData) {
        $scope.data = vehicleData;
      });
    }

    /**
     * @name returnToList
     * @desc Returns the page back to the main/parent listing
     * @memberOf IVA.VehicleController
     */
    $scope.returnToList = function() {
      $location.path('/settings/vehicles/');
    };

    /**
     * @name goToRecordDetails
     * @desc Redirects to the record-level detail view
     * @param {String} id Id number of the record
     * @memberOf IVA.VehicleController
     */
    $scope.goToRecordDetails = function(id) {
      $location.path( '/settings/vehicles/' + id );
    };

    $scope.goToEditRecord = function(id) {
      $location.path( '/settings/vehicles/edit/' + id );
    };

    $scope.goToPIDDetails = function(id) {
      $location.path( '/settings/pids/' + id );
    };

    $scope.goToEditSubRecord = function(id) {
      $location.path( '/settings/pids/edit/' + id );
    };

    /**
     * @name toggleEditMode
     * @desc Flips edit mode on/off
     * @memberOf IVA.VehicleController
     */
    $scope.toggleEditMode = function(){
      $scope.inEditMode = $scope.inEditMode === false;
    };

    /**
     * @name addRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.addRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {

        if (!$scope.data.vehicleMake || $scope.data.vehicleMake === '') {
          return;
        }

        $http.post('/api/vehicle', {
          make: $scope.data.vehicleMake,
          model: $scope.data.vehicleModel,
          year: $scope.data.vehicleYear,
          desc: $scope.data.vehicleDesc,
          active: false
        }).then(function() {
          $scope.message = 'Vehicle Data Added';

          $http.get('/api/vehicle').success(function(vehicleData) {
            $scope.data = vehicleData;
          });

          $scope.data.vehicleMake = '';
          $scope.data.vehicleModel = '';
          $scope.data.vehicleYear = '';
          $scope.data.vehicleDesc = '';
        }).catch(function() {
          // set invalid
          $scope.errors.other = 'Unable to save vehicle';
          $scope.message = '';
          dialogs.error('Vehicle Record Not Created', 'An error occurred while creating the vehicle.');
        });
      }
    };

    /**
     * @name addPID
     * @desc Updates a records list of PIDs
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.addSubRecord = function(form)
    {
      $scope.submitted = true;
      if(form.$valid)
      {
        if (!$scope.currentItem || $scope.currentItem._id === '')
        {
          return;
        }

        // Make new PID document in PID vehicle
        $http.put
        (
          '/api/vehicle/pid/' + $scope.currentItem._id,
          {
            pid: $scope.data.vehiclePid,
            network: $scope.data.vehicleNet
          }
        ).then(function()
        {
          $scope.message = 'Successfully Updated Item';
          $scope.inEditMode = false;
          $http.get('/api/vehicle/'+ $scope.currentItem._id).success(function(vehicleData)
          {
            $scope.currentItem = vehicleData;
            $scope.data.vehiclePid = '';
            $scope.data.vehicleNet = '';
          });
          $http.get('/api/vehicle/pid/' + currentId).success(function( vehicleData ) {
            $scope.data = vehicleData;
          });
        }).catch(function () {
          $scope.errors.other = 'unable to save changes to vehicle';
          $scope.message = '';
          dialogs.error('vehicle Record Not Updated', 'An error occurred while updating the vehicle.');
        });
      }
    };

    /**
     * @name editRecord
     * @desc Updates a record based on user input and returns to non-edit mode
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.editRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.currentItem || $scope.currentItem._id === '') {
          return;
        }
      }

      $http.put('/api/vehicle/' + $scope.currentItem._id, {
        make: $scope.currentItem.make,
        model: $scope.currentItem.model,
        year: $scope.currentItem.year,
        desc: $scope.currentItem.desc,
        active: $scope.currentItem.active
      }).then(function() {
        $scope.message = 'Successfully Updated Item';
        $scope.inEditMode = false;
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to vehicle';
        $scope.message = '';
        dialogs.error('vehicle Record Not Updated', 'An error occurred while updating the vehicle.');
      });
    };

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.VehicleController
     */
    $scope.deleteRecord = function(record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/vehicle/' + record._id, {
      }).then(function() {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/settings/vehicles/');
      }).catch(function() {
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
    $scope.deleteSubRecord = function(record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/pid/' + record._id, {
      }).then(function() {
        $http.get('/api/vehicle/' + currentId).success(function(vehicleData) {
          $scope.currentItem = vehicleData;
          $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/vehicles/' + currentId});
        });
        $http.get('/api/vehicle/pid/' + currentId).success(function( vehicleData ) {
          $scope.data = vehicleData;
        });
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
      }).catch(function() {
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
    $scope.requestDelete = function(item) {
      var dlg = dialogs.confirm(
        'Delete Vehicle',
        'Are you certain you want to delete this vehicle (' + item.make + ' ' + item.model + ', ' + item.year + ')?');
      dlg.result.then(function(btn){
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(item);
        // here's where we actually delete the item
      },function(btn){
        // operation was cancelled. Continue on as if nothing happened.
      });
    };

    /**
     * @name requestDelete
     * @desc Requests the deletion of an item & forces the user to confirm before continuing
     * @param item The item to be deleted
     * @memberOf IVA.VehicleController
     */
    $scope.requestPIDDelete = function(item) {
      var dlg = dialogs.confirm(
        'Delete PID',
        'Are you certain you want to delete this PID? (' + item.name + ')');
      dlg.result.then(function(btn){
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteSubRecord(item);
        // here's where we actually delete the item
      },function(btn){
        // operation was cancelled. Continue on as if nothing happened.
      });
    };

    $scope.uploadFile = function(form)
    {
      var file = $scope.userFile;
      //$scope.log(file)
      dialogs.confirm(file);
      $http.post('/api/file/', $scope.userFile );
    };
  });


