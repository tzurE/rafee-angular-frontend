angular.module(rafeeApp.moduleName).controller('BaseCtrl', ['$scope', function($scope){

	$scope.admin = function(){
		alert("admin page");
	};


}]);


angular.module(rafeeApp.moduleName).controller('LoginCtrl', ['$scope', 'AuthService',
		function ($scope, AuthService) {
	
	$scope.userName = "";
	$scope.password = "";
	$scope.doLogin = function(){
		$scope.loginErrorMessage = "";
		AuthService.authenticate($scope.userName, $scope.password, true, function(errorResponse){
			if(errorResponse.status == 400){
				$scope.loginErrorMessage = "";
				var errorsArr = [];
				if(errorResponse.data){
					for(var key in errorResponse.data){
						var val = errorResponse.data[key];
						if(val && val.length > 0){
							for(var i = 0; i < val.length; i++){
								errorsArr.push(val[i]);
//								foundErr = true;
//								$scope.loginErrorMessage += val[i];
//								if(i < val.length - 1 ){
//									$scope.loginErrorMessage += ", ";
//								}
							}
						}
					}
				}
				if(errorsArr == 0){
					$scope.loginErrorMessage = "Server error!";
				}else{
					$scope.loginErrorMessage = errorsArr.join(', ');
				}
//				if (errorResponse.data.non_field_errors[0])
//					$scope.loginErrorMessage = errorResponse.data.non_field_errors[0]; 
//				else 
//					$scope.loginErrorMessage = "Incorrect Username/Password Combination";
			}else{
				$scope.loginErrorMessage = "Server error!";
			}
		});
	};
	
}]);

angular.module(rafeeApp.moduleName).controller('AdminCtrl', ['$scope','Restangular','$mdDialog'  ,function($scope, Restangular, $mdDialog){

	$scope.users="";
	$scope.teams="";
	$scope.slideshows="";
	$scope.repositories="";

    Restangular.one('api/v1/users/').getList().then(function( users) {
         $scope.users = users;
    });
    Restangular.one('api/v1/teams/').getList().then(function( teams) {
         $scope.teams = teams;
    });  
    Restangular.one('api/v1/slideshows/').getList().then(function( slideshows) {
         $scope.slideshows = slideshows;
    });  
    Restangular.one('api/v1/repositories/').getList().then(function( repositories) {
         $scope.repositories = repositories;
    });  

    $scope.goToUser = function(user, event){
	    $mdDialog.show(
	      $mdDialog.alert()
	        .title('Username: ' + user.username)
	        .content('Teams: ' + user.teams[0])
	        .ariaLabel('User inspection')
	        .ok('Close')
	        .targetEvent(event)
	    );
    };
    $scope.goToTeam = function(team, event){
	    $mdDialog.show(
	      $mdDialog.alert()
	        .title('Team Name: ' + team.name)
	        .content('number of users: ' + team.users.length)
	        .ok('Close')
	        .targetEvent(event)
	    );
    };  

    $scope.delete = function(user, event){
    	alert('delete');
    };
}]);