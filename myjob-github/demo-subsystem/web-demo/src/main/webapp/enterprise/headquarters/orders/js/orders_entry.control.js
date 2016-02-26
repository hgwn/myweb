/**
 * Created by Administrator on 2015-09-06.
 */
headQuartersOrdersApp.controller("ordersEntryController",['$scope','$rootScope','$http',"$stateParams","$state","i18nService",'ordersService',
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData={pagesize:20,pagenum:1};
    	
    	$scope.contacts = [];
    	$scope.getContact = function(){
            ordersService.getContact($scope.contactkeyword ,function(data, flag){
                console.log(data);
                if(flag){//成功
                    $scope.contacts = data.rows;
                }
                else{//失败

                }
            });
        };
        $scope.onReset = function(){
        	$scope.formData.selectedAcontact = {};
        };
    	//加载数据源汇总
        $http
            .get("../../../baseline/orders/get_orders.do?pagesize=20&pagenum=1&orders=createdtime&orderkey=desc")
            .success(function (data) {
            	var result =angular.copy(data.data.rows);
            	angular.forEach(result,function(data,index,array){
            		data.buyeraddress = data.buyerprovincename + data.buyercityname + data.buyerareaname + data.buyeraddress;
            	});
                $scope.entrygridOptions.data = result;
                $scope.entrygridOptions.totalItems = data.data.total;
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });
    	
        //查询
        $scope.onClickToQuery = function(){
        	if($scope.formData.selectedAcontact != undefined && $scope.formData.selectedAcontact != ""){
        		$scope.formData.buyerid = $scope.formData.selectedAcontact.companyid;
        		$scope.formData.buyerstationid = $scope.formData.selectedAcontact.stationid;
        		$scope.formData.buyername = $scope.formData.selectedAcontact.companyname;
        	}
        	$scope.formData.orders = 'createdtime';
            $scope.formData.orderkey = 'desc';
        	 $http({
                 method : 'POST',
                 url : "/jsbweb/baseline/orders/get_orders.do",
                 data : $.param($scope.formData),
                 headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded'
                 }
             }).success(function(data) {
                 if(data.ret==0){
                	 var result =angular.copy(data.data.rows);
                	 /*angular.forEach(result, function (value, key) {
                 		value.logo
             		});*/
                	 
                    $scope.entrygridOptions.data = result;
                    $scope.entrygridOptions.totalItems = data.data.total;
                 }else if(data.ret==10){
                     $.jBox.tip("请先登录", 'warning');
                 }else{ 
                     $.jBox.tip("获取数据失败", 'warning');
                 }
             }).error(function(rep){
                 $.jBox.tip("获取数据失败", 'warning');
             });
        }
        
    	
    	//展示页面
    	$scope.entrygridOptions = { 
    	     expandableRowTemplate: 'template/expandableRowTemplate.html',
    		 expandableRowHeight: 200,
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : false,
       		 enableColumnMenus: false,
       		 enableGridMenu: true,
       		 columnDefs : [
                            { name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
       		               	{ name:'操作',field:'action', enableHiding: false,
       		                    cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
       		                 '<a style="cursor:pointer; margin-left: 12px;" ui-sref="ordersDetail({ordernum:row.entity.ordernum})" title="查看" ><span class="glyphicon glyphicon-eye-open blue"></span></a>' +   
       		                /*'<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.auditOrders(grid, row.entity)" title="审核" ng-if="row.entity.orderstate == 2"><span class="glyphicon glyphicon-saved green"></span></a>' +
       		                '<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.modifyOrders(grid, row.entity)" title="编辑" ng-hide="row.entity.orderstate != 2" ><span class="glyphicon glyphicon-pencil blue"></span></a>' +
       		                '<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.cancelOrders(row.entity)" title="删除" ng-hide="row.entity.orderstate != 2" ><span class="glyphicon glyphicon-trash red"></span></a>' +*/
       		                '</div>',width:'120',enableCellEdit: false },
       		                { name: '销售单号',field:'ordernum',enableCellEdit: false},
       		                { name: '开单日期',field:'createdtime',enableCellEdit: false},
       		                { name: '订单状态',field:'orderstatename',enableCellEdit: false},
       		                { name: '仓库',field:'warehousename',enableCellEdit: false},
    		                { name: '客户',field:'buyername',enableCellEdit: false},
    		                { name: '总数量',field:'totgoodsqty',enableCellEdit: false},
       		                { name: '总金额',field:'totgoodsmoney',enableCellEdit: false},
       		                { name: '联系电话',field:'buyerphone',enableCellEdit: false},
       		                //{ name: '详细地址',field:'buyeraddress',enableCellEdit: false},
       		               ],
       		            onRegisterApi: function(gridApi) {
       		                $scope.gridApi = gridApi;
	       		             gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
	                             if (row.isExpanded) {
	                                 row.entity.subGridOptions = {
                                		 useExternalPagination: true,
                                         useExternalSorting: false,
                                         enableSorting : false,
                                   		 enableColumnMenus: false,	 
	                                     columnDefs: [
	                                         { name: '商品名称',field:'goodsname'},
	                                         /*{ name: '商品条码',field:'goodsbarcode'},
	                                         { name: '规格',field:'goodsspec'},*/
	                                         { name: '数量',field:'goodsqty'},
	                                         { name: '价格',field:'dealingprice'},
	                                         { name: '赠品',field:'giftflag',cellTemplate:
	                                             '<div class="ui-grid-cell-contents">{{row.entity.giftflag==2?"是":"否"}}</div>'
	                                         }
	                                     ]};
	                                 row.entity.subGridOptions.data = row.entity.orderlist;
	                             }
	                         });
       		                gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
       		                    if(getPage) {
       		                        getPage(newPage, pageSize);
       		                    }
       		                });
       		            }
        };
    	
    	var getPage = function(pagenum, pagesize) {
            $scope.formData.pagenum = pagenum;
            $scope.formData.pagesize = pagesize;
            
            $scope.onClickToQuery();
        };
        $scope.getPage = getPage;
        
        //跳转到新增开单界面
        $scope.add = function(){
        	$state.go("add");
        	
        	if($state.orders.orderid != undefined){
    			location.reload();
    		}
        }
    	
        //修改界面跳转
    	$scope.modifyOrders = function(grid,myRow){
    		console.info(myRow);
    		$state.go("add");
    		//console.warn(angular.toJson(myRow));
    		$state.orders = angular.copy(myRow);
    		
    	}; 
        
    	//审核
    	$scope.auditOrders = function(grid, row){
            var param = {};
            param.orderid = row.orderid;
            param.ordernum = row.ordernum;
            $.jBox.warning("审核销售单号：" +  row.ordernum + "是否通过", "温馨提示", function(v, h, f){
            	if (v == 'yes') {
            		param.orderstate = 3;
        	    }
        	    if (v == 'no') {
        	    	param.orderstate = 4;
        	    }
        	    if (v == 'cancel') {
        	        $.jBox.tip('已取消');
        	        return;
        	    }

            	$http({
		                method: 'POST',
		                url: "/jsbweb/baseline/orders/audit.do",
		                data: $.param(param),
		                headers: {
		                    'Content-Type': 'application/x-www-form-urlencoded'
		                }
		            }).success(function (data) {
		                if(data.ret==0){
		                    $.jBox.tip("操作成功", 'success');
		                    $scope.onClickToQuery();
		                }else if(data.ret==10){
		                    $.jBox.tip("登录信息异常,请重新登录", 'warning');
		                }else{
		                    $.jBox.tip("操作失败", 'warning');
		                }
		            }).error(function(rep){
		                console.log(rep)
		                $.jBox.tip("操作失败", 'warning');
		            });
            });

        };
        //取消销售单
        $scope.cancelOrders = function(row){
            $.jBox.confirm("确定要取消该笔售货单，单号::  " + row.ordernum + " ？", "温馨提示", function(v, h, f){
                if(v == "ok"){
                    var param = {};
                    param.orderid = row.orderid;
                    param.ordernum = row.ordernum;
                    $http({
                        method: 'POST',
                        url: "/jsbweb/baseline/orders/cancel.do",
                        data: $.param(param),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {
                        if(data.ret==0){
                            $.jBox.tip("取消售货单成功", 'success');
                            $scope.onClickToQuery();
                        }else if(data.ret==10){
                            $.jBox.tip("登录信息异常,请重新登录", 'warning');
                        }else{
                            $.jBox.tip("取消售货单失败", 'warning');
                        }
                    }).error(function(rep){
                        console.log(rep)
                        $.jBox.tip("取消售货单失败", 'warning');
                    });
                }
                return true;
            });

        };
        
      //打印预览-pdf
     	$scope.privewToPdf=function(){
     		
     		if ($scope.orders.buyername == undefined || $scope.orders.buyername == "") {
                $.jBox.tip('联系人不能为空', 'warning');
                return ;
            }
     		if ($scope.orders.warehouseid == undefined || $scope.orders.warehouseid == "") {
                $.jBox.tip('仓库不能为空', 'warning');
                return ;
            }
     		
     		if ($scope.orders.buyerphone == undefined || $scope.orders.buyerphone == "") {
                $.jBox.tip('联系电话不能为空', 'warning');
                return ;
            }
     		var params="data="+encodeURIComponent(encodeURIComponent(checkNull(angular.toJson($scope.orders))));
     		window.open("/jsbweb/baseline/orders/reportOrders.do?" +params);
     	};
     	
     	var checkNull = function(v){
    		if(angular.isUndefined(v)||v == null){
    			v = "";
    		}
    		return v;
    	};
}])
.controller("ordersDetailController",['$timeout','$scope','$rootScope','$http',"$stateParams","$state","i18nService",'headQuartersOrdersService',
function($timeout,$scope, $rootScope, $http,$stateParams,$state,i18nService,headQuartersOrdersService) {
	console.info($stateParams.ordernum);
	//根据订单号精确查询订单信息
	var params = {};
	//params.ordernum = $state.broadCast.ordernum;$stateParams
	params.ordernum = $stateParams.ordernum;
	headQuartersOrdersService.httpPost(headQuartersOrdersService.getRefinedOrders(),params,function(resp){
		console.log(resp.data.rows[0]);
		$scope.edit_datas = resp.data.rows[0];
	});
	//返回列表
	$scope.returnToList = function(){
		$state.go("entry");
	};
	//审核
	$scope.modalAudit = function(){
		$("#modalAudit").modal("show");	
	};
	$scope.audit = function(datas,key){
		var params = {};
		params.orderid = datas.orderid;
		params.buyerid = datas.buyerid;
		params.ordernum = datas.ordernum;
		params.remark = datas.auditremark;
		if(key == 3){
			params.orderstate = 3;
			headQuartersOrdersService.httpPost(headQuartersOrdersService.getAuditOrdersUrl(),params,function(resp){
				console.log(resp);
				if(resp.ret == 0){
					$.jBox.tip('审核成功', 'warning');
					$timeout(function(){
						location.reload();	
					},2000);
				}else if(resp.ret == 10){
					$.jBox.tip('请登录', 'warning');
				}else{
					$.jBox.tip('审核失败,'+resp.message, 'warning');
				}
			});
		}else if(key == 4){
			params.orderstate = 4;
			headQuartersOrdersService.httpPost(headQuartersOrdersService.getAuditOrdersUrl(),params,function(resp){
				console.log(resp);
				if(resp.ret == 0){
					$.jBox.tip('审核成功', 'warning');
					$timeout(function(){
						location.reload();	
					},2000);
				}else if(resp.ret == 10){
					$.jBox.tip('请登录', 'warning');
				}else{
					$.jBox.tip('审核失败,'+resp.message, 'warning');
				}
			});
		}
	};
}]);