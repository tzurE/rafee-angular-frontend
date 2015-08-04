var rafeeApp = (function(){
	var moduleName = 'rafeeApp';
	var r = {
	    module : angular.module(moduleName, ['restangular', 'ui.router', 
                                                 'ngMaterial', 'ngMdIcons']),
            applications : {},
            moduleName : moduleName,
            isBlockingUI : function(url){
                 return false;
            },
            baseBackendURL : '/',
            registerApplication : function(appId, appData){
				r.applications[appId] = appData;
			},
            laodRest : function(){
				var requestsNum = 0;
				angular.forEach(r.applications, function(app, appID){
					if(app.urlPrefix){
						r.module.factory(appID + 'RestService', ['Restangular', '$rootScope', function(Restangular, $rootScope) {
							return Restangular.withConfig(function(RestangularConfigurer) {
								RestangularConfigurer.setBaseUrl('/' + app.urlPrefix);
								RestangularConfigurer.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig){
								
									if (route == 'auth-token')
										return;
									headers['Content-Type'] = 'application/json';
									return {
							            element: element,
							            headers: rafeeApp.AuthService ? rafeeApp.AuthService.updateHeadrs(headers) : headers,
							            params: params,
							            httpConfig: httpConfig
							        };
								});
								
								///////////////
								
								RestangularConfigurer.addRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig){
									
									if(rafeeApp.isBlockingUI(url)){
										requestsNum++;
									}
									$rootScope.showLoadingOverlay = requestsNum > 0;
								});
								
								RestangularConfigurer.addResponseInterceptor(function(data,operation, what, url, response, deferred){
									if(rafeeApp.isBlockingUI(url)){
										requestsNum--;
									}
									if(requestsNum < 0){
										requestsNum = 0;
									}
									$rootScope.showLoadingOverlay = requestsNum > 0;
									return data;
								});
								
								RestangularConfigurer.setErrorInterceptor(function(response, deferred){
									
									if(response.status == 401){
										if(rafeeApp.AuthService){
											rafeeApp.AuthService.logOut(true);
										}
									}else{
										var errMsg = response && response.data && response.data.detail ? response.data.detail :
											  "Server error";
									}
									if(rafeeApp.isBlockingUI(response.config.url)){
										requestsNum--;
									}
									if(requestsNum < 0){
										requestsNum = 0;
									}
									$rootScope.showLoadingOverlay = requestsNum > 0;
									
								});
								
								//////////////////
								if(app.restCongig){
									app.restCongig(RestangularConfigurer);
								}
								
							});
						}]);
					}
				});
				
			}
	}
    return r;
})();

rafeeApp.module.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', '$compileProvider', '$httpProvider',
                       function($stateProvider, $urlRouterProvider, RestangularProvider, $compileProvider, $httpProvider) {

	
	
//	$httpProvider.interceptors.push('errorHttpInterceptor');
	
	$httpProvider.defaults.cache = false;
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
	
	RestangularProvider.setBaseUrl(rafeeApp.baseBackendURL);

	RestangularProvider.setResponseExtractor(function(response, operation) {

		var res = response;
		if (operation === 'getList') {
			if(!angular.isArray(res)){
				res = response.data;
			}
		}
		return res;
	});
	

	
	
	$urlRouterProvider.when("", "/");
	
	$urlRouterProvider.otherwise("/");
	


	var states = [];
	states.push({
		name: 'login', url : '/login',
		views: {
			'main@': { templateUrl: "views/login.html"},
		}});
	states.push({
		name: 'logout', url : '/logout',
		views: {
			controller : ['AuthService', function(AuthService){
				AuthService.logOut(true);
			}],
			'main@': { templateUrl: "views/login.html"},
		}});
	states.push({
		name: 'admin', url : '/admin',
		views: {
			controller: ['AdminCtrl'],
			'main@': { templateUrl: "views/core/admin.html"},
		}});	
	// states.push({
	// 	name: 'admin-add-repo', url : '/admin/addrepo',
	// 	views: {
	// 		controller: ['AdminCtrl'],
	// 		'main@': { templateUrl: "views/core/admin.html"},
	// 	}});
	states.push({ name: 'home', 
		url: '/',
		
		views: {
			'main@': { templateUrl: "views/core/home.html"},
			
		}});
	
	
	angular.forEach(states, function(state) { $stateProvider.state(state); });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob|):/);
}

]);



rafeeApp.module.run(['$state', 'Restangular', '$rootScope', 'AuthService',  '$timeout',  '$location', 
                    function($state, Restangular, $rootScope, AuthService,  $timeout,  $location ){
	
	
	
	var requestsNum = 0;
	
	

	
	
	Restangular.setErrorInterceptor(function(response, deferred){

                                                                        if(response.status == 401){
                                                                                if(rafeeApp.AuthService){
                                                                                        rafeeApp.AuthService.logOut(true);
                                                                                }
                                                                        }else{
                                                                                var errMsg = response && response.data && response.data.detail ? response.data.detail :
                                                                                          "Server error";
                                                                        }

                                                                });
	
	
	$rootScope.$on('$stateChangeStart', function (event, nextState, toParams, fromState, fromParams) {
		
		$timeout(function(){
			
			
		
	    if (nextState.name != 'login') {
	    	
	    	
			
			
	    	if(nextState.name){
	    		
	    		window.sessionStorage.setItem('appNextStateName', nextState.name);
				
				if(toParams){
					window.sessionStorage.setItem('appNextStateParams', angular.toJson(toParams));
				}
				
	    	}
	    	if(!AuthService.isAuthenticated()){
		        $rootScope.$broadcast('$stateChangeError');
		        event.preventDefault();
		        $state.go('login');
	    	}else{
	    		$rootScope.logedIn = true;    		
	    		if(nextState.name == 'currentApp' && !rafeeApp.applications[toParams.application]){
			        $rootScope.$broadcast('$stateChangeError');
			        event.preventDefault();
			        $state.go('pageNotFound');
	    		}
	    			
	    	}
	    	
	    	
	    }else{
	    	if(AuthService.isAuthenticated()){
	    		$rootScope.logedIn = true;	    		
	    		$rootScope.$broadcast('$stateChangeError');
		        event.preventDefault();
	    		$state.go('home');
	    	}
	    	
	    }
		});
	});
	
	Restangular.addFullRequestInterceptor(function (element, operation, route, url, headers, params, httpConfig){
		headers['Content-Type'] = 'application/json';
		
		return {
            element: element,
            headers: AuthService.updateHeadrs(headers),
            params: params,
            httpConfig: httpConfig
        };
	});
		

	
	
}]);


