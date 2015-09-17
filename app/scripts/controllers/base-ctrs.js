angular.module(rafeeApp.moduleName).controller('BaseCtrl', ['$scope', function($scope){


}]);

//Base controller for the app.

angular.module(rafeeApp.moduleName).controller('LoginCtrl', ['$scope', 'AuthService',
		function ($scope, AuthService) {
	//login sequence
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

//The controller for the admin panel. 
//each category gets populated using a REST call
angular.module(rafeeApp.moduleName).controller('AdminCtrl', ['$scope','Restangular','$mdDialog', '$window', '$state', 'DataService'  ,function($scope, Restangular, $mdDialog, $window, $state, DataService ){

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
    Restangular.one('api/v1/templates/').getList().then(function( templates) {
         $scope.templates = templates;
    });     

    //display some info on the user.
    //can be developed more, but do we really need this?
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

    //display some info on the team. 
    $scope.goToTeam = function(team, event){
	    $mdDialog.show(
	      $mdDialog.alert()
	        .title('Team Name: ' + team.name)
	        .content('number of users: ' + team.users.length)
	        .ok('Close')
	        .targetEvent(event)
	    );
    };  
    //generic delete function. can delete whatever it gets.
    $scope.delete = function(address ,opt, event){
    	Restangular.one('api/v1/'+address, opt.id+'/').remove();
    	$window.location.reload();
    };    
    //starts the preview part of the template
    $scope.preview = function(temp){
    	DataService.storeTemplate(temp);
    	// console.log(temp.name);
    	$state.go("admin-template-show");
    }


}]);