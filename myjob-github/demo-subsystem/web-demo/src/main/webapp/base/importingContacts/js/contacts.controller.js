angular.module('masgetWebApp.contacts')
.controller('contactsCtr',['$scope', '$state', '$popover', '$http','$timeout','$rootScope', 'groupData', '$modal', '$alert','utils','$q','session','i18nService',
                           function ($scope, $state, $popover, $http,$timeout,$rootScope, groupData, $modal, $alert,utils,$q,session,i18nService) {
	$rootScope.isShowList=true;
    //ui-grid 分页汉化
    i18nService.setCurrentLang('zh-cn');

    $scope.contacts = utils.arrayDataToTree(groupData, "addressgroupid", "addressgrouppid", "0", 0);
    angular.forEach($scope.contacts,function(item,key){
    	if(item.addressgroupname == "我的组织"){
    		$scope.contacts.splice(key,1);
    	}
    })
    $scope.menuEnum = {importingContacts: "importingContacts"}
    $scope.isSysGroup = true;
    $scope.searchInput='';

    //查询
    $scope.contactsfind = {
    		pageSize:15,
    		pageNum:1,
            scenetypeid:''
    }
    $scope.check = function(){
    	var obj = {};
    	var ordersArray = new Array();
   	 	ordersArray[0] = "companyname";
	   	obj.orders = ordersArray;
		obj.orderkey = "asc";
		if($scope.contactsfind.companyname!=null&&$scope.contactsfind.companyname!=""){
			obj.companyname = $scope.contactsfind.companyname;
		}
        if($scope.contactsfind.scenetypeid != undefined &&$scope.contactsfind.scenetypeid !='' &&$scope.contactsfind.scenetypeid != null){
            obj.scenetypeid = $scope.contactsfind.scenetypeid;
        }
    	obj.pagesize = $scope.contactsfind.pageSize;
    	obj.pagenum = $scope.contactsfind.pageNum;
    	$scope.contactsExportData = obj;
    	
    	var Data = {};
        Data.data = JSON.stringify(obj);
    	$http({
    		method : 'POST',
    		url : "/jsbweb/base/contractorinfo/getcustomer.do",
    		data:$.param(Data),
    		headers : {
    			'Content-Type' : 'application/x-www-form-urlencoded'
    		}
    	}).success(function(resp) {
    		if(resp.ret == 0){
    			$scope.result = resp.data.rows;
    			$scope.total = resp.data.total;
                angular.forEach(resp.data.rows,function(item,key){
                    item.Alladress = '';
                    if(item.provincename != undefined &&item.provincename != null){
                        item.Alladress = item.provincename;
                        item.pca = item.provincename
                    }
                    if(item.cityname != undefined &&item.cityname != null){
                        item.Alladress += item.cityname;
                        item.pca = item.pca + ' ' + item.cityname
                    }
                    if(item.areaname != undefined && item.areaname != null){
                        item.Alladress += item.areaname
                        item.pca = item.pca + ' ' + item.areaname;
                    }
                    if(item.address != undefined && item.address != null){
                        item.Alladress += item.address;
                    }
                })
                $scope.gridOptions.data = resp.data.rows;
                $scope.gridOptions.totalItems = resp.data.total;
    		}
    	})
    }
    $scope.check();

    $scope.gridOptions = {
       //显示table的th
       columnDefs: [
           { name: '序号',field:'id', width:60,cellTemplate:
               '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
           },
           {name:'操作', field:'',width:140,pinnedRight:true,
               cellTemplate: '<div class="ui-grid-cell-contents">' +
               '<a style="cursor:pointer;" ng-click="grid.appScope.edit(row.entity)" title="编辑" class=""><span class="glyphicon glyphicon-pencil bule">编辑</span></a>' +
               '<a style="cursor:pointer; margin-left: 8px;" ng-click="grid.appScope.deleteImport(row.entity)" title="删除" class=""><span class="glyphicon glyphicon-trash">删除</span></a>' +
               '</div>'
           },
           { name: '公司名称',field:'companyname' ,width:150},
           { name: '公司简介',field:'profile',width:150},
           { name: '联系人',field:'contactname',width:100},
           { name: '联系电话',field:'mobilephone',width:100},
           { name: '传真号',field:'faxnumber',width:100},
           { name: '公司地址',field:'Alladress',width:250},
           { name: '商户类型',field:'scenetypename',width:100},
           { name: '分组类型',field:'saasgrouptypename',width:100},
           { name: '分组名',field:'addressgroupname',width:100},
           { name: '自定义1',field:'remark1',width:100},
           { name: '自定义2',field:'remark2',width:100},
           { name: '自定义3',field:'remark3',width:100}
       ],
       paginationPageSizes: [5, 10, 15,20,25,50,100],
       paginationPageSize: 15,
       useExternalPagination: true,
       enableGridMenu: true,
       enableColumnMenus: false,
       onRegisterApi: function(gridApi){
           $scope.gridApi = gridApi;
           $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
               if($scope.getPage) {
                   $scope.getPage(newPage, pageSize);
               }
           });
       }
    };

    $scope.getPage = function(pagenum, pagesize, orders,orderkey) {
       $scope.contactsfind.pageNum = pagenum
       $scope.contactsfind.pageSize = pagesize;
       $scope.check();
    };


    //导出
    $scope.contactsExport = function(){
        if($scope.contactsfind.scenetypeid == ''){
            $scope.contactsfind.scenetypeid = null;
        }
        window.location.href='/jsbweb/base/contractorinfo/export.do?scenetypeid='+$scope.contactsfind.scenetypeid + '&pagesize=' + $scope.contactsfind.pageSize + '&pagenum=' + $scope.contactsfind.pageNum;
    }
    
    //获取分组
    $scope.getOptionGroups = function(item){
    	utils.query("/jsbweb/contacts.do?type=group.getbyscenetype&scenetypeid=" + item).then(function (resp) {
			 $scope.addContactModel.optionGroups = resp.data.rows;
		 })
    }
    
    //编辑
    $scope.edit = function(item){
    	$scope.addnewfriend = true;
    	$scope.addressgroupModel = true;
    	$scope.addContactModel = angular.copy(item)
    	$scope.getOptionGroups(item.scenetypeid);
    	var pca = "";
    	var pcaid = "";
    	if(item.provincename!=null){
    		pca = item.provincename + " " + item.cityname;
    		if(item.areaname!=null){
    			pca = pca + " " + item.areaname;
    		}
    		$scope.addContactModel.pca = pca;
    	}
    	if(item.provinceid!=null){
    		pcaid = item.provinceid + "&" + item.cityid;
    		if(item.areaid!=null){
    			pcaid = pcaid + "&" + item.areaid;
    		}
    		$scope.addContactModel.addressids = pcaid;
    	}
    	$scope.modalFooterHide = true;
    	$modal({
            scope: $scope,
            template: 'modal/modal.confirm.tpl.html',
            animation: 'am-fade-and-scale',
            html: true,
            placement: 'center',
            title: "添加新朋友",
            contentTemplate: "/jsbweb/base/app/contacts/contacts.addnewfriend.html",
            callback: function (target, msg) {

                var pcaIds = $scope.addContactModel.addressids.split("&");
                var pcaNames = $scope.addContactModel.pca.split(" ");
                if (pcaIds.length == 3) {
                    $scope.addContactModel.provinceid = pcaIds[0];
                    $scope.addContactModel.cityid = pcaIds[1];
                    $scope.addContactModel.areaid = pcaIds[2]
                }else{
                	$scope.addContactModel.cityid = null;
                }

                if (pcaNames.length == 3) {
                    $scope.addContactModel.provincename = pcaNames[0];
                    $scope.addContactModel.cityname = pcaNames[1];
                    $scope.addContactModel.areaname = pcaNames[2]
                }
                
                console.info($scope.addContactModel);
                if($scope.addContactModel.cityid!=null){
	                utils.query("/jsbweb/base/contractorinfo/modify.do", {type: "post", method: "post", data: {data: JSON.stringify($scope.addContactModel)}}).then(function (resp) {
	                    if (resp.ret == 0) {
	                        $alert({title: '提示：', content: '修改成功！', placement: 'masget-top', duration: 1, type: 'info', show: true});
	                        $scope.check();
	                    } else {
	                        $alert({title: '提示：', content: '修改失败！', placement: 'masget-top', duration: 1, type: 'info', show: true});
	                    }
	                });
                }else {
                	$alert({title: '提示：', content: '地址中的省/市/县(区)不能为空！', placement: 'masget-top', duration: 2, type: 'info', show: true});
                	return false;
        		}
            }
        })
    }

    $scope.deleteImport = function(item){
        $scope.modalFooterHide = false;
    	$modal({
            scope: $scope,
            template: 'modal/modal.confirm.tpl.html',
            animation: 'am-fade-and-scale',
            html: true,
            placement: 'center',
            title: "提示",
            content: "确认要删除公司名为"+item.companyname+"的数据？",
            callback: function (target, msg) {
            	utils.httpGet("/jsbweb/base/contractorinfo/delete.do?contractorinfoid="+item.contractorinfoid, function (resp) {
            		if(resp.ret == 0){
            			$alert({title: '提示：', content: '删除成功！', placement: 'masget-top', duration: 2, type: 'info', show: true});
            			$scope.check();
            		}else{
            			$alert({title: '提示：', content: '删除失败！', placement: 'masget-top', duration: 2, type: 'info', show: true});
            		}
            	})
            }})
    }
    
    //--开始--
    //添加新朋友
    $scope.scenetype = [];

    angular.forEach($scope.contacts,function(item,key){
        item.id = item.scenetypeid;
        item.name = item.scenetypename;
        $scope.scenetype.push(item)
    })

    $scope.addFriends = function () {
        $scope.subgroupAddFlag = true;
    	$scope.addnewfriend = false;
    	$scope.addressgroupModel = false;
    	$scope.addContactModel = {};
        $scope.modalFooterHide = true;
        $modal({
            scope: $scope,
            template: 'modal/modal.confirm.tpl.html',
            animation: 'am-fade-and-scale',
            html: true,
            placement: 'center',
            title: "添加新朋友",
            contentTemplate: "/jsbweb/base/app/contacts/contacts.addnewfriend.html",
            callback: function (target, msg) {

                var pcaIds = $scope.addContactModel.addressids.split("&");
                var pcaNames = $scope.addContactModel.pca.split(" ");
                if (pcaIds.length == 3) {
                    $scope.addContactModel.provinceid = pcaIds[0];
                    $scope.addContactModel.cityid = pcaIds[1];
                    $scope.addContactModel.areaid = pcaIds[2]
                }

                if (pcaNames.length == 3) {
                    $scope.addContactModel.provincename = pcaNames[0];
                    $scope.addContactModel.cityname = pcaNames[1];
                    $scope.addContactModel.areaname = pcaNames[2]
                }
                
                if($scope.addContactModel.cityid!=null){
                	utils.query("/jsbweb/contractor.do?type=add", {type: "post", method: "post", data: {formData: JSON.stringify($scope.addContactModel)}}).then(function (resp) {
                		if (resp.ret == 0) {
                			$alert({title: '提示：', content: '新增成功！', placement: 'masget-top', duration: 1, type: 'info', show: true});
            				$scope.addContactModel = {};
                			$scope.check();
                		} else {
                			$alert({title: '提示：', content: '新增失败！', placement: 'masget-top', duration: 1, type: 'info', show: true});
                		}
                	});
                }else {
                	$alert({title: '提示：', content: '地址中的省/市/县(区)不能为空！', placement: 'masget-top', duration: 2, type: 'info', show: true});
                	return false;
        		}
            }
        })
    }
    //--结束--

    //增加分组
    $scope.subgroupAdd = function () {
        $scope.node = {};
        $scope.addressgrouptypes = [];
        utils.query("/jsbweb/saas.do?type=addressgrouptype&companytypeid="+session.companytypeid).then(function(resp){
            $scope.addressgrouptypes = resp.data.rows;
        })
        $modal({
            html: true,
            title: '添加分组',
            scope:$scope,
            template: 'html/contacts.modal.tpl.html',
            contentTemplate: 'html/addGroup.tpl.html',
            callback: function (element, msg) {
                utils.query("/jsbweb/contacts.do?type=addGroup" + utils.parseRequestData({
                    addressgrouppid:  $scope.node.addressgroupid,
                    addressgroupname: $scope.node.addressgroupname,
                    scenetypeid: $scope.node.scenetypeid,
                    saasgrouptypeid:$scope.node.saasgrouptypeid
                })).then(function (resp) {
                    $alert({title: '提示：', content: '添加成功！', placement: 'masget-top', duration: 2, type: 'info', show: true});
                    $scope.addContactModel.scenetypeid = '';
                });
            }
        });
    }

    $scope.node = {}
    $scope.change =function(id,items){
        angular.forEach(items,function(item,key){
            if(id == item.scenetypeid){
                $scope.node = {
                    addressgroupid : item.addressgroupid,
                    scenetypeid : item.scenetypeid
                }
            }
        })
    }

}])