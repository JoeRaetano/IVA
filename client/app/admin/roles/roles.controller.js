'use strict';

angular.module('twilightvirtueApp')
  .controller('AdminRolesCtrl', function ($scope, $http, Auth, User) {

    // set up the page title and sub-title
    $scope.pageTitle = 'Role Administration';
    $scope.pageSubTitle = 'manage role settings';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Administration', link: '/admin'},
      {title: 'Roles', link:'/admin/roles'}
    );

  });
