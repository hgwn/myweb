<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>T+0商户账号</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <!-- using twitter bootstrap, but of course -->
    <link rel="stylesheet" type="text/css" href="../static/css/base/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="../static/js/plugins/jquery.plugins/jquery-ui/jquery-ui.css">
   
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

    <!--自定义js文件-->
    <script src="static/js/publict0.js"></script>
    <script src="static/js/accountt0.js"></script>
</head>
<body ng-controller="t0AccountController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />
            <h3>T+0账号信息</h3>
            <div class="row">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td style="width: 100px;">商户名称</td>
                            <td colspan="3">{{t0data.applycompanyname}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">账号类型</td>
                            <td>
                                <span ng-show="t0data.accounttype==0">企业账号</span>
                                <span ng-show="t0data.accounttype==1">个人账号</span>
                            </td>
                            <td style="width: 120px;">公司收款户名</td>
                            <td>{{t0data.applyloanaccountname}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">收款帐号</td>
                            <td>{{t0data.applyloanbankaccount}}</td>
                            <td style="width: 120px;">身份证号码</td>
                            <td>{{t0data.idcardno}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">开户行</td>
                            <td>{{t0data.bank}}</td>
                            <td style="width: 120px;">联行号</td>
                            <td>{{t0data.bankcode}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">开户行地址</td>
                            <td colspan="3">{{t0data.bankaddress}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>T+0其他信息</h3>
            <div class="row">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td style="width: 160px;">可贷款百分比</td>
                            <td >{{t0data.loanpercent * 100}}%</td>
                            <td style="width: 160px;">结算可用余额</td>
                            <td>{{t0data.loanbalance}}元</td>
                        </tr>

                        <tr>
                            <td style="width: 160px;">单笔最高限额（元）</td>
                            <td>{{t0data.singlelimitamount}}元</td>
                            <td style="width: 160px;">总限额</td>
                            <td>{{t0data.totalloanamount}}元</td>
                        </tr>

                        <tr>
                            <td style="width: 160px;">生效日期</td>
                            <td>{{t0data.execdate}}</td>
                            <td style="width: 160px;">失效日期</td>
                            <td>{{t0data.invaliddate}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    </div>
</body>
</html>