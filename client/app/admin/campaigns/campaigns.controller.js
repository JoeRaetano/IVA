'use strict';

angular.module('twilightvirtueApp')
  .controller('AdminCampaignsCtrl', function ($scope, $http, Auth, User) {

    // set up the page title and sub-title
    $scope.pageTitle = 'Campaign Administration';
    $scope.pageSubTitle = 'manage campaign settings';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'},
      {title: 'Administration', link: '/admin'},
      {title: 'Campaigns', link:'/admin/campaigns'}
    );

  });
