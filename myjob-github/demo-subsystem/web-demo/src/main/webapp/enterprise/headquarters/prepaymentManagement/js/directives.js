angular.module('masgetWebApp.Prepayment')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {

        	if (attr.onFinishRenderFilters == "check"){
                $(window).resize(function () {
                    $("#listModel", element).css("height", (document.documentElement.clientHeight - 170) + "px");
                    $("#redetailtModel", element).css("height", (document.documentElement.clientHeight - 74) + "px");
                });
                $timeout(function(){
                    $("#listModel", element).css("height", (document.documentElement.clientHeight - 170) + "px");
                    $("#orderModel", element).css("height", (document.documentElement.clientHeight - 74) + "px");
                    $("#redetailtModel", element).css("height", (document.documentElement.clientHeight - 74) + "px");
                })
    		}
        }
    };
})