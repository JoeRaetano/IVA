/**
 * Created by jrs on 4/23/15.
 */
'use strict';

/**
 * Collection Controller
 * @namespace IVA.CollectionController
 */
angular.module('IVA_App')
  .controller('CollectionController', function ($scope, $http, Auth, $location, $routeParams, dialogs) {

    // general page initialization stuff
    $scope.errors = {};
    $scope.pageTitle = 'Collection Management';
    $scope.pageSubTitle = 'manage data collection';
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Collections', link: '/settings/collections'}
    );
    $scope.data = [];
    $scope.currentItem = null;
    $scope.inEditMode = false;

    // attempt to get the ID from the route params
    var currentId = $routeParams.id;

    // let's get the data from the database - we will either get all of the records or just
    // the individual based on if we are on the list or detail page
    if (currentId) {
      $http.get('/api/collection/' + currentId).success(function(modeData) {
        $scope.currentItem = modeData;
        $scope.crumbs.push({title: $scope.currentItem.name, link:'/settings/collection/' + currentId});
      });
    } else {
      $http.get('/api/collection').success(function(modeData) {
        $scope.data = modeData;
      });
    }

    /**
     * @name returnToList
     * @desc Returns the page back to the main/parent listing
     * @memberOf IVA.CollectionController
     */
    $scope.returnToList = function() {
      $location.path('/settings/collection/');
    };

    /**
     * @name goToRecordDetails
     * @desc Redirects to the record-level detail view
     * @param {String} id Id number of the record
     * @memberOf IVA.CollectionController
     */
    $scope.goToRecordDetails = function(id) {
      $location.path( '/settings/collection/' + id );
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
        if (!$scope.modeName || $scope.modeName === '') {
          return;
        }

        $http.post('/api/modes', {
          name: $scope.modeName,
          desc: $scope.modeDesc,
          active: false
        }).then(function() {
          $scope.message = 'Data Collection Mode Added';
          $scope.data.push({
            name: $scope.modeName,
            desc: $scope.modeDesc
          });
          $scope.modeName = '';
          $scope.modeDesc = '';
        }).catch(function() {
          // set invalid
          $scope.errors.other = 'Unable to save collection mode';
          $scope.message = '';
          dialogs.error('Record Not Created', 'An error occurred while creating the collection mode.');
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

      $http.put('/api/modes/' + $scope.currentItem._id, {
        name: $scope.currentItem.name,
        desc: $scope.currentItem.desc,
        active: $scope.currentItem.active
      }).then(function() {
        $scope.message = 'Successfully Updated Item';
        $scope.inEditMode = false;
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to collection mode';
        $scope.message = '';
        dialogs.error('Record Not Updated', 'An error occurred while updating the collection mode.');
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

      $http.delete('/api/modeasds/' + record._id, {
      }).then(function() {
        $scope.message = 'Successfully deleted Item';
        $scope.inEditMode = false;
        $location.path('/admin/modes/');
      }).catch(function() {
        $scope.errors.other = 'unable to save changes to collection mode';
        $scope.message = '';
        dialogs.error('Record Not Deleted', 'An error occurred while deleting the collection mode.');
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


