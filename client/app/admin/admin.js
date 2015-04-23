'use strict';

angular.module('IVA_App')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/users', {
        templateUrl: 'app/admin/users/users.html',
        controller: 'AdminUsersCtrl',
        authenticate: true
      })
      .when('/admin/roles', {
        templateUrl: 'app/admin/roles/roles.html',
        controller: 'AdminRolesCtrl',
        authenticate: true
      })
      .when('/admin/campaigns', {
        templateUrl: 'app/admin/campaigns/campaigns.html',
        controller: 'AdminCampaignsCtrl',
        authenticate: true
      })
      .when('/admin/modes', {
        templateUrl: 'app/admin/modes/modes.html',
        controller: 'ModesController',
        authenticate: true
      })
      .when('/admin/modes/:id', {
        templateUrl: 'app/admin/modes/mode.html',
        controller: 'ModesController',
        authenticate: true
      })
      .when('/admin/roles', {
        templateUrl: 'app/admin/roles/roles.html',
        controller: 'AdminRolesCtrl',
        authenticate: true
      })
      .when('/admin', {
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl',
        authenticate: true
      });
  });
