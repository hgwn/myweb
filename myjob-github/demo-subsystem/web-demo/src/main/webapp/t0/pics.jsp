<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%
    String server_applyloanconfigid = request.getParameter("applyloanconfigid");
    if (server_applyloanconfigid == null) server_applyloanconfigid = "0";
    if (server_applyloanconfigid == "") server_applyloanconfigid = "0";

    String server_financingproductid = request.getParameter("financingproductid");
    if (server_financingproductid == null) server_financingproductid = "0";
    if (server_financingproductid == "") server_financingproductid = "0";
%>
<!doctype html>
<!-- 此页面主要用于T+1的商户自己申请转成T+0 -->
<html lang="en" ng-app="t0App">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta charset="utf-8" />
    <title>商户三证一表</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

    <!-- using twitter bootstrap, but of course -->
    <link rel="stylesheet" type="text/css" href="../static/css/base/bootstrap.css">
   
    <!-- 自定义css -->
    <script src="../static/js/base/jquery/jquery.min.js"></script>
    <!-- Include angular.js, angular-animate.js and angular-ui-router.js-->
    
    <!-- 基础框架，不能移动 -->
    <script src="../static/js/base/angularjs/v.1.3.15/angular.js"></script>
    <script src="../static/js/base/angularjs/v.1.3.15/angular-animate.js"></script>
    <script src="../static/js/base/angular-ui.router/angular-ui-router.js"></script>
    <script src="../static/js/base/angularjs/v.1.3.15/angular-messages.js"></script>

    <!--boostrap插件整合-->
    <script src="../static/js/base/angularstrap/angular-strap.js"></script>
    <script src="../static/js/base/angularstrap/angular-strap.tpl.js"></script>
    <script src="../static/js/base/bootstrap/v3.3.4/js/bootstrap.js"></script>
    
    <!--自定义js文件-->
    <script src="static/js/publict0.js"></script>
    <script src="static/js/applyt0.js"></script>

    <style>
        input.ng-invalid {
            border: 1px solid red;
        }

        input.ng-valid{
            border: 1px solid green;
        }
    </style>

</head>
<body ng-controller="t0ApplyController">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <input type="hidden" value="<%= server_applyloanconfigid %>" id="modify_applyloanconfigid"></input>
            <input type="hidden" value="<%= server_financingproductid %>" id="selected_financingproductid"></input>

            <div class="row">
                <br />
                <table class="table table-bordered">
                  <thead>
                      <th class="center" width="120px">证件类型</th>
                      <th class="center">图片（点击链接查看）</th>
                      <th class="center" width="180px">选择图片</th>
                      <th class="center" width="40px"></th>
                      <th class="center" width="220px">选择上传的文件（支持多个）</th>
                      <th class="center" width="120px">上传</th>
                  </thead>

                  <tbody id="picbody">
                    <tr style="padding:0px">
                        <td class="center">身份证</td>
                        <td class="center"><span id="span_files_1"></span></td>
                        <td class="center">
                            <select class="form-control inline" id="select_files_1"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm inline" id="del_files_1" onclick="remove_pic(1)">删除</button>
                        </td>
                        <td>
                            <iframe src="uploaditem.jsp?uploadtype=1" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                        </td>
                      <td class="center">
                        <span id="progress_text_1">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">营业执照</td>
                      <td class="center"><span id="span_files_2"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_2"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_2" onclick="remove_pic(2)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=2" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_2">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">税务登记证</td>
                      <td class="center"><span id="span_files_3"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_3"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_3" onclick="remove_pic(3)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=3" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_3">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">特约客户调查表</td>
                      <td class="center"><span id="span_files_7"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_7"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_7" onclick="remove_pic(7)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=7" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_7">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">门店</td>
                      <td class="center"><span id="span_files_10"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_10"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_10" onclick="remove_pic(10)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=10" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_10">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">主附合同</td>
                      <td class="center"><span id="span_files_101"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_101"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_101" onclick="remove_pic(101)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=101" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_101">等候上传</span>
                      </td>
                    </tr>

                    <tr>
                      <td class="center">其他</td>
                      <td class="center"><span id="span_files_14"></span></td>
                      <td class="center">
                            <select class="form-control" id="select_files_14"></select>
                        </td>
                        <td class="center">
                            <button class="btn btn-sm" id="del_files_14" onclick="remove_pic(14)">删除</button>
                        </td>
                      <td class="center">
                        <iframe src="uploaditem.jsp?uploadtype=14" scrolling="no" border=0 frameborder=0 framespacing=0 style="width:100%; height:30px;" ></iframe>
                      </td>
                      <td class="center">
                        <span id="progress_text_14">等候上传</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
            </div>
        </form>
    </div>
</body>
</html>