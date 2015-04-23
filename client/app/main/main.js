'use strict';

angular.module('twilightvirtueApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true // force all access to be authenticated
      });
  });
