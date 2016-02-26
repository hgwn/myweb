angular.module('masgetWebApp.home')
    .controller('findCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout) {
            $scope.saas = {
                saasname:"",
                pubcompanyname:"",
                saastypename:""
            }

            $scope.Check = function(){
                var obj = {};
                if($scope.saas.keyword != null && $scope.saas.keyword !=""){
                    obj.keyword = $scope.saas.keyword;
                }
                obj.pagenum = 1;
                obj.pagesize = 6;

                var data = {};
                data.data = JSON.stringify(obj);
                var url = "/jsbweb/base/SassController/find.do";
                utils.query(url,{method:'POST',data:data}).then(function(resp){
                    if(resp.ret == 0){
                        $scope.saasData = resp.data.rows;
                    }
                });
            }
            $scope.Check();

            $scope.$on("renderFinished", function (event, data) {
            })
        }
    ])