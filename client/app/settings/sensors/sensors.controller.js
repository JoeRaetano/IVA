'use strict';

angular.module('twilightvirtueApp')
  .controller('SensorsController', function ($scope, $http, Auth) {
    $scope.errors = {};

    // set up the page title and sub-title
    $scope.pageTitle = 'Sensor Management';
    $scope.pageSubTitle = 'manage sensor definitions';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Settings', link: '/settings'},
      {title: 'Sensors', link: '/settings/sensors'}
    );

    // let's get the data from the database
    $scope.data = [];

    $http.get('/api/sensors').success(function(sensorData) {
      $scope.data = sensorData;
    });


    //$scope.data = [
    //  {id: 34, name:'GPS', desc:'Standard USB GPS Receiver'},
    //  {id: 46, name:'Thermometer', desc:'High-temp thermometer (90F - 180F)'},
    //  {id: 78, name:'Pressure Sensor', desc:'Binary flag - indicates if anything is on the sensor or not'},
    //  {id: 64, name:'Ambient Light', desc:'Measures the level of the ambient light'},
    //  {id: 37, name:'Proximity', desc:'Indicates if anything is within a certain distance of the sensor'},
    //  {id: 26, name:'Camera', desc:'Standard USB web cam'},
    //  {id: 29, name:'Moisture', desc:'Binary flag - indicates if the sensor is exposed to water'},
    //  {id: 33, name:'Audio', desc:'Standard Audio Sensor'}
    //];


    $scope.addSensor = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        if (!$scope.sensorName || $scope.sensorName === '') {
          return;
        }

        $http.post('/api/sensors', {
          name: $scope.sensorName,
          desc: $scope.sensorDesc,
          active: false
        }).then(function() {
          $scope.message = 'Sensor Added';
          $scope.data.push({
            name: $scope.sensorName,
            desc: $scope.sensorDesc
          });
          $scope.sensorName = '';
          $scope.sensorDesc = '';
        })
          .catch(function() {
            // set invalid
            $scope.errors.other = 'Unable to save sensor';
            $scope.message = '';
          });
      }
    };




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
