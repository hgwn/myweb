angular.module('masgetWebApp.Faccount')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {

        	if (attr.onFinishRenderFilters == "check"){
                $(window).resize(function () {
                    $("#listModel", element).css("height", (document.documentElement.clientHeight - 70) + "px");
                    if($scope.payFlag){
                        $("#IncomeModel", element).css("height", (document.documentElement.clientHeight - 105) + "px");
                    }else{
                        $("#IncomeModel", element).css("height", (document.documentElement.clientHeight - 65) + "px");
                    }
                });
                $timeout(function(){
                    $("#listModel", element).css("height", (document.documentElement.clientHeight - 70) + "px");
                    if($scope.payFlag){
                        $("#IncomeModel", element).css("height", (document.documentElement.clientHeight - 105) + "px");
                    }else{
                        $("#IncomeModel", element).css("height", (document.documentElement.clientHeight - 65) + "px");
                    }
                })
    		}
        }
    };
})