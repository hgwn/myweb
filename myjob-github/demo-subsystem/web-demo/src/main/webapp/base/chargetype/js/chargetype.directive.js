angular.module('masgetWebApp.chargetype')
    .directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                if(attr.onFinishRenderFilters == "chargetype"){
                    $scope.$watch('chargetype.basechargetypeid', function () {
                        if($scope.type == "add"){
                            angular.forEach($scope.notuse,function(item,key){
                                if($scope.chargetype.basechargetypeid == item.basechargetypeid){
                                    $scope.$parent.chargetype = angular.extend({},$scope.chargetype,item);
                                }
                            })
                        }
                    });
                }else{
                    $(window).resize(function () {
                        $("#LchargeModel", element).css("height", (document.documentElement.clientHeight - 80) + "px");
                    });
                    $timeout(function(){
                        $("#LchargeModel", element).css("height", (document.documentElement.clientHeight - 80) + "px");
                    })
                }
            }
        };
    })