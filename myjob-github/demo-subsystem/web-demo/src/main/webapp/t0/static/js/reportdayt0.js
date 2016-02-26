/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0ReportdayController', function($scope) {

    // 主要用于查询
    $scope.params = {"companytype":0, "querydate":"", "pmembername":"", "membername":"", "orderno":"", "unionpaydealid":"", "terminal":""};
    $scope.options = [];
    $scope.paymentjournal_datas = [];
    $scope.counts_per_page = 50;
    
    window.onload=function()
    {
        // 获取公司类型
        $scope.params.companytype = get_value("idcompanytype");
        $scope.params.querydate = get_value("iddate");

        $scope.$apply(function(){
            $scope.params.begintime = $scope.params.querydate;
            $scope.params.endtime = $scope.params.querydate;
        });

        $scope.query_datas_counts();
    }

    // 点击按钮查询流水记录
    $scope.query_paymentjournal = function()
    {
        $scope.query_datas_counts();
    }

    $scope.query_datas=function(nPageIndex, nCountsPerPage)
    {
        var sBegintime = "";
        var sEndtime = "";

        if ($scope.params.querydate != '')
        {
            sBegintime = $scope.params.begintime + " 00:00:00";
            sEndtime = $scope.params.endtime + " 23:59:59";
        }

        $.ajax({
            url : './ctrl_query_paymentjournal.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "pmembername":$scope.params.pmembername,
                "membername":$scope.params.membername,
                "orderno":$scope.params.orderno,
                "unionpaydealid":$scope.params.unionpaydealid,
                "terminal":$scope.params.terminal,
                "begintime":sBegintime,
                "endtime":sEndtime,
                "pagenum":nPageIndex,
                "pagesize":nCountsPerPage
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){
                        $scope.paymentjournal_datas = oJson.data.rows;
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.query_datas_counts=function()
    {
        var sBegintime = "";
        var sEndtime = "";

        if ($scope.params.querydate != '')
        {
            sBegintime = $scope.params.begintime + " 00:00:00";
            sEndtime = $scope.params.endtime + " 23:59:59";
        }

        $.ajax({
            url : './ctrl_query_paymentjournal_counts.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "pmembername":$scope.params.pmembername,
                "membername":$scope.params.membername,
                "orderno":$scope.params.orderno,
                "unionpaydealid":$scope.params.unionpaydealid,
                "terminal":$scope.params.terminal,
                "begintime":sBegintime,
                "endtime":sEndtime
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $('#pagination').pagination(oJson.total, {
                        current_page : 0,
                        items_per_page : $scope.counts_per_page,
                        num_display_entries:10,
                        callback : function(page_id){
                            $scope.query_datas(Number(page_id) + 1, $scope.counts_per_page);
                        },
                        load_first_page : true,
                        prev_text : '上一页',
                        next_text : '下一页'
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.back_month = function()
    {
        window.location = "reportmonth.jsp";
    }
});
