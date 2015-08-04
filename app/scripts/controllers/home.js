angular.module(rafeeApp.moduleName).controller('HomeCtrl', ['$scope', 'Restangular', function($scope, Restangular){

    Restangular.all('api/v1/slideshows/').getList().then(function( slideshows) {
         $scope.slideshows = slideshows;
         $scope.selectModel = slideshows.length > 0 ? slideshows[0] : null;
    });

}]);

