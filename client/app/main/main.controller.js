'use strict';

angular.module('IVA_App')
  .controller('MainCtrl', function ($scope, $http) {

    // set up the menu data
    //$scope.menuData = menuData;



    //$scope.selectedIndex = 0;

    //$scope.select= function(index) {
    //  $scope.selectedIndex = index;
    //};

    // set up the page title and sub-title
    $scope.pageTitle = 'Operation Dashboard';
    $scope.pageSubTitle = 'sensor platform overview';

    // set up the breadcrumbs
    $scope.crumbs = [];
    $scope.crumbs.push(
      {title: 'Home', link: '/'}
    );


//    $scope.awesomeThings = [];


//    $http.get('/api/things').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
