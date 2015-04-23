'use strict';

angular.module('twilightvirtueApp')
  .controller('DevicesCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    // set up the page title and sub-title
    $scope.pageTitle = 'Device Management';
    $scope.pageSubTitle = 'Manage device configuration settings';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Devices', link: '/settings/devices'}
    );



    //$scope.changePassword = function(form) {
    //  $scope.submitted = true;
    //  if(form.$valid) {
    //    Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
    //      .then( function() {
    //        $scope.message = 'Password successfully changed.';
    //      })
    //      .catch( function() {
    //        form.password.$setValidity('mongoose', false);
    //        $scope.errors.other = 'Incorrect password';
    //        $scope.message = '';
    //      });
    //  }
    //};
  });
