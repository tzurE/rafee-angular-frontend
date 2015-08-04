/**
 *  Authentication service.
 */

rafeeApp.module.service('AuthService', ['Restangular', '$state', '$rootScope', '$location', '$timeout', function(Restangular, $state, $rootScope, $location, $timeout){
	/**
	 * Checks whether authentication is performed.
	 */
	
	rafeeApp.AuthService = this;
	
	this.isAuthenticated = function(doNotUpdateActivity){
		this.updateActivity(doNotUpdateActivity);
		var token = window.sessionStorage.getItem('loggedInUserToken');
		return !!token;
	};
	
	this.getLogedinUsername = function(){
		return window.sessionStorage.getItem('loggedInUserName');
	};
	
	var that = this;
	/**
	 * Parameters :
	 * 	username, password 
	 * redirectToPage - boolean ,if true will try to redirect to previous view.
	 */
	this.authenticate = function(username, password, redirectToPage, onError){
		Restangular.all('api/v1/auth-token').post(  {
			username : username,
			password : password
		},{}, {'Cache-Control' : 'no-cache, no-store, must-revalidate'}).then(function(resp){
			if(!resp.token){
				that.logOut();
				return;
			}
			window.sessionStorage.setItem('loggedInUserToken', resp.token);
			window.sessionStorage.setItem('loggedInUserName', username);
			var timestamp = new Date().getTime();
			window.sessionStorage.setItem('LastActivity', timestamp);			
			if(redirectToPage){
				var savedStateName = window.sessionStorage.getItem('appNextStateName');
				var paramsStr = window.sessionStorage.getItem('appNextStateParams');
				
				if(savedStateName){
					$state.go(savedStateName, angular.fromJson(paramsStr));
				}else{
					$state.go('home');
				}
				
			}
			
			
			
		}, function(response){
			alert(JSON.stringify(response));
			if(onError){
				onError(response)
			}
			
		});
	};
	/**
	 * Performs logout action.
	 * If redirectToLogin is true. will redirect to the login screen.
	 */
	this.logOut = function(redirectToLogin){
		window.sessionStorage.removeItem('loggedInUserToken');
		window.sessionStorage.removeItem('loggedInUserName');
		window.sessionStorage.removeItem('LastActivity');
		$rootScope.logedIn = false;
		rafeeApp.isDataLoaded = false;
		if(redirectToLogin){
			$state.go('login');
		}
	}
	/**
	 * Updates http headers
	 */
	this.updateHeadrs = function(headers, doNotUpdateActivity){
		var token = window.sessionStorage.getItem('loggedInUserToken');
		
		if(!this.updateActivity(doNotUpdateActivity)){
			return;
		}
		
		headers['Authorization'] = 'JWT ' + token;
		headers['Cache-Control']= 'no-cache, no-store, must-revalidate';
		return headers;
	}


	//TODO: probably not used	
	this.updateActivity = function(doNotUpdateActivity){
		var timestamp = new Date().getTime();
		var lastActivity = window.sessionStorage.getItem('LastActivity');
		if (lastActivity){
		}
		if(doNotUpdateActivity){
			return;
		}
		window.sessionStorage.setItem('LastActivity', timestamp);
		
		return true;
	};
}]);

