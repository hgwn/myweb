/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0ReportController', function($scope) {

    // 主要用于查询
    $scope.params = {"month":1, "year":2015};
    $scope.options = [];
    $scope.reportdatas = [];
    $scope.companytype = 0;
    $scope.totals = {"tran_count":0, "accountreceived":0, "actualcompanyreceived":0, "agentprofitfeetotal":0, "pmembersettlementfee":0, "pmemberprofit":0};

    window.onload=function()
    {
        var curDate = new Date();
        $scope.options = new Array();
        for (var i = 1; i <= curDate.getMonth() + 1; i++)
        {
            var sName = '' + i + '月';            
            $scope.$apply(function(){ 
                $scope.options.push({"id":i, "name":sName});
            });
        }

        $scope.$apply(function(){
            $scope.params.year = curDate.getFullYear();
            $scope.params.month = curDate.getMonth() + 1;
        });

        $scope.query_month_dates($scope.params.year, $scope.params.month);
    }

    $scope.change_month = function()
    {
        // 查询$scope.params.month的记录
        $scope.query_month_dates($scope.params.year, $scope.params.month);
    }

    $scope.query_month_dates=function(report_year, report_month)
    {
        var sBegintime = getMonthStartDate(report_year, report_month);
        var sEndtime = getMonthEndDate(report_year, report_month);

        // alert("begintime=" + sBegintime + ", endtime=" + sEndtime);

        $.ajax({
            url : './ctrl_query_report_month.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "begintime":sBegintime,
                "endtime":sEndtime
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){
                        if ($scope.companytype <= 0) $scope.companytype = oJson.companytype;
                        $scope.reportdatas = oJson.data;

                        $scope.totals.tran_count = 0;
                        $scope.totals.accountreceived = 0;
                        $scope.totals.actualcompanyreceived = 0;
                        $scope.totals.agentprofitfeetotal = 0;
                        $scope.totals.pmembersettlementfee = 0;
                        $scope.totals.pmemberprofit = 0;

                        for (var i = 0; i < oJson.data.length; i++)
                        {
                            $scope.totals.tran_count += oJson.data[i].tran_count;
                            $scope.totals.accountreceived += oJson.data[i].accountreceived;
                            $scope.totals.actualcompanyreceived += oJson.data[i].actualcompanyreceived;
                            $scope.totals.agentprofitfeetotal += oJson.data[i].agentprofitfeetotal;
                            $scope.totals.pmembersettlementfee += oJson.data[i].pmembersettlementfee;
                            $scope.totals.pmemberprofit += oJson.data[i].pmemberprofit;
                        }
                    });
                }
                else
                {
                    alert("获取数据失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    // 查看选择日期的流水详情
    $scope.view_infos=function(reportdata)
    {
        var arrData = reportdata.settlementtime.split(" ");
        if (arrData.length > 0)
        {
            var sDate = trim_all(arrData[0]);
            window.location = "reportdayt0.jsp?companytype=" + $scope.companytype + "&querydate=" + sDate;
        }
    }
});
