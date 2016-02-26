<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>支付流水</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <!-- using twitter bootstrap, but of course -->
    <link rel="stylesheet" type="text/css" href="../static/css/base/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="../static/js/plugins/jquery.plugins/jquery-ui/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="../static/js/plugins/jquery.plugins/pagination/pagetable.css">
    <link href="static/css/style.css" rel="stylesheet">
   
    <script src="../static/js/base/jquery/jquery.min.js"></script>
    <script src="../static/js/base/bootstrap/v3.3.4/js/bootstrap.js"></script>

    <!-- 基础框架，不能移动 -->
    <script src="../static/js/base/angularjs/v.1.3.15/angular.js"></script>
    <script src="../static/js/base/angularjs/v.1.3.15/angular-animate.js"></script>
    <script src="../static/js/base/angular-ui.router/angular-ui-router.js"></script>
    <script src="../static/js/base/angularjs/v.1.3.15/angular-messages.js"></script>

    <!--boostrap插件整合-->
    <script src="../static/js/base/angularstrap/angular-strap.js"></script>
    <script src="../static/js/base/angularstrap/angular-strap.tpl.js"></script>

    <script src="../static/js/plugins/jquery.plugins/pagination/jquery.pagination.js"></script>

    <!--自定义js文件-->
    <script src="static/js/publict0.js"></script>
    <script src="static/js/reportmontht0.js"></script>

    <style>
        #view_info_model {
            margin: 20px 20px 20px 20px; /* PLAY THE WITH THE VALUES TO SEE GET THE DESIRED EFFECT */
        }
    </style>
</head>
<body ng-controller="t0ReportController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />
            <div class="row">
                <div class="col-sm-3">
                    <div class="form-group" >
                        <label class="col-sm-6 control-label no-padding-right">{{params.year}}年月份</label>
                        <div class="col-sm-6">
                            <select class="form-control" ng-model="params.month" ng-options="option.id as option.name for option in options" ng-change="change_month()">
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <table class="table">
                    <thead>
                        <tr>
                          <th class="center" style="width: 120px;">清算日期</th>
                          <th class="center" style="width: 80px;">交易笔数</th>
                          <th class="center" style="width: 80px">刷卡金额</th>
                          <th class="center" style="width: 80px">入账金额</th>
                          <th class="center" style="width: 80px">一级分润</th>
                          <th class="center" style="width: 80px">上级应付</th>
                          <th class="center" style="width: 80px">上级分润</th>
                          <th class="center" style="width: 80px">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="reportdata in reportdatas">
                            <td>{{reportdata.settlementtime}}</td>
                            <td>{{reportdata.tran_count}}</td>
                            <td>{{reportdata.accountreceived}}</td>
                            <td>{{reportdata.actualcompanyreceived}}</td>
                            <td>{{reportdata.agentprofitfeetotal}}</td>
                            <td>{{reportdata.pmembersettlementfee}}</td>
                            <td>{{reportdata.pmemberprofit}}</td>
                            <td>
                                <span>
                                    <a href="" class="link_edit" ng-click="view_infos(reportdata)">详细</a>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td>合计</td>
                            <td>{{totals.tran_count}}</td>
                            <td>{{totals.accountreceived}}</td>
                            <td>{{totals.actualcompanyreceived}}</td>
                            <td>{{totals.agentprofitfeetotal}}</td>
                            <td>{{totals.pmembersettlementfee}}</td>
                            <td>{{totals.pmemberprofit}}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>                
            </div>
        </form>
    </div>
</body>
</html>