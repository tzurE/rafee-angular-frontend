angular.module(rafeeApp.moduleName).controller('TemplateCtrl', ['$scope' ,'Restangular','DataService', '$timeout','$element' ,function($scope, Restangular, DataService, $timeout, $element ){


	var template = DataService.getTemplate();

	$scope.hey = function(){
		DataService.renderTemplatePromise(template.name).then(function(result){
			$scope.replace(result)

		})
	    // Restangular.all('api/v1/slide/').post({template_name : template.name}).then(function(task) {
	    //      Restangular.one('api/v1/tasks/'+ task.task+'/').get().then(function(rend){
		   //  	if(rend.status == "PENDING"){
		   //  		$timeout(function() {
					// 	Restangular.one('api/v1/tasks/'+task.task+'/').get().then(function(rend){
					// 		$scope.replace(rend);
					// 	})
					// }, 4000);
		   //  	}

		   //  	else{
		   //  		$scope.replace(rend);
		   //  	}
		   //  });	         

	    // });
	};

	$scope.replace = function(result){
		var e = $element.find('div.replaceme');
		e.replaceWith(result);		
	};

}]);