angular.module(rafeeApp.moduleName).controller('AddCtrl', ['$scope','Restangular', '$state', '$window' , function($scope, Restangular, $state, $window){

	$scope.addUser = function(){
		alert("add user");
	};

	$scope.repo={}
	$scope.addRepo = function(){
		Restangular.all('api/v1/repositories/').post($scope.repo);
		$state.go('admin');
		$window.location.reload();
	};

	//the teams are pointless this time, so we assign all the slideshows to one team.
	$scope.slideshow={name: "", templates: "", transition_interval: "", caching_interval: "", team: "1"}
	$scope.addSlideshow = function(){
		//adding selection
		$scope.slideshow.templates=$scope.selectModel.toString();
		//console.log($scope.selectModel);
		Restangular.all('api/v1/slideshows/').post($scope.slideshow);		
		$state.go('admin');
		$window.location.reload();
	}

	Restangular.one('api/v1/templates/').getList().then(function( templates) {
         $scope.templates = templates;
    }); 


}]);