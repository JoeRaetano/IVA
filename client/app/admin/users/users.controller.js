'use strict';

angular.module('IVA_App')
  .controller('AdminUsersCtrl', function ($scope, $http, Auth, User) {

    // set up the page title and sub-title
    $scope.pageTitle = 'User Administration';
    $scope.pageSubTitle = 'manage user settings';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Administration', link: '/admin'},
      {title: 'Users', link:'/admin/users'}
    );

  });
