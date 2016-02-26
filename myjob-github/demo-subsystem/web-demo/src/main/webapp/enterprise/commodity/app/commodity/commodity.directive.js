angular.module('masgetWebApp.commodity')
    //该指令表示angularjs对页面进行处理后的操作,jQuery插件的操作一般放在此处进行处理
    .directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {

            }
        };
    })
;