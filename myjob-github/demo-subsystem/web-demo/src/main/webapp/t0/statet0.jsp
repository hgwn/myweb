<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
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
    <script src="static/js/queryt0.js"></script>

    <style>
        #view_info_model {
            margin: 20px 20px 20px 20px; /* PLAY THE WITH THE VALUES TO SEE GET THE DESIRED EFFECT */
        }
    </style>
</head>
<body ng-controller="t0ApplyQuery">
    <div class="container">
        <form class="form-horizontal" name="frmT0" novalidate>
            <br />
            <div class="row">
                <div class = "row">
                    <div class="col-sm-3">
                        <div class="form-group" >
                            <label class="col-sm-5 control-label no-padding-right">平台审核</label>
                            <div class="col-sm-7">
                                <select class="form-control" ng-model="params.platformauditflag" >
                                  <option value="0" selected> 全部 </option>
                                  <option value="1"> 可用 </option>
                                  <option value="2"> 审核不通过 </option>
                                  <option value="3"> 待审核 </option>
                                  <option value="4"> 暂停 </option>
                                  <option value="5"> 退出 </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group" >
                            <label class="col-sm-5 control-label no-padding-right">资方审核</label>
                            <div class="col-sm-7">
                                <select class="form-control" ng-model="params.enableflag" >
                                  <option value="0" selected> 全部 </option>
                                  <option value="1"> 可用 </option>
                                  <option value="2"> 审核不通过 </option>
                                  <option value="3"> 待审核 </option>
                                  <option value="4"> 暂停 </option>
                                  <option value="4"> 退出 </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group" >
                            <label class="col-sm-5 control-label no-padding-right">商户名称</label>
                            <div class="col-sm-7">
                                <input type="text" ng-model="params.companyname" placeholder="商户名称，模糊匹配" class="form-control col-sm-12" />
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <button class="btn btn-primary" ng-click="query_applyt0()" >
                            <span class="glyphicon glyphicon-ok"></span>
                            查询
                        </button>
                    </div>
                </div>

                <div class="row">
                    <div class="col-sm-3">
                        <div class="form-group" >
                            <label class="col-sm-5 control-label no-padding-right">起始日期</label>
                            <div class="col-sm-7">
                                <input type="text" ng-model="params.begintime" placeholder="2015-06-01" class="form-control col-sm-12" />
                            </div>
                        </div>
                    </div>

                    <div class="col-sm-3">
                        <div class="form-group" >
                            <label class="col-sm-5 control-label no-padding-right">结束日期</label>
                            <div class="col-sm-7">
                                <input type="text" ng-model="params.endtime" placeholder="2015-06-01" class="form-control col-sm-12" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <table class="table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">行号</th>
                            <th style="width: 200px;">申请商户</th>
                            <th style="width: 200px">资方公司</th>
                            <th style="width: 100px">融资产品</th>
                            <th style="width: 50px">平台审核状态</th>
                            <th style="width: 50px">资方审核状态</th>
                            <th style="width: 120px">申请时间</th>
                            <th style="width: 80px">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="applydata in applydatas">
                            <td ng-bind="$index+1">1</td>
                            <td>{{applydata.applycompanyname}}</td>
                            <td>{{applydata.loanbankname}}</td>
                            <td>{{applydata.financingproductname}}</td>

                            <td ng-switch="applydata.platformauditflag">
                                <span ng-switch-when="1">可用</span>
                                <span ng-switch-when="2">审核不通过</span>
                                <span ng-switch-when="3">待审核</span>
                                <span ng-switch-when="4">暂停</span>
                                <span ng-switch-when="5">退出</span>
                            </td>

                            <td ng-switch="applydata.enableflag">
                                <span ng-switch-when="1">可用</span>
                                <span ng-switch-when="2">审核不通过</span>
                                <span ng-switch-when="3">待审核</span>
                                <span ng-switch-when="4">暂停</span>
                                <span ng-switch-when="5">退出</span>
                            </td>

                            <td>{{applydata.createdtime}}</td>

                            <td>
                                <span>
                                    <a href="" class="link_edit" ng-click="view_infos(applydata)">详细</a>
                                </span>

                                <span ng-switch="params.companytype">
                                    <a ng-switch-when="2" href="" class="link_edit" ng-if="(applydata.platformauditflag - 2) * (applydata.platformauditflag - 3) * (applydata.platformauditflag - 5) * (applydata.enableflag - 2) * (applydata.enableflag - 3)  * (applydata.enableflag - 5) == 0" ng-click="modify_infos(applydata)">修改</a>
                                    <a ng-switch-when="3" href="" class="link_edit" ng-if="(applydata.platformauditflag - 2) * (applydata.platformauditflag - 3) * (applydata.platformauditflag - 5) * (applydata.enableflag - 2) * (applydata.enableflag - 3)  * (applydata.enableflag - 5) == 0" ng-click="modify_infos(applydata)">修改</a>
                                    <a ng-switch-when="4" href="" class="link_edit" ng-if="(applydata.platformauditflag - 2) * (applydata.platformauditflag - 3) * (applydata.platformauditflag - 5) * (applydata.enableflag - 2) * (applydata.enableflag - 3)  * (applydata.enableflag - 5) == 0" ng-click="modify_infos(applydata)">修改</a>
                                    
                                    <span ng-switch-when="1">
                                        <a  href="" class="link_edit" ng-if="(applydata.platformauditflag - 2) * (applydata.platformauditflag - 5) * (applydata.enableflag - 2) * (applydata.enableflag - 5) != 0" ng-click="modify_financingtopamount_infos(applydata)">限额</a>
                                    </span>
                                    
                                    <span ng-switch-when="7">
                                        <a  href="" class="link_edit" ng-if="(applydata.platformauditflag - 2) * (applydata.platformauditflag - 5) * (applydata.enableflag - 2) * (applydata.enableflag - 5) != 0" ng-click="modify_financingtopamount_infos(applydata)">限额</a>
                                    </span>

                                </span>

                                <span ng-if="applydata.platformauditflag == 1">
                                    <a href="" class="link_edit" id="cancel_t0_{{applydata.applycompanyid}}" ng-if="companytype==1" ng-click="cancel_t0(applydata)">暂停</a>
                                </span>

                                <span ng-if="applydata.enableflag == 1">
                                    <a href="" class="link_edit" id="cancel_t0_{{applydata.applycompanyid}}" ng-if="companytype==7" ng-click="cancel_t0(applydata)">暂停</a>
                                </span>

                                <span ng-if="params.companytype==1">
                                    <span ng-switch="applydata.platformauditflag">
                                        <a ng-switch-when="2" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="audit_infos(applydata)">审核</a>
                                        <a ng-switch-when="3" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="audit_infos(applydata)">审核</a>
                                        <a ng-switch-when="4" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="recovery_infos(applydata, 0, 1)">恢复</a>
                                    </span>
                                </span>

                                <span ng-if="params.companytype==7">
                                    <span ng-switch="applydata.enableflag">
                                        <a ng-switch-when="2" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="audit_infos(applydata)">审核</a>
                                        <a ng-switch-when="3" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="audit_infos(applydata)">审核</a>
                                        <a ng-switch-when="4" href="" class="link_edit" id="audit{{applydata.applycompanyid}}" ng-click="recovery_infos(applydata, 1, 0)">恢复</a>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>                
            </div>

            <div class="row" align="center">
                <div class="pagination" id="pagination" style="margin:4px 0 0 0"></div>
            </div>
        </form>
    </div>

    <!-- 模态框（Modal） -->
    <div class="modal fade" id="view_info_model" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
       <div class="modal-dialog" style="display: inline-block; width: auto;">
          <div class="modal-content">
             <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
                </button>
                <h4 class="modal-title" id="myModalLabel">
                   <span>{{data_item.applycompanyname}}</span>
                </h4>
             </div>
             <div class="modal-body">
                <!-- 产品的介绍 -->
                <div>
                    <blockquote>
                        <small>
                            资方公司：{{data_item.loanbankname}}
                            <cite title="Source Title">融资产品名称：{{data_item.financingproductname}}</cite>
                        </small>
                    </blockquote>
                </div>

                <!-- 商户的基本情况 -->
                <div>
                    <table class="table table-striped table-bordered">
                        <thead>
                          <th class="center" width="120px">商户法人</th>
                          <th class="center" width="120px">法人电话</th>
                          <th class="center" width="120px">商户负责人</th>
                          <th class="center" width="120px">负责人电话</th>
                          <th class="center" width="80px">单笔限额</th>
                          <th class="center">详细地址</th>
                        </thead>

                        <tbody id="picbody">
                          <tr>
                            <td class="center">{{data_infos.legalperson}}</td>
                            <td class="center">{{data_infos.legalpersonphone}}</td>
                            <td class="center">{{data_infos.companyleander}}</td>
                            <td class="center">{{data_infos.companyleanderphone}}</td>
                            <td class="center">{{data_infos.singlelimitamount}}</td>
                            <td class="center">{{data_infos.address}}</td>
                          </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 账号信息 -->
                <div>
                    <table class="table table-striped table-bordered">
                        <thead>
                          <th class="center" width="120px">账号类型</th>
                          <th class="center" width="150px">收款户名</th>
                          <th class="center" width="150px">收款帐号</th>
                          <th class="center" width="120px">身份证号码</th>
                          <th class="center" width="120px">联行号</th>
                          <th class="center" width="150px">开户行</th>
                          <th class="center">开户行地址</th>
                        </thead>
                        <tbody id="picbody">
                          <tr>
                            <td class="center">{{data_infos.t_accounttype_desc}}</td>
                            <td class="center">{{data_infos.t_accountname}}</td>
                            <td class="center">{{data_infos.t_bankaccount}}</td>
                            <td class="center">{{data_infos.t_idcardno}}</td>
                            <td class="center">{{data_infos.t_bankcode}}</td>
                            <td class="center">{{data_infos.t_bank}}</td>
                            <td class="center">{{data_infos.t_bank_address}}</td>
                          </tr>
                        </tbody>
                    </table>
                </div>

                <div id="pic_div">
                    <table class="table table-striped table-bordered">
                        <tbody id="picbody">
                            <tr style="padding:0px">
                                <td class="center" width="120px">身份证</td>
                                <td class="center"><span id="span_files_1"></span></td> 
                                <td class="center" width="120px">营业执照</td>
                                <td class="center"><span id="span_files_2"></span></td>
                                <td class="center" width="120px">税务登记证</td>
                                <td class="center"><span id="span_files_3"></span></td>
                            </tr>
                            <tr>
                                <td class="center" width="120px">特约客户调查表</td>
                                <td class="center"><span id="span_files_7"></span></td>
                                <td class="center" width="120px">门店</td>
                                <td class="center"><span id="span_files_10"></span></td>
                                <td class="center" width="120px">主附合同</td>
                                <td class="center"><span id="span_files_101"></span></td>                             
                            </tr>
                            <tr>
                                <td class="center" width="120px">其他</td>
                                <td class="center" colspan="5"><span id="span_files_14"></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="modal-footer">
                <form class="form-horizontal" name="frmT0" id="frmT0" novalidate>
                    <div class="form-group" >
                        <label class="col-sm-2 control-label no-padding-right">审核</label>
                        <div class="col-sm-2">
                          <select class="form-control" ng-model="params.auditstate">
                              <option value="1" selected> 通过 </option>
                              <option value="2"> 不通过 </option>
                          </select>
                        </div>
                        <div class="col-sm-8">
                            <input type="text" name="remark" placeholder="审核意见，必填" ng-model="params.remark" class="col-sm-12 form-control" required/>
                        </div>
                    </div>
                </form>

                <button type="button" class="btn btn-primary" id="btnsubmit" ng-click="submit_audit()">
                   提交更改
                </button>

                <button type="button" class="btn btn-default" data-dismiss="modal">
                   关闭
                </button>
            </div>
          </div><!-- /.modal-content -->
       </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <div class="modal fade" id="modify_financingtopamount_info_model" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
       <div class="modal-dialog" style="display: inline-block; width: auto;">
          <div class="modal-content">
             <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×
                </button>
                <h4 class="modal-title" id="myModalLabel">
                   <span>{{data_item.applycompanyname}} 修改限额</span>
                </h4>
             </div>
             <div class="modal-body">
                <form class="form-horizontal" name="frmT0" novalidate>
                    <div class="form-group" >
                        <label class="col-sm-6 control-label no-padding-right">可贷款百分比</label>

                        <div class="col-sm-6">
                          <input type="number" name="loanpercent" ng-model="data_item.loanpercent" ng-minlength="1" maxlength="3" ng-max="100" class="col-sm-12 form-control" required />
                        </div>
                    </div>

                    <div class="form-group" >
                        <label class="col-sm-6 control-label no-padding-right">总限额</label>

                        <div class="col-sm-6">
                          <input type="number" name="totalloanamount" ng-model="data_item.totalloanamount" class="col-sm-12 form-control" required/>
                        </div>
                    </div>

                    <div class="form-group" >
                        <label class="col-sm-6 control-label no-padding-right">单笔最高限额</label>

                        <div class="col-sm-6">
                          <input type="number" name="singlelimitamount" ng-model="data_item.singlelimitamount" class="col-sm-12 form-control" required/>
                        </div>
                    </div>

                    <div class="form-group" >
                        <label class="col-sm-6 control-label no-padding-right">结算可用余额</label>

                        <div class="col-sm-6">
                          <input type="number" name="loanbalance" ng-model="data_item.loanbalance" class="col-sm-12 form-control" required/>
                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-primary" id="btnsubmit" ng-click="submit_financingtopamount_data()">
                   提交更改
                </button>

                <button type="button" class="btn btn-default" data-dismiss="modal">
                   关闭
                </button>
            </div>
          </div><!-- /.modal-content -->
       </div><!-- /.modal-dialog -->
    </div>
</body>
</html>