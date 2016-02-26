/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0SearchController', function($scope) {
	$scope.t0datas = [];
    
    window.onload=function()
    {
        // 获取所有的资方公司以及产品信息
        $scope.query_financingproduct();
    }

    $scope.query_financingproduct=function()
    {
        $.ajax({
            url : './ctrl_query_financingproduct.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {},
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){ 
                        $scope.t0datas = jQuery.parseJSON(oJson.t0product); 
                    });
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.request_infos=function(t0data)
    {
        window.location = "applyt0.jsp?financingproductid=" + t0data.financingproductid;
    }
});