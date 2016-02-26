angular.module('masgetWebApp.exploration')
    .controller('explorationCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout) {
            $scope.saas = {
                saasname:"",
                pubcompanyname:""
            }

            $scope.Check = function(){
                var obj = {};
                if($scope.saas.saasname != null && $scope.saas.saasname !=""){
                    obj.saasname = $scope.saas.saasname;
                }
                if($scope.saas.pubcompanyname != null && $scope.saas.pubcompanyname !=""){
                    obj.pubcompanyname = $scope.saas.pubcompanyname;
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
        }
    ])