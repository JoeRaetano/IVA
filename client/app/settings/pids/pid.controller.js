/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * Pid Controller
 * @namespace IVA.PidController
 */
angular.module('IVA_App')
  .controller('PidController', function ($scope, $http, Auth, $location, $routeParams, dialogs) {

    // general page initialization stuff
    $scope.errors = {};
    $scope.pageTitle = 'Pid Management';
    $scope.pageSubTitle = 'manage pid data';
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Pid', link: '/settings/pids'}
    );
    $scope.data = [];
    $scope.currentItem = null;
    $scope.inEditMode = false;

    // attempt to get the ID from the route params
    var currentId = $routeParams.id;

    if (currentId) {
      $http.get('/api/pid/' + currentId).success(function(pidData) {
        $scope.currentItem = pidData;
        $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/pids/' + currentId});
      });
    } else {
      $http.get('/api/pid').success(function(pidData) {
        $scope.data = pidData;
      });
    }


      /**
     * @name returnToList
     * @desc Returns the page back to the main/parent listing
     * @memberOf IVA.PidController
     */
    $scope.returnToList = function() {
      $location.path('/settings/pids/');
    };

    /**
     * @name goToRecordDetails
     * @desc Redirects to the record-level detail view
     * @param {String} id Id number of the record
     * @memberOf IVA.PidController
     */
    $scope.goToRecordDetails = function(id) {
      $location.path( '/settings/pids/' + id );
    };

    $scope.goToEditRecord = function(id) {
      $location.path( '/settings/pids/edit/' + id );
    };

    $scope.goToFuncDetails = function(id) {
      $location.path( '/settings/functions/' + id );
    };

    $scope.goToEditSubRecord = function(id) {
      $location.path( '/settings/functions/edit/' + id );
    };

    /**
     * @name toggleEditMode
     * @desc Flips edit mode on/off
     * @memberOf IVA.PidController
     */
    $scope.toggleEditMode = function(){
      $scope.inEditMode = $scope.inEditMode === false;
    };

    /**
     * @name addRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.PidController
     */
    $scope.addRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.vehiclePid || $scope.vehiclePid === '') {
          return;
        }

        $http.post('/api/pid',
        {
          pid: $scope.vehiclePid,
          network: $scope.vehicleNet
        }).then(function() {
          $scope.message = 'PID Data Added';

          $http.get('/api/pid').success(function(pidData) {
            $scope.data = pidData;
          });

          $scope.vehiclePid = '';
          $scope.vehicleNetwork = '';
        }).catch(function() {
          // set invalid
          $scope.errors.other = 'Unable to save pid data';
          $scope.message = '';
          dialogs.error('Pid Record Not Created', 'An error occurred while creating the pid.');
        });
      }
    };

    /**
     * @name addPID
     * @desc Updates a records list of PIDs
     * @param {Form} form The HTML form object
     * @memberOf IVA.PidController
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

        // Make new PID document in PID collection
        $http.put
        (
          '/api/pid/func/' + $scope.currentItem._id,
          {
            desc: $scope.funcDesc,
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
          }).catch(function () {
            $scope.errors.other = 'unable to save changes to pid';
            $scope.message = '';
            dialogs.error('PID Record Not Updated', 'An error occurred while updating the collection.');
          });
      }
    };

    /**
     * @name editRecord
     * @desc Updates a record based on user input and returns to non-edit mode
     * @param {Form} form The HTML form object
     * @memberOf IVA.PidController
     */
    $scope.editRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.currentItem || $scope.currentItem._id === '') {
          return;
        }
      }

      $http.put('/api/pid/' + $scope.currentItem._id, {
        pid: $scope.currentItem.pid,
        network: $scope.currentItem.network,
      }).then(function() {
        $scope.message = 'Successfully Updated Item';
        $scope.inEditMode = false;
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to pid';
        $scope.message = '';
        dialogs.error('Pid Record Not Updated', 'An error occurred while updating the collection.');
      });
    };

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.PidController
     */
    $scope.deleteRecord = function(record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/pid/' + record._id, {
      }).then(function() {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/settings/pids/');
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to pid';
        $scope.message = '';
        dialogs.error('Pid Record Not Deleted', 'An error occurred while deleting the collection.');
      });
    };

    /**
     * @name requestDelete
     * @desc Requests the deletion of an item & forces the user to confirm before continuing
     * @param item The item to be deleted
     * @memberOf IVA.PidController
     */
    $scope.requestDelete = function(item) {
      var dlg = dialogs.confirm(
        'Delete PID ',
        'Are you certain you want to delete this PID? (' + item.name + ')');
      dlg.result.then(function(btn){
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(item);
        // here's where we actually delete the item
      },function(btn){
        // operation was cancelled. Continue on as if nothing happened.
      });
    }
  });


