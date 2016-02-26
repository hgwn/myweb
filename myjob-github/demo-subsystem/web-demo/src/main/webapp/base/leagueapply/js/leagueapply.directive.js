angular.module('masgetWebApp.leagueapply')
.directive('onFinishRenderFilters', function ($timeout, $q, $sce, utils, $state, $popover,$http) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
            if(attr.onFinishRenderFilters == "edit"){
                $scope.$watch('leagueapply.stationid',function(newOle,odl){
                    if(newOle != null){
                        $scope.$parent.leagueapply.staffid = "";
                        utils.query("/jsbweb/base/companystaff/get.do?companyid=" + $scope.$parent.leagueapply.appcompanyid +"&&stationid="+ $scope.$parent.leagueapply.stationid + "&&pageSize=100&&pageNum=1").then(function(resp){
                            $scope.StaffSData = resp.data.rows;
                        });
                    }
                })
            }
            $(window).resize(function () {
                $("#listModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                $("#platModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                $("#auditModel", element).css("height", (document.documentElement.clientHeight - 142) + "px");
            });
            $timeout(function(){
                $("#listModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                $("#platModel", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                $("#auditModel", element).css("height", (document.documentElement.clientHeight - 142) + "px");
            })
        }
    };
})