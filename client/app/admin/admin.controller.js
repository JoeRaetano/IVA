'use strict';

angular.module('twilightvirtueApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // set up the page title and sub-title
    $scope.pageTitle = 'Administration';
    $scope.pageSubTitle = 'manage platform settings';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Administration', link: '/admin'}
    );




    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
