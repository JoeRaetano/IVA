/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * Pid Controller
 * @namespace IVA.PidController
 */
angular.module('IVA_App')
  .controller('FunctionController', function ($scope, $http, Auth, $location, $routeParams, dialogs) {

    // General page initialization stuff
    $scope.errors = {};
    $scope.pageTitle = 'Function Management';
    $scope.pageSubTitle = 'manage function data';
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Function', link: '/settings/functions'}
    );
    $scope.data = [];
    $scope.currentItem = null;
    $scope.inEditMode = false;

    // Attempt to get the ID from the route params
    var currentId = $routeParams.id;

    // If there is an ID
    if (currentId) {
      $http.get('/api/function/' + currentId).success(function(collectionData) {
        $scope.currentItem = collectionData;
        $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/functions/' + currentId});
      });
    } else {
      $http.get('/api/function').success(function(collectionData) {
        $scope.data = collectionData;
      });
    }


      /**
     * @name returnToList
     * @desc Returns the page back to the main/parent listing
     * @memberOf IVA.CollectionController
     */
    $scope.returnToList = function() {
      $location.path('/settings/functions/');
    };

    /**
     * @name goToRecordDetails
     * @desc Redirects to the record-level detail view
     * @param {String} id Id number of the record
     * @memberOf IVA.CollectionController
     */
    $scope.goToRecordDetails = function(id) {
      $location.path( '/settings/functions/' + id );
    };

    $scope.goToEditRecord = function(id) {
      $location.path( '/settings/functions/edit/' + id );
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
        if (!$scope.funcDesc || $scope.funcDesc === '') {
          return;
        }

        $http.post('/api/function', {
          desc: $scope.funcDesc,
          bytes: $scope.funcBytes
        }).then(function() {
          $scope.message = 'Function Data Added';

          $http.get('/api/function').success(function(collectionData) {
            $scope.data = collectionData;
          });

          $scope.funcDesc = '';
          $scope.funcBytes = '';
        }).catch(function() {
          // set invalid
          $scope.errors.other = 'Unable to save collection';
          $scope.message = '';
          dialogs.error('Collection Record Not Created', 'An error occurred while creating the collection.');
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

      $http.put('/api/function/' + $scope.currentItem._id, {
        desc: $scope.currentItem.desc,
        bytes: $scope.currentItem.bytes
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

      $http.delete('/api/function/' + record._id, {
      }).then(function() {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/settings/functions/');
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


