angular.module('masgetWebApp.companyInfo')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http,Upload) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if(attr.onFinishRenderFilters == "editCompany"){
    	   		$scope.$watch('files', function () {
 	                $scope.upload($scope.files);
	 	       	});
	 	   	}

			$(window).resize(function () {
				$("#companyModel", element).css("height", (document.documentElement.clientHeight - 75) + "px");
			});
			$timeout(function(){
				$("#companyModel", element).css("height", (document.documentElement.clientHeight - 75) + "px");
			})

        }
    };
})