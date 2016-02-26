/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0AccountController', function($scope) {
	$scope.t0data = {};
    
    window.onload=function()
    {
        // 获取所有的资方公司以及产品信息
        $scope.query_t0_account();
    }

    $scope.query_t0_account=function()
    {
        $.ajax({
            url : './ctrl_query_t0_account.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {},
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){ 
                        if (oJson.data.length > 0)
                        {                            
                            $scope.t0data = oJson.data[0];
                            if ($scope.t0data.execdate != '')
                            {
                                var temp = $scope.t0data.execdate.split(' ');
                                if (temp.length > 1)
                                {
                                    $scope.t0data.execdate = temp[0];
                                }
                            }
                        }
                    });
                }
            },
            error:function(xhr, optons, thrownError)
            {
            }
        });
    }
});