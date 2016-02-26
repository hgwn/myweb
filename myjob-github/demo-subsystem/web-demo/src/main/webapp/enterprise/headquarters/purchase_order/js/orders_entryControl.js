/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersEntryController",
    ['$timeout','$scope','$rootScope','$http',"$stateParams","$state","i18nService",'ordersService','OrdersBaseService',
        function($timeout,$scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,OrdersBaseService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.formData={pagesize:20,pagenum:1};
    	
    	$scope.contacts = [];
      //供应商下拉表格start
     	$scope.formData.datas = [];
     	$scope.getSuppliers = function(key){
     		var params = {};
     		params.pagesize = 1000;
     		params.pagenum = 1;
     		OrdersBaseService.httpPost(OrdersBaseService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
     			$scope.contacts = resp.data.rows;
     			//页面初始化的时候默认选中第一位供应商
     			if(key == 1){
     				$scope.formData.selectedAcontact = $scope.contacts[0];
     				$scope.formData.contactkeyword = $scope.contacts[0].companyname;
     			}
     		});	
     	};
         $scope.query = function () {
         	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
             $scope.getSuppliers(2);
         };
         
         $scope.$watch("supplier",function(){
         	
         });
         //在comboxtable里的文本框输入时触发的方法
         $scope.onReset = function(){
         	$scope.supplier={};
         };
         //供应商下拉表格end
         //页面初始化的时候默认选中第一位供应商
         $scope.getSuppliers(1);       
    	
        //查询
        $scope.onClickToQuery = function(){
        	
        	if($scope.formData.selectedAcontact != undefined && $scope.formData.selectedAcontact != ""){
        		$scope.formData.supplierid = $scope.formData.selectedAcontact.companyid;
        		$scope.formData.supplierstationid = $scope.formData.selectedAcontact.stationid;
        	}
        	$scope.formData.orders = ['createdtime'];
            $scope.formData.orderkey = 'desc';
        	 
            $http({
                 method : 'POST',
                 url : "/jsbweb/enterprise/headquartersorders/getExternalHeadQuartersOrders.do",
                 data : $.param({data : angular.toJson($scope.formData)}),
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
               	            	  data.orderstatename = "已发货";
               	            	break;
               	              case 8:
               	            	  data.orderstatename = "订单取消";
               	            	break;
               	        }
                		//可进行采购方支付 支付状态为1-待支付
             			if(data.paystate == 1){
             				data.isPay = true;
             				data.paystateName = "待支付";
             			}else if(data.paystate == 2){
             				data.isPay = true;
             				data.paystateName = "部分支付";
             			}else{
             				data.isPay = false;
             				data.paystateName = "已支付";
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
        };
    	
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
       		               	{ name: '序号', enableHiding: false, field:'id',type:'text',enableHiding: false,enableCellEdit: false , enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
       		               	{ name:'操作',field:'action',
       		                  cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">' +
       		                  '<a style="cursor:pointer; margin-left: 12px;" ui-sref="check({ordernum:row.entity.ordernum})" title="查看" ><span class="glyphicon glyphicon-eye-open blue">查看</span></a>' +      
       		                  /*'<a style="cursor:pointer; margin-left: 12px;" ng-click="grid.appScope.cancelOrders(row.entity)" title="删除" ng-if="row.entity.orderstate == 2" ><span class="glyphicon glyphicon-trash red">删除</span></a>' +
       		                  '&nbsp;&nbsp;<a href="#" ng-show="row.entity.isPay" ng-click="grid.appScope.payPuchaseOrders(row.entity)" title="付款" ><span class="glyphicon glyphicon glyphicon-yen"></span></a>'+*/
       		                  '</div>',width:"75",enableCellEdit: false },
       		                { name: '采购单号',field:'ordernum',width:'160',enableCellEdit: false},
       		                { name: '开单日期',field:'createdtime',width:'150',enableCellEdit: false},
       		                { name: '订单状态',field:'orderstatename',enableCellEdit: false},
    		                { name: '支付状态',field:'paystateName',enableCellEdit: false},
       		                { name: '总部',field:'suppliername',enableCellEdit: false},
       		                { name: '已付金额',field:'paidmoney',enableCellEdit: false},
    		                { name: '总数量',field:'totgoodsqty',enableCellEdit: false},
       		                { name: '总金额',field:'totgoodsmoney',enableCellEdit: false},
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
        $timeout(function(){
        	$scope.getPage(1,$scope.entrygridOptions.paginationPageSize);
        },400);
        //跳转到新增开单界面
        $scope.add = function(){
        	$state.go("add");
        	
        	/*if($state.orders.orderid != undefined){*/
    			//location.reload();
    		/*}*/
        };
        //采购方支付
        $scope.payPuchaseOrders = function(entity){
        	OrdersBaseService.setPayData(entity);
    		$timeout(function(){
    	    	$state.go("ordersPayment");
    	    },1000);
        };
    	
    	//查看详情界面跳转
    	$scope.printOrders = function(myRow){
    		
    		console.info(myRow);
    		
    		//$state.go('check',{'ordernum':myRow.ordernum});
    		$state.go('check');
    		$state.orders = angular.copy(myRow);
    	};
    	
        
        //修改界面跳转
    	$scope.modifyOrders = function(grid,myRow){
    		$state.go("add");
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