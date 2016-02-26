angular.module('masgetWebApp.datum')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http,Upload) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	
            $('#comtree').combotree({data:$scope.plData});
            if(attr.onFinishRenderFilters == "editStaff"){
                $scope.$watch('files', function () {
                	$scope.upload($scope.files);
            	});
            }

            $(window).resize(function () {
                $("#staffModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            });
            $timeout(function(){
                $("#staffModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            })
        }
    };
})