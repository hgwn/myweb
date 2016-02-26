purchaseOrdersApp.
controller('externalPurchaseOrdersListController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','uiGridTreeViewConstants','i18nService','$timeout','utils','$modal',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,uiGridTreeViewConstants,i18nService,$timeout,utils,$modal){
	$scope.edit_datas = {};
	//登录信息
	$scope.sessionData = {};
	i18nService.setCurrentLang('zh-cn');
	//支付状态
	$scope.payStateLists = [
            { id : 0 , value : "空"},
			{ id : 1 , value : "待支付"},
			{ id : 2 , value : "部分支付"},
			{ id : 3 , value : "已支付"}
	];
	//订单状态
	$scope.orderStateList = [
            { id : 0 , value : "空"},
			{ id : 1 , value : "待审核"},
			{ id : 2 , value : "待供应商审核"},
			{ id : 3 , value : "内部审核失败"},
			{ id : 4 , value : "供应商审核失败"},
			{ id : 5 , value : "待受理"},
			{ id : 6 , value : "待收货"},
			{ id : 7 , value : "已收货，待入库"},
			{ id : 8 , value : "已入库，订单完成"},
			{ id : 9 , value : "待供应商确认"},
			{ id : 10 , value : "订单已取消"}
	];
	//供应商下拉表格start
	$scope.formData ={};
	$scope.formData.orderstate = 0;
	$scope.formData.paystate = 0;
	$scope.getSuppliers = function(pagesize,pagenum,companyname){
		var data = {};
		data.scenetypeid = 3;
		data.pagesize = pagesize;
		data.pagenum = pagenum;
		data.companyname = companyname;	
		purchaseOrdersService.httpPost(purchaseOrdersService.getAllSuppliers(),data,function(resp){
			$scope.formData.datas = resp.data.rows;
			$scope.formData.total = resp.data.total;
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        $scope.getSuppliers($scope.formData.pagesize,$scope.formData.pagenum,$scope.formData.keyWord);
    };
	var countClickSupplierQuery = 0;
    $scope.supplier = {};
    $scope.$watch("supplier",function(){
    	console.info(countClickSupplierQuery);
    	if(countClickSupplierQuery == 2){
    		$alert({title: '警告：', content: '更改供应商后,商品添加记录会被清空!', placement: 'masget-top',type: 'warning', duration:2, show: true});
    	}
    });
    //在comboxtable里的文本框输入时触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end	
	//支付状态转换
    $scope.convertPayStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.payStateLists.length; i++) {
            if ($scope.payStateLists[i].id == flag) {
                name = $scope.payStateLists[i].value;
            }
        }
        return name;
    };
	//订单状态转换
    $scope.convertOrderStateName = function (flag) {
        var name = "";
        for (var i = 0; i < $scope.orderStateList.length; i++) {
            if ($scope.orderStateList[i].id == flag) {
                name = $scope.orderStateList[i].value;
            }
        }
        return name;
    };
	//ui-grid of Tree View
	$scope.gridOption = {
          paginationPageSizes: [5, 10, 20, 50, 100],
          paginationPageSize: 20,
          enableColumnMenus: false,
          enableGridMenu: true,
	      columnDefs: [
          { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
		  { name: '操作', enableHiding: false, field:'action', width: '9%', enableFiltering: false,
		    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
		    '<a href="#" class="" ng-click="grid.appScope.viewPuchaseOrders(grid,row.entity)" title="查看"><span class="glyphicon glyphicon-eye-open blue"></span></a>&nbsp;'+
		    /*'<a href="#" ng-show="row.entity.isAuditOk" ng-click="grid.appScope.auditPuchaseOrders(grid,row.entity,5)" title="审核通过"><span class="glyphicon glyphicon-saved green"></span></a>&nbsp;'+
		    '<a href="#" ng-show="row.entity.isAuditNo" ng-click="grid.appScope.auditPuchaseOrders(grid,row.entity,4)" title="审核不通过"><span class="glyphicon glyphicon-ban-circle red"></span></a>&nbsp;'+*/
		    '<a href="#" ng-show="row.entity.isAuditOk" ng-click="grid.appScope.auditModal(grid,row.entity)" title="审核"><span class="glyphicon glyphicon-saved green"></span></a>&nbsp;'+
		    /*'<a href="#" ng-show="row.entity.isAuditNo" ng-click="grid.appScope.auditModal(grid,row.entity,4)" title="审核不通过"><span class="glyphicon glyphicon-ban-circle red"></span></a>&nbsp;'+*/
		    '<a href="#" ng-show="row.entity.isAcceptOk" ng-click="grid.appScope.acceptModal(grid,row.entity,6)" title="受理"><span class="glyphicon glyphicon-ok green"></span></a>'+
		    '</div>'},             
	      { name: '采购单号', width:'14%', field: 'purchaseordernum'},
	      { name: '订单状态', width:'10%',field: 'orderStateName' },
	      { name: '支付状态', width: '7%', field: 'payStateName' },
	      { name: '采购方', width:'13%', field:'suppliername' },
	      { name: '采购方站点', field: 'supplierstationname' },
	      { name: '地址', width: '18%', field: 'newAddress' },
	      { name: '总金额', width: '7%',field: 'totgoodsmoney' },
	      { name: '总数量', width: '6%', field: 'totgoodsqty' }],
            
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if(getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize, paginationOptions.sort)
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize, paginationOptions.sort);
                    }
                });
                $scope.gridApi.grid.refresh();
            }
	};
	//ui grid分页
    var getPage = function(pagenum, pagesize, sort) {
    	$scope.queryParams = {};
        $scope.queryParams.pagenum = pagenum;
        $scope.queryParams.pagesize = pagesize;
        $scope.queryParams.enterpriseid = $scope.supplier.companyid;
        $scope.queryParams.purchaseordernum = $scope.formData.purchaseordernum;
        purchaseOrdersService.httpPost(purchaseOrdersService.getExternalPurchaseordersUrl(),$scope.queryParams,function(data){
        	if(data.ret == 0){
        		angular.forEach(data.data.rows,function(data,index,array){ 
        			//可进行供应商审核通过的采购单的订单状态为:2待供应商审核状态
        			if(data.orderstate == 2){
        				data.isAuditOk = true;
        			}else{
        				data.isAuditOk = false;
        			}    
        			if(data.orderstate == 2){
        				data.isAuditNo = true;
        			}else{
        				data.isAuditNo = false;
        			}
        			if(data.orderstate == 5){
        				data.isAcceptOk = true;
        			}else{
        				data.isAcceptOk = false;
        			}
        			
        			//支付状态中文名字
        			data.payStateName = $scope.convertPayStateName(data.paystate);
        			//订单状态中文名字
        			data.orderStateName = $scope.convertOrderStateName(data.orderstate);
        			//地址拼接
        			data.newAddress = data.provincename + data.cityname + data.areaname + data.address;
        		});
        		$scope.gridOption.data = data.data.rows;
        		$scope.gridOption.totalItems = data.data.total;
        	}else if(data.ret == 10){
            	$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
            }else{
        		$alert({title: '提示：', content: '查询采购单异常,'+data.message, placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
    };
    $scope.getPage = getPage;
    $scope.getPage(1,$scope.gridOption.paginationPageSize);
    //查询采购单
    $scope.searchInternalPurchaseorders = function(){
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
    //查看采购单
    $scope.viewPuchaseOrders = function(grid,entity){
    	console.info(entity);
    	$scope.edit_datas = entity;
		$timeout(function(){
			$("#viewPurchaseOrders").modal("show");		
		},200);
    };
    
    //弹出审核模态窗口
    $scope.auditModal = function(gird,entity){
    	$scope.datas = entity;
		$timeout(function(){
			$("#auditPurchaseOrders").modal("show");		
		},300);
    };
    //弹出受理窗口
    $scope.acceptModal = function(gird,entity,key){
    	$scope.acceptDatas = entity;
    	$scope.acceptDatas.acceptKey = key;
		$timeout(function(){
			$("#acceptPurchaseOrders").modal("show");		
		},200);
    };
    //采购方公司内部审核通过采购单
    $scope.auditPuchaseOrders = function(gird,entity,key){
    	if(key == 5){
        	$confirm("确定要审核通过?",function(){
        		angular.forEach(entity.purchaseorderlist,function(data,index,array){
        			data.auditstate = 2;
        		});
            	var params = {};
            	params.purchaseorderlist = [];
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	params.enterpriseid = entity.enterpriseid;
            	params.auditremark = entity.auditremark;
            	//5-供应商审核通过，待受理
            	params.orderstate = 5;
            	params.purchaseorderlist = angular.copy(angular.toJson(entity.purchaseorderlist));

            	console.info(params);
            	purchaseOrdersService.httpPost(purchaseOrdersService.auditExternalPurchaseorders(),params,function(resp){
            		console.info(resp);
            		if(resp.ret == 0){
            			$alert({title: '提示：', content: '审核通过成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
            			$scope.getPage(1,$scope.gridOption.paginationPageSize);
            		}else if(resp.ret == 10){
            			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            		}else{
            			$alert({title: '提示：', content: '审核发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            		}
            	});    		
        	},{scope:$scope});    		
    	}else if(key == 4){
        	$confirm("确定要审核不通过?",function(){
        		angular.forEach(entity.purchaseorderlist,function(data,index,array){
        			data.auditstate = 3;
        		});
        		//参数
            	var params = {};
            	params.purchaseorderlist = [];
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	params.enterpriseid = entity.enterpriseid;
            	params.auditremark = entity.auditremark;
            	//5-供应商审核通过，待受理
            	params.orderstate = 4;
            	params.purchaseorderlist = angular.copy(angular.toJson(entity.purchaseorderlist));
            	console.info(params);
            	purchaseOrdersService.httpPost(purchaseOrdersService.auditExternalPurchaseorders(),params,function(resp){
            		console.info(resp);
            		if(resp.ret == 0){
            			$alert({title: '提示：', content: '审核不通过成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
            			$scope.getPage(1,$scope.gridOption.paginationPageSize);
            		}else if(resp.ret == 10){
            			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
            		}else{
            			$alert({title: '提示：', content: '审核发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
            		}
            	});  
        		//输入不通过原因
               /* $modal({callback: function (element, msg) {
                	params.auditremark = $("#modifyName").val();
                	$scope.audit(params);
                },
                    html: true,
                    title: '审核不通过原因',
                    template: 'modal/modal.confirm.tpl.html',
                    content: '<div class="input-group"><span class="input-group-addon" id="basic-addon2">备注：</span><input id="modifyName" type="text" class="form-control" ng-modal="auditremark" value="" aria-describedby="basic-addon2"></div>'
                });*/
  		
        	},{scope:$scope});    		
    	}else if(key == 6){
    		//参数
        	var params = {};
        	params.purchaseordernum = entity.purchaseordernum;
        	params.purchaseorderid = entity.purchaseorderid;
        	params.enterpriseid = entity.enterpriseid;
        	//params.warehouseid = $scope.sessionData.stationid;
        	console.info(entity.warehouseid);
        	if(entity.warehouseid == undefined || entity.warehouseid == ''){
        		$alert({title: '提示：', content: '请选择出货仓库!', placement: 'masget-top',type: 'info', duration:2, show: true});
        	    return ;
        	}else{
        		$("#acceptPurchaseOrders").modal("hide");
        	}
        	params.warehouseid = entity.warehouseid;
        	console.info(params);
        	purchaseOrdersService.httpPost(purchaseOrdersService.acceptExternalPurchaseorders(),params,function(resp){
        		console.info(resp);
        		if(resp.ret == 0){
        			$alert({title: '提示：', content: '成功受理!', placement: 'masget-top',type: 'info', duration:2, show: true});
        			$scope.getPage(1,$scope.gridOption.paginationPageSize);
        		}else if(resp.ret == 10){
        			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
        		}else{
        			$alert({title: '提示：', content: '受理发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        		}
        	});
    	}
    };
}]).
controller('externalPurchaseOrdersAcceptController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','commodityService','$timeout',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,commodityService,$timeout){
	//查询仓库
	$http({
        method: 'POST',
        url: "/jsbweb/station/list.do?",
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }).success(function (data) {
        if(data.data!=null){
            $scope.storehouses = data.data.rows;
            console.info(data);
        }
    });
}]);