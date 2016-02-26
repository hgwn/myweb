angular.module('masgetWebApp.vehicletype')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            $(window).resize(function () {
                $("#vehicleModel", element).css("height", (document.documentElement.clientHeight - 90) + "px");
            });
            $timeout(function(){
                $("#vehicleModel", element).css("height", (document.documentElement.clientHeight - 90) + "px");
            })
        }
    };
})