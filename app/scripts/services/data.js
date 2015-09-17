rafeeApp.module.service('DataService', ['Restangular', '$timeout','$q' ,function(Restangular, $timeout, $q){

	var slideshow_ready = false;
	var template_ready = false;
	var num_templates = 0;

	rafeeApp.DataService = this;

	var ready_templates = [];
	var templates=[];
	var slideshows = [];
	this.storeTemplate = function(template){
		templates.push(template);

	}

	this.getTemplate = function(){
		return templates.pop();
	}

	this.storeSlideshow = function(slideshow){
		slideshows.push(slideshow);
	}

	this.getSlideshow = function(){
		return slideshows.pop();
	}

	this.renderTemplatePromise = function(template_name){
		this.renderTemplate(template_name);
		return $q(function(resolve, reject){
			setTimeout(function() {
			      if (template_ready) {
			        resolve(ready_templates.pop());
			      } else {
			        reject("not ready");
			      }
			    }, 3000);
		});			

	}

	this.renderTemplate = function(template_name) {
	    Restangular.all('api/v1/slide/').post({template_name : template_name}).then(function(task) {
	         Restangular.one('api/v1/tasks/'+ task.task+'/').get().then(function(rend){
		    	if(rend.status == "PENDING"){
		    		$timeout(function() {
						 return Restangular.one('api/v1/tasks/'+task.task+'/').get().then(function(rend){
							// console.log(rend.status)
							template_ready = true;
							ready_templates.push(rend.result);
						})
					}, 3000);
		    	}

		    	else{
		    		template_ready = true;
		    		ready_templates.push(rend.result);		    	
		    	}
		    });	         

	    });

	}

}]);
