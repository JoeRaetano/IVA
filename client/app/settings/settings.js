'use strict';

angular.module('IVA_App')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/settings/devices', {
        templateUrl: 'app/settings/devices/devices.html',
        controller: 'DevicesCtrl',
        authenticate: true
      })
      .when('/settings/sensors', {
        templateUrl: 'app/settings/sensors/sensors.html',
        controller: 'SensorsController',
        authenticate: true
      })
      .when('/settings/sensors/:id', {
        templateUrl: 'app/settings/sensors/sensor.html',
        controller: 'SensorsController',
        authenticate: true
      })
      .when('/settings/vehicles', {
        templateUrl: 'app/settings/vehicles/vehicles.html',
        controller: 'VehicleController',
        authenticate: true
      })
      .when('/settings/vehicles/:id', {
        templateUrl: 'app/settings/vehicles/vehicle.html',
        controller: 'VehicleController',
        authenticate: true
      })
      .when('/settings/vehicles/edit/:id', {
        templateUrl: 'app/settings/vehicles/edit_vehicle.html',
        controller: 'VehicleController',
        authenticate: true
      })
      .when('/settings/pids', {
        templateUrl: 'app/settings/pids/pids.html',
        controller: 'PidController',
        authenticate: true
      })
      .when('/settings/pids/:id', {
        templateUrl: 'app/settings/pids/pid.html',
        controller: 'PidController',
        authenticate: true
      })
      .when('/settings/pids/edit/:id', {
        templateUrl: 'app/settings/pids/edit_pid.html',
        controller: 'PidController',
        authenticate: true
      })
      .when('/settings/functions', {
        templateUrl: 'app/settings/functions/functions.html',
        controller: 'FunctionController',
        authenticate: true
      })
      .when('/settings/functions/:id', {
        templateUrl: 'app/settings/functions/function.html',
        controller: 'FunctionController',
        authenticate: true
      })
      .when('/settings/functions/edit/:id', {
        templateUrl: 'app/settings/functions/edit_function.html',
        controller: 'FunctionController',
        authenticate: true
      })
      .when('/settings', {
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });





//$stateProvider.state('posts', {
//  url: '/posts/{id}',
//  templateUrl: '/posts.html',
//  controller: 'PostsCtrl',
//  resolve: {
//    post: ['$stateParams', 'posts', function($stateParams, posts) {
//      return posts.get($stateParams.id);
//    }]
//  }
