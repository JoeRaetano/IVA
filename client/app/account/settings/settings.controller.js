'use strict';

angular.module('twilightvirtueApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    // general page initialization stuff
    $scope.errors = {};
    $scope.pageTitle = 'User Profile';
    $scope.pageSubTitle = 'manage your user profile';
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Account', link: '/account'},
      {title: 'Profile', link: '/account/settings'}
    );


    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
