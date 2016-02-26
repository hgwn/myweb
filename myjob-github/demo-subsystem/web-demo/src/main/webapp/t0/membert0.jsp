<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>T+0商户</title>
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
    <script src="static/js/membert0.js"></script>
</head>
<body ng-controller="t0MemberController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />

            <h3>T+0申请信息</h3>
            <div class="row">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td style="width: 100px;">资方公司</td>
                            <td>{{t0data.loanbankname}}</td>
                            <td style="width: 80px;">最高限额</td>
                            <td style="width: 120px;">{{t0data.totalloanamount}}元</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">产品名称</td>
                            <td colspan="3">{{t0data.financingproductname}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">申请时间</td>
                            <td colspan="3">{{t0data.createdtime}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">申请进度</td>
                            <td colspan="3">
                                <span ng-switch="t0data.platformauditflag">
                                    <span ng-switch-when="1">平台审核通过</span>
                                    <span ng-switch-when="2">平台审核不通过</span>
                                    <span ng-switch-when="3">等待平台审核</span>
                                    <span ng-switch-when="4">暂停（平台）</span>
                                    <span ng-switch-when="5">退出（平台）</span>
                                </span>
                                
                                <span ng-switch="t0data.enableflag">
                                    <span ng-switch-when="1">资方审核通过</span>
                                    <span ng-switch-when="2">资方审核不通过</span>
                                    <span ng-switch-when="3">等待资方审核</span>
                                    <span ng-switch-when="4">资方暂停</span>
                                    <span ng-switch-when="5">资方退出</span>
                                </span>
                            </td>
                        </tr>
                        <tr ng-show="t0data.platformauditflag==3">
                            <td colspan="4"><a href="" class="link_edit" ng-click="cancel_apply_by_owner(t0data)">撤销申请</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    </div>
</body>
</html>