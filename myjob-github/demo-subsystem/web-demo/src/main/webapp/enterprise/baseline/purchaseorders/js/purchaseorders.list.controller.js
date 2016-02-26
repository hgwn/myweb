purchaseOrdersApp.
controller('purchaseOrdersListController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','uiGridTreeViewConstants','i18nService','$timeout','utils',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,uiGridTreeViewConstants,i18nService,$timeout,utils){
	$scope.edit_datas = {};
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
	$scope.getSuppliers = function(key){
		var params = {};
		params.pagesize = 1000;
		params.pagenum = 1;
		purchaseOrdersService.httpPost(purchaseOrdersService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
			$scope.formData.datas = resp.data.rows;
			//页面初始化的时候默认选中第一位供应商
			if(key == 1){
				$scope.supplier = $scope.formData.datas[0];
				$scope.formData.keyWord = $scope.formData.datas[0].companyname;
				$timeout(function(){
					$scope.getPage(1,$scope.gridOption.paginationPageSize);
				},300);
			}
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        $scope.getSuppliers(2);
    };
    $scope.supplier = {};
    $scope.$watch("supplier",function(){
    	
    });
    //在comboxtable里的文本框输入时触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end	
    //页面初始化的时候默认选中第一位供应商
    $scope.getSuppliers(1);
    
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
		    '<a href="#" ng-show="row.entity.isModify" ng-click="grid.appScope.alertEdit(grid,row.entity)" title="修改"><span class="glyphicon glyphicon-pencil"></span></a>&nbsp;' +
		    '<a href="#" ng-show="row.entity.isDelete" ng-click="grid.appScope.deletePuchaseOrders(grid,row.entity)" title="删除"><span class="glyphicon glyphicon-trash"></span></a>&nbsp;' +
		    '<a href="#" ng-show="row.entity.isAuditOk" ng-click="grid.appScope.auditPuchaseOrders(grid,row.entity,2)" title="审核通过"><span class="glyphicon glyphicon-saved green"></span></a>&nbsp;'+
		    '<a href="#" ng-show="row.entity.isAuditNo" ng-click="grid.appScope.auditPuchaseOrders(grid,row.entity,3)" title="审核不通过"><span class="glyphicon glyphicon-ban-circle red"></span></a>'+
		    '<a href="#" ng-show="row.entity.isPay" ng-click="grid.appScope.payPuchaseOrders(grid,row.entity)" title="付款"><span class="glyphicon glyphicon glyphicon-yen"></span></a>'+
		    
		    '</div>'},             
	      { name: '采购单号', width:'14%', field: 'purchaseordernum'},
	      { name: '订单状态', width:'10%',field: 'orderStateName' },
	      { name: '支付状态', width: '7%', field: 'payStateName' },
	      { name: '供应商', width:'13%', field:'suppliername' },
	      { name: '供应商站点', field: 'supplierstationname' },
	      { name: '地址', width: '18%', field: 'newAddress' },
	      { name: '总金额', width: '7%',field: 'totgoodsmoney' },
	      { name: '总数量', width: '6%', field: 'totgoodsqty' }
	      ],
            
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                    if(getPage) {
                        if (sortColumns.length > 0) {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        } else {
                            paginationOptions.sort = null;
                        }
                        getPage(grid.options.paginationCurrentPage, grid.options.paginationPageSize)
                    }
                });
                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                    if(getPage) {
                        getPage(newPage, pageSize);
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
        $scope.queryParams.supplierid = $scope.supplier.companyid;
        $scope.queryParams.ordernum = $scope.formData.purchaseordernum;
        $scope.queryParams.orderstate = $scope.formData.orderstate;
        $scope.queryParams.paystate = $scope.formData.paystate;
        $scope.queryParams.orders = ['ordernum'];
        $scope.queryParams.orderkey = 'desc';
        purchaseOrdersService.httpPost(purchaseOrdersService.getInternalPurchaseorders(),{data : angular.toJson($scope.queryParams)},function(data){
        	if(data.ret == 0){
        		angular.forEach(data.data.rows,function(data,index,array){
        			//可进行修改采购单订单状态为:1-待审核、3-内部审核失败4-供应商审核失败
        			if(data.orderstate == 1 || data.orderstate == 3 || data.orderstate == 4){
        				data.isModify = true;
        			}else{
        				data.isModify = false;
        			}
        			//可进行取消采购单的订单状态为:1-待审核、3-内部审核失败4-供应商审核失败
        			if(data.orderstate == 1 || data.orderstate == 3 || data.orderstate == 4){
        				data.isDelete = true;
        			}else{
        				data.isDelete = false;
        			}   
        			//可进行供应商审核通过的采购单的采购单的订单状态为:1-待审核、3-内部审核失败
        			if(data.orderstate == 1 || data.orderstate == 3){
        				data.isAuditOk = true;
        			}else{
        				data.isAuditOk = false;
        			}    
        			//可进行供应商审核不通过的采购单的采购单的订单状态为:1-待审核、3-内部审核失败
        			if(data.orderstate == 1 || data.orderstate == 3){
        				data.isAuditNo = true;
        			}else{
        				data.isAuditNo = false;
        			} 
        			//可进行采购方支付
        			if(data.orderstate == 5 || data.orderstate == 6){
        				data.isPay = true;
        			}else{
        				data.isPay = false;
        			} 
        			//支付状态中文名字
        			data.payStateName = $scope.convertPayStateName(data.paystate);
        			//订单状态中文名字
        			data.orderStateName = $scope.convertOrderStateName(data.orderstate);
        			//地址拼接
        			if(data.orderaddress.orderaddressid != undefined && data.orderaddress.orderaddressid != ''){
        				data.newAddress = data.orderaddress.provincename + data.orderaddress.cityname + data.orderaddress.areaname + data.orderaddress.address;
        			}else{
        				data.newAddress = "";
        			}
        			//操作动作
        			angular.forEach(data.purchaseorderlist,function(d,i,a){
        				d.action = 'modify';
        			});
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
    
    //查询采购单
    $scope.searchInternalPurchaseorders = function(){
    	$scope.getPage(1,$scope.gridOption.paginationPageSize);
    };
    //编辑采购单
    $scope.alertEdit = function(grid,entity){
    	if(entity.orderstate == 1 || entity.orderstate == 3 || entity.orderstate == 4){
    		$rootScope.editDatas = entity;
    		$state.go("editPurchaseorders");
    		/*$timeout(function(){
        		$("#editPurchaseOrders").modal("show");
        		$rootScope.recoverAddress();   			
    		},200);*/
    	}else{
    		$alert({title: '提示：', content: '该订单状态的采购单不可编辑!' , placement: 'masget-top',type: 'warning', duration:2, show: true});
    	}
    };
    //查看采购单
    $scope.viewPuchaseOrders = function(grid,entity){
    	$scope.edit_datas = entity;
    	/*angular.forEach($scope.edit_datas.purchaseorderlist,function(data,index,array){
    		data.itemSum = parseFloat(data.dealingprice) * data.dealingprice();
    	});*/
    	console.info(entity);
		$timeout(function(){
			$("#viewPurchaseOrders").modal("show");
			/*$rootScope.recoverAddress();*/   			
		},200);
    };
    //采购方公司内部审核通过采购单
    $scope.auditPuchaseOrders = function(gird,entity,key){
    	if(key == 2){
        	$confirm("确定要审核通过?",function(){
            	var params = {};
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	//2-内部审核通过,待供应商审核
            	params.orderstate = 2;
            	purchaseOrdersService.httpPost(purchaseOrdersService.auditInternalPurchaseorders(),params,function(resp){
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
    	}else if(key == 3){
        	$confirm("确定要审核不通过?",function(){
            	var params = {};
            	params.purchaseordernum = entity.purchaseordernum;
            	params.purchaseorderid = entity.purchaseorderid;
            	//3-内部审核不通过,待供应商审核
            	params.orderstate = 3;
            	purchaseOrdersService.httpPost(purchaseOrdersService.auditInternalPurchaseorders(),params,function(resp){
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
        	},{scope:$scope});    		
    	}

    };
    //取消采购单
    $scope.deletePuchaseOrders = function(grid,entity){
    	$confirm("确定要取消订单吗?",function(){
        	var params = {};
        	params.purchaseordernum = entity.purchaseordernum;
        	params.purchaseorderid = entity.purchaseorderid;
        	purchaseOrdersService.httpPost(purchaseOrdersService.cancelPurchaseorders(),params,function(resp){
        		console.info(resp);
        		if(resp.ret == 0){
        			$alert({title: '提示：', content: '取消采购单成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
        			$scope.getPage(1,$scope.gridOption.paginationPageSize);
        		}else if(resp.ret == 10){
        			$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
        		}else{
        			$alert({title: '提示：', content: '取消采购单发生异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
        		}
        	}); 
    	},{scope:$scope});
    };
    //采购方支付
    $scope.payPuchaseOrders = function(gird,entity){
		purchaseOrdersService.setPayData(entity);
		$timeout(function(){
	    	$state.go("purchaseordersPayment");
	    },1000);
    };
    //切换到开单页面
    $scope.toPurchaseOrdersAdd = function(){
    	$state.go("purchaseOrdersAdd");
    };
}]).
controller('purchaseOrdersViewController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','commodityService','$timeout',
   function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,commodityService,$timeout){
    
}]);