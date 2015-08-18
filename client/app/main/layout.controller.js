'use strict';

//
// this controller is for handling the main layout and general menu items that aren't covered by the
// views and their respective controllers.
//
angular.module('IVA_App')
  .controller('LayoutCtrl', function ($scope, $http, $location, Auth) {

    $scope.$location = $location;
    $scope.selected = null;

    $scope.isCollapsed = false;

    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.profile = function() {
      $location.path('/account/settings');
    };



    $scope.toggleCollapsed = function(){
      $scope.isCollapsed = $scope.isCollapsed === false;
      $('body').toggleClass('sidebar-collapse');
      $('body').toggleClass('sidebar-open');
      //if ($scope.isCollapsed) {
      //  $('body').toggleClass('sidebar-collapse');
      //} else {
      //  $('body').toggleClass('sidebar-open');
      //}

    };

    // set up the menu data
    $scope.menuData = [
      {display:'Dashboard', link:'/home', path:'/home', icon:'fa fa-dashboard'},
      {display:'User Settings', link:'#', path:'/settings', icon:'fa fa-sliders', children: [
        {display:'Profile', link:'/account/settings', path:'/account/settings', icon:'glyphicon glyphicon-cog'},
        {display:'Devices', link:'/settings/devices', path:'/settings/devices', icon:'fa fa-plug'},
        {display:'Sensors', link:'/settings/sensors', path:'/settings/sensors', icon:'fa fa-signal'},
        {display:'Vehicles', link:'/settings/vehicles', path:'/settings/vehicles', icon:'fa fa-database'},
        {display:'Pids', link:'/settings/pids', path:'/settings/pids', icon:'fa fa-database'},
        {display:'Functions', link:'/settings/functions', path:'/settings/functions', icon:'fa fa-database'}
      ]},
      {display:'Administration', link:'#', path: '/admin', icon:'fa fa-cogs', children: [
        {display:'Users', link:'/admin/users', path:'/admin/users', icon:'fa fa-users'},
        {display:'Roles', link:'/admin/roles', path:'/admin/roles'},
        {display:'Campaigns', link:'/admin/campaigns', path:'/admin/campaigns'},
        {display:'Modes', link:'/admin/modes', path:'/admin/modes'},
        {display:'Data Types', link:'/admin/datatypes', path:'/admin/datatypes'}
      ]}
    ];

    $scope.select= function(item) {
      $scope.selected = item;
    };

    $scope.isActive = function(item) {
      if ($location.path().indexOf(item.path) === 0) {
        return true;
      }
      else if (item === $scope.selected) {
        return true;
      }
      else if ($location.path() === '/' && item.path === '/home') {
        return true;
      }
      else {
        return false;
      }
    };
  });
