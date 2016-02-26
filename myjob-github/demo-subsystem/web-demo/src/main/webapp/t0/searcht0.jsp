<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>T+0产品搜索</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <!-- using twitter bootstrap, but of course -->
    <link rel="stylesheet" type="text/css" href="../static/css/base/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="../static/js/plugins/jquery.plugins/jquery-ui/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="../static/js/plugins/jquery.plugins/pagination/pagetable.css">
   
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
    <script src="static/js/searcht0.js"></script>
</head>
<body ng-controller="t0SearchController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />

            <h3>T+0产品信息</h3>

            <div class="row" ng-repeat="t0data in t0datas">
                <table class="table table-bordered">
                    <tbody>
                        <tr>
                            <td style="width: 100px;">资方公司</td>
                            <td>{{t0data.loanbankname}}</td>
                            <td style="width: 80px;">最高限额</td>
                            <td style="width: 120px;">{{t0data.financingtopamount}}元</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">产品名称</td>
                            <td colspan="3">{{t0data.financingproductname}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">产品介绍</td>
                            <td colspan="3">{{t0data.financingproductnumericroduce}}</td>
                        </tr>

                        <tr>
                            <td style="width: 100px;">申请条件</td>
                            <td colspan="3">{{t0data.conditiondesc}}</td>
                        </tr>
                        <tr>
                            <td colspan="4"><a href="" class="link_edit" ng-click="request_infos(t0data)">申请</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </form>
    </div>
</body>
</html>