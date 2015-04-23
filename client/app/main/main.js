'use strict';

angular.module('IVA_App')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true // force all access to be authenticated
      });
  });
