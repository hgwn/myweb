/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0MemberController', function($scope) {
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

    $scope.cancel_apply_by_owner=function(t0data)
    {
         var ok = window.confirm("你确认要撤销对" + applydata.applycompanyname + "的T+0申请？");
        if (ok)
        {
            $.ajax({
                url : './cancel_apply_by_owner.do',
                type : "post",
                dataType: 'json',
                cache : false,  
                data : {"applyloanconfigid":t0data.applyloanconfigid},
                success : function(oJson)
                {
                    if (oJson.ret == 0)
                    {
                        alert("申请撤销成功");
                        window.location="membert0.jsp";
                    }
                    else
                    {
                        alert("申请撤销失败");
                    }
                },
                error:function(xhr, optons, thrownError)
                {
                }
            });
        }
    }
});