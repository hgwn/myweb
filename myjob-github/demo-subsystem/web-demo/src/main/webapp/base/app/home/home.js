define(function(){
    var loadHomeModule = function(){
        return angular.module('masgetWebApp.home', [])
            .run(
            [          '$rootScope', '$state', '$stateParams','$templateCache',
                function ($rootScope, $state, $stateParams,$templateCache) {
                    //dropdown
                    $templateCache.put('dropdown/dropdown.tpl.html', '<ul ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}" tabindex="-1" class="dropdown-menu" role="menu"><li role="presentation" ng-class="{divider: item.divider}" ng-repeat="item in content"><a role="menuitem" tabindex="-1" ng-href="{{item.href}}" ng-if="!item.divider && item.href" target="{{item.target || \'\'}}" ng-bind="item.text"></a> <a role="menuitem" tabindex="-1" href="javascript:void(0)" ng-if="!item.divider && item.click" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a></li></ul>');
                    $templateCache.put('tabs/contextMenu.tpl.html', '<ul tabindex="-1" class="dropdown-menu" role="menu" style="background-color: #FAFEF7;min-width:120px;"><li role="presentation" ng-class="{divider: item.divider}" ng-repeat="item in content"><a role="menuitem" tabindex="-1" ng-href="{{item.href}}" ng-if="!item.divider && item.href" target="{{item.target || \'\'}}" ng-bind="item.text"></a> <a role="menuitem" tabindex="-1" href="javascript:void(0)" ng-if="!item.divider && item.click" ng-click="$eval(item.click);$hide()" ng-bind="item.text"></a></li></ul>');
                    $templateCache.put('switchStation.tpl.html', '<div class="panel panel-default" style="border: 1px solid #C7D4BE;position:absolute;z-index:1000;border-top-left-radius:5px;border-top-right-radius:5px;background-color:transparent;width:200px"><div class="panel-heading" style="text-align:center"><span style="font-weight:700;font-size:14px">切换工作站点</span>&nbsp;&nbsp;&nbsp;<span class="glyphicon glyphicon-triangle-left" style="font-size:14px;cursor:pointer;" ng-click="toggleState($event);showSearch=!showSearch;$event.stopPropagation();"></span><div class="input-group" style="margin-top:5px" ng-show="showSearch"><input class="form-control" ng-click="$event.stopPropagation();" placeholder="站点搜索" ng-model="$parent.stationSearchInput" aria-describedby="stationSearchBtb"></div></div><div class="panel-body" style="max-height:300px;overflow:auto;padding: 0 0;" ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"><div tabindex="-1" style="margin-bottom:0px;position:relative;display:block" class="list-group" role="menu"><div class="stationItem" role="presentation" ng-repeat="node in switchStation" ng-include="\'base/app/home/stations.html\'"></div></div></div></div>');
                    $templateCache.put('stationList.tpl.html', '<div style="max-height:140px;overflow:auto;padding: 0 0;cursor:pointer;" class="dropdown-menu" ng-scrollbar scrollbar-x="false"     scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"><div tabindex="-1" style="margin-bottom:0px;position:relative;display:block" class="list-group" role="menu"><div class="stationItem" role="presentation" ng-repeat="node in stationList" ng-include="\'base/app/home/stationsListRender.html\'"></div></div></div>');

                    //modal
                    $templateCache.put('modal/modal.tpl.html', '<div ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}" class="modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div><div class="modal-footer"><button type="button" class="btn btn-default masget-btn-default " ng-click="$hide()">关闭</button></div></div></div></div>');
                    $templateCache.put('modal/modal.edit.tpl.html', '<div ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}" class="modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div></div></div></div>');
                    $templateCache.put('modal/notice.detail.tpl.html', '<div ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}" class="modal" tabindex="-1" role="dialog"><div class="modal-dialog" style="width: 90%;"><div class="modal-content"><div class="modal-header" ng-show="title" style="padding: 10px;"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content" style="padding: 0 0;height: 600px;"></div></div></div></div>');
                    $templateCache.put('modal/modal.confirm.tpl.html', '<div ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}" class="modal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header" ng-show="title"><button type="button" class="close" ng-click="$hide()">&times;</button><h4 class="modal-title" ng-bind="title"></h4></div><div class="modal-body" ng-bind="content"></div><div class="modal-footer" ng-hide="modalFooterHide"><button type="button" class="btn btn-primary masget-btn-primary" ng-click="$modalButtonClick()">确认</button><button type="button" class="btn btn-default masget-btn-default " ng-click="$hide()">关闭</button></div></div></div></div>');
                    $templateCache.put('buzCircle/modifyName.tpl.html','<div class="input-group"><span class="input-group-addon" id="basic-addon2">名称：</span><input id="modifyName" type="text" class="form-control" ng-model="$parent.$parent.$parent.nickName" aria-describedby="basic-addon2"></div>');
                    $templateCache.put('modal/modifyPwd.tpl.html','<form class="form-vertical register-form" name="resetPwdForm" novalidator style="width:80%;margin-left:10%"><div class="panel panel-default"><div class="panel-body" style="border:0"><div class="input-group" style="margin-bottom:10px"><span class="input-group-addon" id="basic-addon1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;原密码：</span><input class="form-control" style="width:75%" aria-describedby="basic-addon1" ng-model="resetPwdModel.originPwd" type="password" name="originPwd" required><div style="display:inline-block;font-size:14px;padding:4px 10px" ng-messages="resetPwdForm.originPwd.$error"><div class="text-danger" ng-message="required">*必填项</div></div></div><div class="input-group" style="margin-bottom:10px"><span class="input-group-addon"                                                                      id="basic-addon2">输入新密码：</span><input                    class="form-control" style="width:75%" aria-describedby="basic-addon2"                    ng-model="resetPwdModel.newPwd" type="password" name="newPwd" required><div style="display:inline-block;font-size:14px;padding:4px 10px"                     ng-messages="resetPwdForm.newPwd.$error"><div class="text-danger" ng-message="required">*必填项</div></div></div><div class="input-group" style="margin-bottom:10px"><span class="input-group-addon"                                                                      id="basic-addon3">确认新密码：</span><input                    class="form-control" style="width:75%" aria-describedby="basic-addon3"                    ng-model="resetPwdModel.confirmPwd" type="password" name="confirmPwd" required><div style="display:inline-block;font-size:14px;padding:4px 10px"><div style="display:inline" class="text-danger"                         ng-if="resetPwdModel.confirmPwd!=resetPwdModel.newPwd&&resetPwdForm.confirmPwd.$error&&resetPwdForm.confirmPwd.$dirty">                        输入有误</div><div style="display:inline" ng-messages="resetPwdForm.confirmPwd.$error"><div class="text-danger" ng-message="required">*必填项</div></div></div></div></div></div><div class="form-actions" style="margin-left:60%"><button ng-click="$hide();" class="btn btn-default masget-btn-default ">关闭</button>&nbsp;&nbsp;&nbsp;&nbsp;<button ng-click="saveNewPwd();" class="btn btn-warning" ng-disabled="resetPwdForm.$invalid">保存</button></div></form>');
                    $templateCache.put('contacts/addGroup.tpl.html','<div class="input-group"><span class="input-group-addon" id="basic-addon2">分组名称：</span><input id="addGroupName" type="text" class="form-control" aria-describedby="basic-addon2"></div><div class="input-group" style="margin-top: 10px;"><span class="input-group-addon" id="basic-addon3">分组类型：</span><button type="button" class="btn btn-default masget-btn-default " ng-model="$parent.$parent.$parent.selectedgrouptype" data-trigger="focus" aria-describedby="basic-addon3" bs-options="item.saasgrouptypeid as item.saasgrouptypename for item in addressgrouptypes" bs-select> 未选择<span class="caret"></span></button></div>');

                    //popover
                    $templateCache.put('popover/popover.tpl.html', '<div class="popover" style="max-width:1000px;"><div class="arrow" style="position: fixed;"></div><h3 class="popover-title" ng-bind="title" ng-show="title"></h3><div class="popover-content" ng-bind="content" style="padding: 0 0;"></div></div>');
                    $templateCache.put('popover/contacts.rightMenu.tpl.html', '<div class="list-group" style="margin-bottom:0"><a role="button" ng-show="node.level == 1" ng-click="contactsMenuButtonClick(node,menuEnum.addGroup);" class="list-group-item">添加分组</a> <a role="button" ng-show="node.level > 1" ng-click="contactsMenuButtonClick(node,menuEnum.delGroup);" class="list-group-item">删除分组</a> <a role="button" ng-if="node.level > 1" ng-click="contactsMenuButtonClick(node,menuEnum.addPerson);" class="list-group-item">添加成员</a><a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.renameGroup);" class="list-group-item">重命名</a></div>');
                    $templateCache.put('popover/buzCircle.rightMenu.tpl.html', '<div class="list-group" style="margin-bottom:0px;"> <a role="button" ng-click="buzcircleMenuButtonClick($element,menuEnum.modify,item);" class="list-group-item">编辑商圈</a><a role="button" ng-click="buzcircleMenuButtonClick($element,menuEnum.modifyName,item);" class="list-group-item">修改圈名</a><a role="button" ng-show="item.isGrouper" ng-click="buzcircleMenuButtonClick($element,menuEnum.deleteBuzCircle,item);" class="list-group-item">删除商圈</a></div>');
                    $templateCache.put('popover/company.rightMenu.tpl.html','<div class="list-group" style="margin-bottom:0"><a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.getCompany);" class="list-group-item">查询公司</a> <a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.modifyCompany);" class="list-group-item" ng-show="node.companyid == session.companyid">修改公司</a> <a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.addStation);" class="list-group-item" >添加站点</a></div>');
                    $templateCache.put('popover/station.rightMenu.tpl.html','<div class="list-group" style="margin-bottom:0"><a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.getStation);" class="list-group-item">查看站点</a> <a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.editStation);" class="list-group-item" >修改站点</a> <a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.delStation);" class="list-group-item" >删除站点</a><a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.addStaff);" class="list-group-item" >添加员工</a></div>');
                    $templateCache.put('popover/organization.rightMenu.tpl.html','<div class="list-group" style="margin-bottom:0"><a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.getStation);" class="list-group-item">查看站点</a> <a role="button" ng-click="contactsMenuButtonClick(node,menuEnum.delStation);" class="list-group-item" >删除站点</a></div>');
                    $templateCache.put('popover/contacts.searchResult.tpl.html','<div class="list-group" style="width:250px;margin-bottom:0"><a role="button" ng-show="resultTotalNum == 0" class="list-group-item">查无结果</a><div class="list-group" ng-repeat="scenetype in searchResult" style="margin-bottom:0px;"><a role="button" class="list-group-item" style="color: rgb(234, 122, 122);height: 30px;font-size: 10px;font-weight: bold;padding-top:5px;">{{scenetype.scenetypename}}</a><a role="button" ng-click="searchResultSelected(item);" ng-class="{true:\'masget-keyOver\'}[item.isKeyOver]"           ng-repeat="item in scenetype.items track by $index" class="list-group-item" ng-mouseover="itemMouseOver(item);"><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;{{item.staffname+"  ("+(scenetype.scenetypeid == 1?item.companyname+"--"+item.stationname:item.addressgroupname)+")"}}</a></div></div>');
                    $templateCache.put('popover/buzcircle.searchResult.tpl.html','<div class="list-group" style="width:180px;margin-bottom:0"><a role="button" ng-show="searchResult.length == 0" class="list-group-item">查无结果</a> <a role="button" ng-click="searchResultSelected(item);" ng-class="{true:\'masget-keyOver\'}[item.isKeyOver]" ng-repeat="item in searchResult track by $index" class="list-group-item" ng-mouseover="itemMouseOver(item);"><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;{{item.contactname||item.commercialcirclename}}<span style="position:absolute;display:inline-block;right:5px;color: red;">{{item.contactname?"好友":"商圈"}}</span></a></div>');
                    $templateCache.put('popover/station.searchResult.tpl.html','<div class="list-group" style="width:180px;margin-bottom:0"><a role="button" ng-show="searchResult.length == 0" class="list-group-item">查无结果</a> <a role="button" ng-click="searchResultSelected(item);" ng-class="{true:\'masget-keyOver\'}[item.isKeyOver]" ng-repeat="item in searchResult track by $index" class="list-group-item" ng-mouseover="itemMouseOver(item);"><span class="glyphicon glyphicon-user"></span>&nbsp;&nbsp;{{item.contactname||item.text}}</a></div>');
                    $templateCache.put('popover/buzcircle.person.detail.tpl.html','<form class="form-horizontal" style="width:300px"><div><label class="col-md-4 control-label">姓名：</label><div class="col-md-6"><p class="form-control-static">{{item.staffnickname}}</p></div></div><div><label class="col-md-4 control-label">所属公司：</label><div class="col-md-8"><p class="form-control-static">{{item.companyname}}</p></div></div><div><label class="col-md-4 control-label">所属站点：</label><div class="col-md-8"><p class="form-control-static">{{item.stationname}}</p></div></div></form>');
                    $templateCache.put('popover/contacts.person.find.tpl.html','<form class="form-horizontal" style="width:300px"><div><label class="col-md-4 control-label">姓名：</label><div class="col-md-6"><p class="form-control-static">{{item.staffname}}</p></div></div><div><label class="col-md-4 control-label">所属公司：</label><div class="col-md-8"><p class="form-control-static">{{item.companyname}}</p></div></div><div><label class="col-md-4 control-label">所属站点：</label><div class="col-md-8"><p class="form-control-static">{{item.stationname}}</p></div></div></form>');
                    $templateCache.put('popover/contacts.person.detail.tpl.html','<form class="form-horizontal" style="width:300px"><div><label class="col-md-4 control-label">所属公司：</label><div class="col-md-6"><p class="form-control-static">{{item.contactcompanyname}}</p></div></div><div><label class="col-md-4 control-label">联系电话：</label><div class="col-md-8"><p class="form-control-static">{{item.conmobilephone}}</p></div></div></form>');
                    $templateCache.put('popover/resource.tpl.html','<div style="width: 300px;padding: 10px;" ng-model="button.radio" bs-radio-group><label class="btn btn-danger" ng-repeat="item in moreResources" style="top: -10px;margin:0 5px 5px 0;"><input type="radio" class="btn btn-info">{{item.resourcename}}</label></div>');
                    $templateCache.put('popover/message.tpl.html','<ul class="list-group" style="margin-bottom:0px;position: absolute;z-index:1000;"><li class="list-group-item" style="color: rgb(234, 122, 122);height: 30px;font-size: 10px;font-weight: bold;padding-top:5px;">未打开的消息</li><li class="list-group-item" ng-show="senders.length == 0">暂无消息</li><li class="list-group-item" ng-repeat="sender in senders">{{sender.name}}<span class="badge" style="float:right;">{{sender.msgNum}}</span></li></ul>');
                    $templateCache.put('popover/importingContacts.rightMenu.tpl.html', '<div class="list-group" style="margin-bottom:0"><a role="button" ng-click="contactsMenuButtonClick($element,menuEnum.importingContacts);" class="list-group-item">导入</a></div>');


                }
            ]
        )
            .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
                var homeViews = {'main': {
                    resolve: $.extend(resolveDep({
                            files: [
                                'home/home.main.controller',
                                'home/home-directives',
                                'schedule/schedule',
                                'static/css/base/reset-common.css'
                            ]}, 'masgetWebApp.home', 'homeModuleDeps'), {
                            session: ['utils', function (utils) {
                                return utils.getSession();
                            }]
                        }
                    ),

                    templateUrl: 'base/app/home/home.html',
                    controller: 'mainCtr'
                }};

                $.each(resources, function (key, item) {
                    if (item.o_resourceid === 10001)
                        homeViews['buzcircle@home'] = {
                            templateUrl: 'base/app/home/home.buzCircle.html',
                            resolve: $.extend(resolveDep({
                                files: [
                                    'home/home.buzCircle.controller',
                                    'mqtt',
                                    'MQTT/ProtoBuf',
                                    'buzcircle/buzCircle-service',
                                    'buzcircle/buzCircle',
                                    'mgchat/mgchat',
                                    'mgchat/mgchat.service',
                                    'NgFileUpload/FileAPI',
                                    'NgFileUpload/ng-file-upload',
                                    'notice/notice'
                                ]}, '', 'buzcircleDeps'), {
                                listData: ['buzcircle', 'buzcircleDeps',
                                    function (buzcircle, buzcircleDeps) {
                                        return buzcircle.all();
                                    }]
                            }),
                            controller: 'buzCircleCtr'};

                    if (item.o_resourceid === 10002)
                        homeViews['contact@home'] = {
                            templateUrl: 'base/app/home/home.contacts.html',
                            resolve: $.extend(resolveDep({
                                files: [
                                    'home/home.contacts.controller',
                                    'contacts/contacts-service',
                                    'contacts/contacts',
                                    'static/js/plugins/angular.plugins/angular-ui-tree/angular-ui-tree.min.css',
                                    'angularUiTree/angular-ui-tree.min',
                                    'treeView'
                                ]}, '', 'contactsDeps'), {
                                groupData: ['contacts', 'contactsDeps',
                                    function (contacts, contactsDeps) {
                                        return contacts.getGroup();
                                    }]
                            }),

                            controller: 'contactsCtr'
                        };

                    if (item.o_resourceid === 10004)
                        homeViews['my@home'] = {
                            resolve: resolveDep({
                                files: [
                                    'home/home.my.controller',
                                    'my/my',
                                    'bootStrap/tab'
                                ]}, '', 'myDeps'),
                            templateUrl: 'base/app/home/home.my.html',     //模板文件
                            controller: 'myCtr'
                        };

                    if (item.o_resourceid === 10003)
                        homeViews['find@home'] = {
                            resolve: resolveDep({
                                files: [
                                    'home/home.find.controller'
                                ]}, '', 'findDeps'),
                            templateUrl: 'base/app/home/home.find.html',
                            controller: 'findCtr'
                        };

                });

                $stateProvider.state("home", {
                    url: "/home",
                    views: homeViews
                })
            }]);
    }
    loadHomeModule();
    return loadHomeModule;
})