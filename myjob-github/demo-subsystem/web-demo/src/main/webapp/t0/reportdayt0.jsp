<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%
    String server_companytype = request.getParameter("companytype");
    if (server_companytype == null) server_companytype = "0";
    if (server_companytype == "") server_companytype = "0";

    String server_date = request.getParameter("querydate");
    if (server_date == null) server_date = "";
%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>每月交易流水</title>
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
    <script src="static/js/reportdayt0.js"></script>

    <style>
        #view_info_model {
            margin: 20px 20px 20px 20px; /* PLAY THE WITH THE VALUES TO SEE GET THE DESIRED EFFECT */
        }
    </style>
</head>
<body ng-controller="t0ReportdayController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />
            <input type="hidden" id="idcompanytype" value="<%= server_companytype %>"></input>
            <input type="hidden" id="iddate" value="<%= server_date %>"></input>
            <div class="row">
                <div class="col-sm-11">
                    <div class = "row" ng-show="(companytype-1) * (companytype-5) == 0">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="col-sm-5 control-label no-padding-right">服务商</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.pmembername" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="col-sm-5 control-label no-padding-right">商户</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.membername" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class = "row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="col-sm-5 control-label no-padding-right">单号</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.orderno" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="col-sm-5 control-label no-padding-right">流水号</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.unionpaydealid" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="col-sm-5 control-label no-padding-right">终端号</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.terminal" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row" ng-show="params.querydate==''">
                        <div class="col-sm-4" >
                            <div class="form-group" >
                                <label class="col-sm-5 control-label no-padding-right">起始日期</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.begintime" placeholder="格式：2015-06-01" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>

                        <div class="col-sm-4">
                            <div class="form-group" >
                                <label class="col-sm-5 control-label no-padding-right">结束日期</label>
                                <div class="col-sm-7">
                                    <input type="text" ng-model="params.endtime" placeholder="格式：2015-06-01" class="form-control col-sm-12" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-sm-1">
                    <button class="btn btn-primary" ng-click="query_paymentjournal()" >
                        <span class="glyphicon glyphicon-ok"></span>
                        查询
                    </button>
                </div>
            </div>

            <div class="row">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">序号</th>
                            <th ng-if="(companytype-1) * (companytype-5) == 0">服务商</th>
                            <th ng-if="(companytype-1) * (companytype-5) == 0">公司名</th>
                            <th >商户号</th>
                            <th >终端号</th>
                            <th >交易流水号</th>
                            <th >刷卡金额</th>
                            <th >手续费</th>
                            <th style="width: 80px">收入</th>
                            <th >状态</th>
                            <th >刷卡银行</th>
                            <th >刷卡账号</th>
                            <th >卡类型</th>
                            <th >交易时间</th>
                            <th >清分时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="paymentjournal_data in paymentjournal_datas">
                            <td ng-bind="$index+1">1</td>
                            <td ng-if="(companytype-1) * (companytype-5) == 0">{{paymentjournal_data.logisticsname}}</td>
                            <td ng-if="(companytype-1) * (companytype-5) == 0">{{paymentjournal_data.enterprisemembername}}</td>
                            <td>{{paymentjournal_data.merchantid}}</td>
                            <td>{{paymentjournal_data.terminalnumber}}</td>
                            <td>{{paymentjournal_data.unionpaydealid}}</td>
                            <td>{{paymentjournal_data.accountreceived}}</td>
                            <td>{{paymentjournal_data.actualcompanysettlementfee_sum}}</td>
                            <td>{{paymentjournal_data.actualcompanyreceived_sum}}</td>
                            <td>{{paymentjournal_data.state}}</td>
                            <td>{{paymentjournal_data.bank}}</td>
                            <td>{{paymentjournal_data.bankaccount}}</td>
                            <td>{{paymentjournal_data.bankcardtype}}</td>
                            <td>{{paymentjournal_data.businesstime}}</td>
                            <td>{{paymentjournal_data.settlementtime}}</td>
                        </tr>
                    </tbody>
                </table>                
            </div>

            <div class="row" align="center">
                <div class="pagination" id="pagination" style="margin:4px 0 0 0"></div>
            </div>

            <div class="row" ng-show="params.querydate!=''">
                <div class="form-group">
                    <label class="col-sm-6 control-label no-padding-right">{{params.querydate}}交易流水记录</label>
                    <div class="col-sm-6">
                        <button class="btn btn-primary" ng-click="back_month()" >
                            <span class="glyphicon glyphicon-hand-left"></span>
                            返回
                        </button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</body>
</html>