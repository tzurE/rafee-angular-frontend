angular.module(rafeeApp.moduleName).controller('PresentCtrl', ['$scope' ,'Restangular','DataService', '$timeout','$element', '$compile', function($scope, Restangular, DataService, $timeout, $element, $compile){

	//getting the slideshow id
	var slideshow = DataService.getSlideshow();
	var rendered_templates = [];
	var interval = 0;
	$scope.check=false;
	$scope.show = function(){
		//get the model of the slideshow from the REST
	    Restangular.one('api/v1/slideshows/' + slideshow+ '/').get().then(function(slides) {
	    	interval = slides.transition_interval;
	         var templates_array = slides.templates.split(",");
	         console.log(templates_array);
	         //render all the slides using the promise function
	         for(var i = 0; i < templates_array.length; i++){
		         DataService.renderTemplatePromise(templates_array[i]).then(function(res){
		         	// console.log(res);
		         	rendered_templates.push(res);


		         })
		     }
    		$timeout(function() {
    			//just checking if everything rendered. 5 secs is a lot. need to take it down.
				if(rendered_templates.length == templates_array.length){
					console.log("YES");
					$scope.beginShow();
					$scope.check=true;


				}
				else{
					console.log("async operation not finished in time")
				}
			}, 5000);		     

	    });
	};

	//replaces a current div, need a smarter way
	$scope.replace = function(replacement){
		var e = $element.find('div.replace');
		var element = $compile(replacement)($scope);
		
		e.replaceWith(element);		
	};

	$scope.beginShow = function(){
		//at this point, the array rendered_templates is full and ready to start the slideshow.

		//build the slideshow into a json
		slides_ready = [];
		for(var i=0; i < rendered_templates.length; i++){
			slides_ready.push({id: i, src: rendered_templates[i]});
		}
		console.log(slides_ready);
		var replacement = "<div ng-repeat=\"slide in slides_ready\" ng-if=\"isCurrentSlideIndex($index)\" ><m-custom-view m-template='{{slide.src}}'></m-custom-view></div>"
		$scope.slides_ready = slides_ready;		
		$scope.replace(replacement)
		loadSlides();


	};

	function setCurrentSlideIndex(index) {
        $scope.currentIndex = index;
    }

    function isCurrentSlideIndex(index) {
        return $scope.currentIndex == index;
    }

    function nextSlide() {
    	console.log("in nextSlide");
        $scope.currentIndex = ($scope.currentIndex < $scope.slides_ready.length - 1) ? ++$scope.currentIndex : 0;
        $timeout(nextSlide, interval);
    }

    function loadSlides() {
    	interval=interval*1000
        $timeout(nextSlide, interval);
    }
    
    $scope.currentIndex = 0;
    $scope.setCurrentSlideIndex = setCurrentSlideIndex;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;


}]);