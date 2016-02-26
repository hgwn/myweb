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
    <title>T+1商户转T+0</title>
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
                <div class="panel panel-default">
                  <div class="panel-heading">第一步：选择资方</div>
                  <div class="panel-body">
                        <div class="form-group" >
                            
                            <div class="col-sm-12">                            
                                <div class="well">
                                  <h3 class="grey lighter smaller">
                                    <span class="blue bigger-75">
                                      <i class="ace-icon fa fa-sitemap"></i>
                                      <span>{{ financingproduct.loanbankname }}</span>
                                    </span>
                                  </h3>

                                  <hr>
                                  <h4 class="lighter smaller">
                                    T+0产品（<span>{{ financingproduct.financingproductname }}</span>）介绍：
                                  </h4>

                                  <div>
                                    <div class="space"></div>
                                    <h5 class="smaller">
                                      {{ financingproduct.financingproductnumericroduce }}
                                    </h5>
                                  </div>

                                  <hr>
                                  <h4 class="lighter smaller">
                                    T+0产品（<span>{{ financingproduct.financingproductname }}</span>）申请条件：
                                  </h4>

                                  <div>
                                    <div class="space"></div>
                                    <h5 class="smaller">
                                      {{ financingproduct.conditiondesc }}
                                    </h5>
                                  </div>

                                  <hr>
                                  <div>
                                    <div class="space"></div>
                                    <h5 class="smaller">
                                      最高额度:{{ financingproduct.financingtopamount }}元
                                    </h5>
                                  </div>
                                </div>
                            </div>                          
                        </div>

                        <div class="form-group" id="cmbfinancingproduct" >
                            <label class="col-sm-3 control-label no-padding-right">资方公司产品</label>

                            <div class="col-sm-6">
                                <select class="form-control" ng-model="financingproduct" ng-options="financingproduct.financingproductname group by financingproduct.loanbankname for financingproduct in financingproducts" ng-change="change_financingproduct()">
                                  <option value=""> 请选择 </option>
                                </select>
                            </div>
                        </div>
                  </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-heading">第二步：下载合同模板、签订并盖章、然后扫描或者拍照签好的合同</div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered">
                          <thead>
                            <th class="center" width="70%">合同名称</th>
                            <th class="center" width="15%">合同类型</th>
                            <th class="center">操作</th>
                          </thead>
                          <tbody id="companycontract_body">
                          </tbody>
                        </table>
                    </div>
                </div>

                <div class="panel panel-default">
                    <div class="panel-heading">第三步：上传三证一表、主附合同等资料</div>
                    <div class="panel-body">
                        <table class="table table-striped table-bordered">
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
                </div>

                <div class="panel panel-default">
                  <div class="panel-heading">第四步：填写账号信息</div>
                  <div class="panel-body">
                      <div class="col-sm-12">
                              <div class="form-group" >
                                  <label class="col-sm-3 control-label no-padding-right">账号类型</label>
                                  <div class="col-sm-6">
                                    <select class="form-control" ng-model="params.accounttype">
                                        <option value="0" selected> 企业帐户 </option>
                                        <option value="1"> 个人帐户 </option>
                                    </select>
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">公司收款户名</label>
                                  <div class="col-sm-6">
                                    <input type="text" name="applyloanaccountname" ng-model="params.applyloanaccountname" class="form-control col-sm-12" ng-trim="true" ng-minlength="2" maxlength="49" required hint-on-blur />
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">收款帐号</label>
                                  <div class="col-sm-6">
                                    <input type="text" name="applyloanbankaccount" ng-model="params.applyloanbankaccount" class="form-control col-sm-12" ng-trim="true" ng-minlength="8" maxlength="49" required/>
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">身份证号码</label>
                                  <div class="col-sm-6">
                                    <input type="text" ng-model="params.idcardno" ng-minlength="8" maxlength="18" class="form-control col-sm-12" ng-trim="true" required/>
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">开户行</label>
                                  <div class="col-sm-6">
                                    <input type="text" ng-model="params.bank" ng-minlength="2" maxlength="49" class="form-control col-sm-12"  ng-trim="true"required/>
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">联行号</label>
                                  <div class="col-sm-6">
                                    <input type="text" ng-model="params.bankcode" ng-minlength="2" maxlength="49" class="form-control col-sm-12"  ng-trim="true"required/>
                                  </div>
                              </div>

                              <div class="form-group" >
                                <label class="col-sm-3 control-label no-padding-right">开户行地址</label>
                                  <div class="col-sm-6">
                                    <input type="text" ng-model="params.bankaddress" ng-minlength="2" maxlength="99" class="form-control col-sm-12" ng-trim="true" required/>
                                  </div>
                              </div>
                      </div>
                  </div>
                </div>

                <div class="panel panel-default">
                  <div class="panel-heading">第五步：完善T+0必须资料</div>
                  <div class="panel-body">
                        <div class="form-group" >
                          <label class="col-sm-3 control-label no-padding-right">可贷款百分比</label>

                          <div class="col-sm-6">
                            <input type="number" name="loanpercent" ng-model="params.loanpercent" ng-minlength="1" maxlength="3" ng-max="100" value="100" class="col-sm-12 form-control" required />
                          </div>
                        </div>

                        <div class="form-group" >
                          <label class="col-sm-3 control-label no-padding-right">单笔最高限额（元）</label>

                          <div class="col-sm-6">
                            <input type="number" name="singlelimitamount" ng-model="params.singlelimitamount" value="0" class="col-sm-12 form-control" required/>
                          </div>
                        </div>

                        <div class="form-group" >
                          <label class="col-sm-3 control-label no-padding-right">结算可用余额（元）</label>

                          <div class="col-sm-6">
                            <input type="number" name="loanbalance" ng-model="params.loanbalance" value="0" class="col-sm-12 form-control" required/>
                          </div>
                        </div>
                  </div>
                </div>
            </div>

            <div class="row">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="form-group" >
                            <label class="col-sm-3 control-label no-padding-right"></label>

                            <div class="col-sm-6">
                                <button class="btn btn-lg btn-primary" ng-show="params.applyloanconfigid<=0" ng-click="submit_applyt0()" ng-disabled='!frmT0.$valid' id="btnsubmit">
                                    <span class="glyphicon glyphicon-ok"></span>
                                    提交申请
                                </button>

                                <button class="btn btn-lg btn-primary" ng-show="params.applyloanconfigid>0" ng-click="back_to_applyt0()" ng-disabled='!frmT0.$valid'>
                                    <span class="glyphicon glyphicon-hand-left"></span>
                                    返回
                                </button>

                                <button class="btn btn-lg btn-primary" ng-show="params.applyloanconfigid>0" ng-click="modify_applyt0()" ng-disabled='!frmT0.$valid'>
                                    <span class="glyphicon glyphicon-ok"></span>
                                    提交修改
                                </button>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

</body>
</html>