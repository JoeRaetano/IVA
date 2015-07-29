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
    $scope.data.pid;
    $scope.range = [];
    $scope.pid_range = {};

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
      $scope.data.pid = new Array($scope.data.vehicle.length)
    })


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

    /**
     * @name goToEditRecord
     * @desc Redirects to the page designed to edit the record's information
     * @param {String} id Id number of the record
     * @memberOf IVA.VehicleController
     */
    $scope.goToEditRecord = function(id) {
      $location.path( '/settings/vehicles/edit/' + id );
    };

    /**
     * @name goToPIDDetails
     * @desc Redirects to the record-level detail view for a specified PID
     * @param {String} id Id number of the PID selected
     * @memberOf IVA.VehicleController
     */
    $scope.goToPIDDetails = function(id) {
      $location.path( '/settings/pids/' + id );
    };

    /**
     * @name goToEditSubRecord
     * @desc Redirects to the page designed to edit the specified PID's information
     * @param {String} id Id number of the record
     * @memberOf IVA.VehicleController
     */
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
      if(form.$valid)
      {
        // Creates a new record in the Vehicle Collection.
        // The new record is created with the information specified in the supplied form.
        $http.post
        (
          '/api/vehicle', // Post to Vehicle Collection
          {
            make: $scope.data.vehicleMake,
            model: $scope.data.vehicleModel,
            year: $scope.data.vehicleYear,
            desc: $scope.data.vehicleDesc,
            active: false
          }
        )
        .then // Once the post has been made, perform the following commands:
        (
          function()
          {
            $scope.message = 'Vehicle Data Added';

            // Fetch the updated Vehicle Collection data
            $http.get('/api/vehicle').success
            (
              function(vehicleData)
              {
                // Set the scope's data to the fetched data
                $scope.data.vehicle = vehicleData;

                $scope.range.push($scope.range.length);
                $scope.data.pid.length = $scope.data.vehicle.length
              }
            );

            // Reset the form values to blank
            $scope.data.vehicleMake = '';
            $scope.data.vehicleModel = '';
            $scope.data.vehicleYear = '';
            $scope.data.vehicleDesc = '';
          }
        )
        .catch // Catch any thrown errors
        (
          function()
          {
            // set invalid
            $scope.errors.other = 'Unable to save vehicle';
            $scope.message = '';
            dialogs.error('Vehicle Record Not Created', 'An error occurred while creating the vehicle.');
          }
        );
      }
    };

    /**
     * @name addPID
     * @desc Updates a records list of PIDs
     * @param {Form} form The HTML form object
     * @memberOf IVA.VehicleController
     */
    $scope.addSubRecord = function(form, vehicle, index)
    {
      $scope.submitted = true;
      if(form.$valid)
      {
        // Make new PID document in PID vehicle
        $http.put
        (
          '/api/vehicle/pid/' + vehicle._id,
          {
            pid: $scope.data.vehiclePid,
            network: $scope.data.vehicleNet
          }
        ).then(function()
        {
          $scope.getSubRecordDetails(vehicle._id, index)
          $scope.message = 'Successfully Updated Item';
          $scope.inEditMode = false;
        }).catch(function () {
          $scope.errors.other = 'unable to save changes to vehicle';
          $scope.message = '';
          dialogs.error('vehicle Record Not Updated', 'An error occurred while updating the vehicle.');
        });
      }
      $scope.data.vehiclePid = '';
      $scope.data.vehicleNet = '';

      if(form.$valid)
      {
        // Make new PID document in PID collection
        $http.put
        (
          '/api/pid/func/' + $scope.currentItem._id,
          {
            function: $scope.funcDesc,
            bytes: $scope.funcBytes
          }
        ).then(function()
          {
            $scope.message = 'Successfully Updated Item';
            $scope.inEditMode = false;
            $http.get('/api/pid/'+ $scope.currentItem._id).success(function(pidData)
            {
              $scope.currentItem = pidData;
              $scope.funcDesc = '';
              $scope.funcBytes = '';
            });
            $http.get('/api/pid/func/' + currentId).success(function( pidData ) {
              $scope.data = pidData;
            });
          }).catch(function () {
            $scope.errors.other = 'unable to save changes to pid';
            $scope.message = '';
            dialogs.error('PID Record Not Updated', 'An error occurred while updating the collection.');
          });
      }
    };

    $scope.getSubRecordDetails = function(id, index)
    {
      $http.get('/api/vehicle/pid/' + id).success(function( pidData ) {
        $scope.data.pid[index] = pidData;

        $scope.pid_range[id] = [];
        for( var i = 0; i < $scope.data.pid[index].length; i++)
        {
          $scope.pid_range[id].push(i)
        }
      });
    }



    $scope.queryRecords = function(form)
    {
      $scope.submitted = true;

      if(form.$valid)
      {
        $http.get('/api/vehicle/query/' + $scope.data.vehicleFunc).success
        (
          function(vehicleData)
          {
            // Set the scope's data to the fetched data
            $scope.data = vehicleData;
          }
        )
        $scope.data.vehicleFunc = '';
      }
    }


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

    $scope.uploadFile = function(form, id, index)
    {
      if(form.$valid)
      {
        var file = document.getElementById("userFile").value;

        //var file = $scope.data.userFile;
        dialogs.confirm(file);

        //$scope.log(file)
        $http.post
        (
          '/api/file',
          {
            Name: "yes",
            File: file,
            id: id
          }
        );
      }
    };
  });


