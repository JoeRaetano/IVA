/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * Collection Controller
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
      $http.get('/api/pid/' + currentId).success(function(collectionData) {
        $scope.currentItem = collectionData;
        $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/pids/' + currentId});
      });
    } else {
      $http.get('/api/pid').success(function(collectionData) {
        $scope.data = collectionData;
      });
    }


      /**
     * @name returnToList
     * @desc Returns the page back to the main/parent listing
     * @memberOf IVA.CollectionController
     */
    $scope.returnToList = function() {
      $location.path('/settings/pids/');
    };

    /**
     * @name goToRecordDetails
     * @desc Redirects to the record-level detail view
     * @param {String} id Id number of the record
     * @memberOf IVA.CollectionController
     */
    $scope.goToRecordDetails = function(id) {
      $location.path( '/settings/pids/' + id );
    };

    $scope.goToPIDDetails = function(id) {
      $location.path( '/settings/pids/' + $routeParams.id + "/" + id );
  /*    $http.get('/api/collection/' + $routeParams.id + '/' + id).success(function(collectionData) {
        $scope.currentItem = collectionData;
        $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/collections/' + $routeParams.id + '/' + id});*/
    };

    /**
     * @name toggleEditMode
     * @desc Flips edit mode on/off
     * @memberOf IVA.CollectionController
     */
    $scope.toggleEditMode = function(){
      $scope.inEditMode = $scope.inEditMode === false;
    };

    /**
     * @name addRecord
     * @desc Creates a new record based on user input
     * @param {Form} form The HTML form object
     * @memberOf IVA.CollectionController
     */
    $scope.addRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.vehicleMake || $scope.vehicleMake === '') {
          return;
        }

        $http.post('/api/collection', {
          make: $scope.vehicleMake,
          model: $scope.vehicleModel,
          year: $scope.vehicleYear,
          desc: $scope.collectionDesc,
          active: false
        }).then(function() {
          $scope.message = 'Data Collection Added';

          $http.get('/api/collection').success(function(collectionData) {
            $scope.data = collectionData;
          });

          $scope.vehicleMake = '';
          $scope.vehicleModel = '';
          $scope.vehicleYear = '';
          $scope.collectionDesc = '';
        }).catch(function() {
          // set invalid
          $scope.errors.other = 'Unable to save collection';
          $scope.message = '';
          dialogs.error('Collection Record Not Created', 'An error occurred while creating the collection.');
        });
      }
    };

    /**
     * @name addPID
     * @desc Updates a records list of PIDs
     * @param {Form} form The HTML form object
     * @memberOf IVA.CollectionController
     */
    $scope.addPid = function(form)
    {
      $scope.submitted = true;
      if(form.$valid)
      {
        if (!$scope.currentItem || $scope.currentItem._id === '')
        {
          return;
        }

        // Make new PID document in PID collection
        $http.post
        (
          '/api/pid',
          {
            pid: $scope.vehiclePid,
            network: $scope.vehicleNet
          }
        ).then(function()
        {
          // Add newly created PID document to the current vehicles list of PIDs
          $http.put
          (
            '/api/collection/' + $scope.currentItem._id,
            {
              pid_id:
              [
                {
                  pid: $scope.vehiclePid,
                  network: $scope.vehicleNet
                }
              ]
            }
          ).then(function ()
          {
            $scope.message = 'Successfully Updated Item';
            $scope.inEditMode = false;
            $http.get('/api/collection/'+ $scope.currentItem._id).success(function(collectionData)
            {
              $scope.currentItem = collectionData;
              $scope.vehiclePid = '';
              $scope.vehicleNet = '';
            });
          }).catch(function () {
            $scope.errors.other = 'unable to save changes to collection';
            $scope.message = '';
            dialogs.error('Collection Record Not Updated', 'An error occurred while updating the collection.');
          });
        });
      }
    };

    /**
     * @name editRecord
     * @desc Updates a record based on user input and returns to non-edit mode
     * @param {Form} form The HTML form object
     * @memberOf IVA.CollectionController
     */
    $scope.editRecord = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.currentItem || $scope.currentItem._id === '') {
          return;
        }
      }

      $http.put('/api/collection/' + $scope.currentItem._id, {
        make: $scope.currentItem.make,
        model: $scope.currentItem.model,
        year: $scope.currentItem.year,
        desc: $scope.currentItem.desc,
        active: $scope.currentItem.active
      }).then(function() {
        $scope.message = 'Successfully Updated Item';
        $scope.inEditMode = false;
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to collection';
        $scope.message = '';
        dialogs.error('Collection Record Not Updated', 'An error occurred while updating the collection.');
      });
    };

    /**
     * @name deleteRecord
     * @desc Deletes a record
     * @param record The record to delete
     * @memberOf IVA.CollectionController
     */
    $scope.deleteRecord = function(record) {
      if (!record || record._id === '') {
        return;
      }

      $http.delete('/api/collection/' + record._id, {
      }).then(function() {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/settings/collections/');
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to collection mode';
        $scope.message = '';
        dialogs.error('Collection Record Not Deleted', 'An error occurred while deleting the collection.');
      });
    };

    /**
     * @name requestDelete
     * @desc Requests the deletion of an item & forces the user to confirm before continuing
     * @param item The item to be deleted
     * @memberOf IVA.CollectionController
     */
    $scope.requestDelete = function(item) {
      var dlg = dialogs.confirm(
        'Delete Collection Mode',
        'Are you certain you want to delete this collection mode? (' + item.name + ')');
      dlg.result.then(function(btn){
        $scope.confirmed = 'You thought this quite awesome!';
        $scope.deleteRecord(item);
        // here's where we actually delete the item
      },function(btn){
        // operation was cancelled. Continue on as if nothing happened.
      });
    }
  });


