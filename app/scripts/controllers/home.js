angular.module(rafeeApp.moduleName).controller('HomeCtrl', ['$scope', 'Restangular', 'AuthService', 'DataService', function($scope, Restangular, AuthService, DataService){

    Restangular.all('api/v1/slideshows/').getList().then(function( slideshows) {
         $scope.slideshows = slideshows;
         // $scope.selectModel = slideshows.length > 0 ? slideshows[0] : null;
    });

    $scope.check = function(){
        if($scope.selectModel != undefined){
            return true;
        }
        else{
            return false
        }
    }

    $scope.logOut = function(){
    	AuthService.logOut(true);
    }

    $scope.present = function(){
    	DataService.storeSlideshow($scope.selectModel);
    	// DataService.storeSlideshow(slideshow);
    }
    
    $scope.getTemplatesSlideshow = function(){
        console.log($scope.selectModel);
        Restangular.one('api/v1/slideshows/' + $scope.selectModel+'/').get().then(function(slideshow){
            // str=slideshow.templates.split(',');
            $scope.templates = slideshow.templates.split(',');
            // console.log(str);
        });
    }

}]);

