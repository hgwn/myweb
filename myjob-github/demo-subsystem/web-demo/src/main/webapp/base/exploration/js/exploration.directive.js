angular.module('masgetWebApp.exploration')
    .directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                $scope.aa={};
                if(attr.onFinishRenderFilters == "edit"){
                }
            }
        };
    })