/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersEntryController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService",'ordersService',
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData={pagesize:20,pagenum:1};
    	
    	$scope.contacts = [];
    	$scope.getContact = function(){
            ordersService.getContact($scope.contactkeyword ,function(data, flag){
                if(flag){//成功
                    $scope.contacts = data.rows;
                }
                else{//失败

                }
            });
        };
        $scope.formData.paystate = 0;
        //支付状态
    	$scope.payStateLists = [
                { id : 0 , value : "全部"},
    			{ id : 1 , value : "待支付"},
    			{ id : 2 , value : "部分支付"},
    			{ id : 3 , value : "已支付"}
    	];
    	
    	//加载数据源汇总
        $http
            .get("../../../baseline/orders/get_orders.do?pagesize=20&pagenum=1&orders=createdtime&orderkey=desc")
            .success(function (data) {
            	
            	if (data.ret == 0) {
            		var result =angular.copy(data.data.rows);
            		angular.forEach(result,function(data,index){
               		 switch(data.orderstate)
               	        {
               	              case 2:
               	            	  data.orderstatename = "待审核";
               	            	  break;
               	              case 3:
               	            	  data.orderstatename = "待财务审核";
               	            	  break;
               	              case 12:
               	            	  data.orderstatename = "待出库审核";  
               	            	break;
               	              case 9:
               	            	  data.orderstatename = "待发货";
               	            	break;
               	              case 5:
               	            	  data.orderstatename = "已完成";
               	            	break;
               	              case 8:
               	            	  data.orderstatename = "订单取消";
               	            	break;
               	        }
	               		switch(data.paystate){
	     	              case 0:
	     	            	  data.paystateName = "空";
	     	            	  break;
	     	              case 1:
	     	            	  data.paystateName = "待支付";
	     	            	  break;
	     	              case 2:
	     	            	  data.paystateName = "部分支付";  
	     	            	break;
	     	              case 3:
	     	            	  data.paystateName = "已支付";
	     	            	break;
	               		}
                	});
                	
                    $scope.entrygridOptions.data = result;
                    $scope.entrygridOptions.totalItems = data.data.total;
                    
                    console.info($scope.entrygridOptions.data);
                }
                if (data.ret == 1000) {
                    $.jBox.tip("请先登录", 'warning');
                }
            });
        
        //查询
        $scope.onClickToQuery = function(){
        	
        	if($scope.formData.selectedAcontact != undefined && $scope.formData.selectedAcontact != ""){
        		
        		$scope.formData.buyername = $scope.formData.selectedAcontact.companyname;
        	}
        	
        	if($scope.formData.contactkeyword == ""){
        		$scope.formData.buyername = '';
        		$scope.formData.selectedAcontact = '';
        	}
        	
        	$scope.formData.orders = 'createdtime';
            $scope.formData.orderkey = 'desc';
            
            /*$scope.formData.begincreatedtime = $scope.formData.begincreatedtime +' 00:00:00'; 
            $scope.formData.endcreatedtime = $scope.formData.endcreatedtime +' 23:59:59'; */   
        	 
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
                	 angular.forEach(result,function(data,index){
                		 switch(data.orderstate)
                	        {
               	              case 2:
               	            	  data.orderstatename = "待审核";
               	            	  break;
               	              case 3:
               	            	  data.orderstatename = "待财务审核";
               	            	  break;
               	              case 12:
               	            	  data.orderstatename = "待出库审核";  
               	            	break;
               	              case 9:
               	            	  data.orderstatename = "待发货";
               	            	break;
               	              case 5:
               	            	  data.orderstatename = "已完成";
               	            	break;
               	              case 8:
               	            	  data.orderstatename = "订单取消";
               	            	break;
                	        }
                		 switch(data.paystate){
	     	              case 0:
	     	            	  data.paystateName = "空";
	     	            	  break;
	     	              case 1:
	     	            	  data.paystateName = "待支付";
	     	            	  break;
	     	              case 2:
	     	            	  data.paystateName = "部分支付";  
	     	            	break;
	     	              case 3:
	     	            	  data.paystateName = "已支付";
	     	            	break;
	               		}
                 	});
                    $scope.entrygridOptions.data = result;
                    $scope.entrygridOptions.totalItems = data.data.total;
                    
                    console.info(result)
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
    	     expandableRowTemplate: 'tpls/expandableRowTemplate.html',
    		 expandableRowHeight: 200,
			 paginationPageSizes: [10, 20, 50, 100],
             paginationPageSize: 20,
             useExternalPagination: true,
             useExternalSorting: false,
             enableSorting : false,
       		 enableColumnMenus: false,
       		 enableGridMenu: true,
       		 selectionRowHeaderWidth: 35,
       		 columnDefs : [
       		               	{ name:'操作',field:'action',
       		                    cellTemplate: '<div class="ui-grid-cell-contents">' +
       		                    /*'<a style="cursor:pointer; margin-left: 12px;" id="modal-619069" href="#" data-toggle="modal" data-target="#modal-container-619069" ng-click="grid.appScope.printOrders(row.entity)" title="查看" ><span class="glyphicon glyphicon-eye-open blue"></span></a>' +   
       		              */
       		                    /*'<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.printOrders(row.entity)" title="查看" ><span class="glyphicon glyphicon-eye-open blue"></span></a>' +      
       		                 */
       		                    '<a style="cursor:pointer; margin-left: 12px;" ui-sref="check({ordernum:row.entity.ordernum,pagesize:20,pagenum:1})" title="查看" ><span class="glyphicon glyphicon-eye-open blue">查看</span></a>' +      
       		                 
       		                 /*'<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.auditOrders(grid, row.entity)" title="审核" ng-if="row.entity.orderstate == 2">' +
       		                 '<span class="glyphicon glyphicon-saved green">审核</span></a>' +*/
       		                /*'<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.modifyOrders(grid, row.entity)" title="编辑" ng-hide="row.entity.orderstate != 2" ><span class="glyphicon glyphicon-pencil blue"></span></a>' +
       		               */
       		                '<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.cancelOrders(row.entity)" title="删除" ng-if="row.entity.orderstate == 2" ><span class="glyphicon glyphicon-trash red">取消</span></a>' +
       		                '</div>',width:'120',enableCellEdit: false },
       		                { name: '销售单号',field:'ordernum',enableCellEdit: false},
       		                { name: '开单日期',field:'createdtime',enableCellEdit: false},
       		               /*{ name: '仓库',field:'warehousename',enableCellEdit: false},*/
    		                { name: '经销商',field:'buyername',enableCellEdit: false},
    		                { name: '订单状态',field:'orderstatename',enableCellEdit: false},
    		                { name: '支付状态',field:'paystateName',enableCellEdit: false},
    		                /*{ name: '客户',field:'buyercompanyname',enableCellEdit: false},*/
    		                { name: '总数量',field:'totgoodsqty',enableCellEdit: false},
       		                { name: '总金额',field:'totgoodsmoney',enableCellEdit: false},
       		                { name: '已付金额',field:'paidmoney',enableCellEdit: false}
       		                
       		                /*{ name: '联系电话',field:'buyerphone',enableCellEdit: false},*/
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
        	
        	/*if($state.orders.orderid != undefined){*/
    			location.reload();
    		/*}*/
        }
        
    	//查看详情界面跳转
    	$scope.printOrders = function(myRow){
    		
    		console.info(myRow);
    		
    		//$state.go('check',{'ordernum':myRow.ordernum});
    		$state.go('check');
    		
    		 /*$http.post('/jsbweb/baseline/orders/get_orders.do',{params:$stateParams})
    	        .success(function(data,status,headers,config){
    	            $scope.orders = data.data.rows;
    	        });*/
    		
    		$state.orders = angular.copy(myRow);
    	};
    	
        
        //修改界面跳转
    	$scope.modifyOrders = function(grid,myRow){
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
     		
     		if ($scope.orders.ordernum == undefined || $scope.orders.ordernum == "") {
                $.jBox.tip('订单号不能为空', 'warning');
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
    	
    		   	
    }]);

entOrdersModule.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {
        	
            $(window).resize(function () {
                $("#entrygridOptionsId", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            });
            $timeout(function(){
                $("#entrygridOptionsId", element).css("height", (document.documentElement.clientHeight - 120) + "px");
            })
        }
    };
})