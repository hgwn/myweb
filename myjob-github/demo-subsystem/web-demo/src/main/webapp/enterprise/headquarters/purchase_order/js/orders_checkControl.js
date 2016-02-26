/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersCheckController",
    ['OrdersBaseService','$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout",
        function(OrdersBaseService,$scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.orders = {};
    	$scope.orders.orderlist = [];
    	$scope.temp_orderlist=[];
    	$scope.selectedAcontact= {};
    	$scope.warehouse = {};
    	
    	$scope.orderpaymentflow= {};
    	$stateParams.pagenum = 1;
    	$stateParams.pagesize = 1;
    	//订单详解的查询
	 	$http({
            method : 'POST',
            //url : "/jsbweb/baseline/orders/getRefinedOrders.do",
            url : "/jsbweb/enterprise/headquartersorders/getExternalHeadQuartersOrders.do",
            
            data : $.param({data:angular.toJson($stateParams)}),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
            	console.log(data);
            	$scope.orders = data.data.rows[0];
       		 	switch($scope.orders.orderstate)
	       	        {
	      	              case 2:
	      	            	$scope.orders.orderstatename = "待审核";
	      	            	break;
	      	              case 3:
	      	            	$scope.orders.orderstatename = "待财务审核";
	      	            	break;
	      	              case 12:
	      	            	$scope.orders.orderstatename = "待出库审核"; 
	      	            	break;
	      	              case 9:
	      	            	$scope.orders.orderstatename = "待发货";
	      	            	break;
	      	              case 5:
	      	            	$scope.orders.orderstatename = "已发货";
	      	            	break;
	      	              case 8:
	      	            	$scope.orders.orderstatename = "订单取消";
	      	            	break;
	       	        }
            	
            	console.info($scope.orders);
            	
            	var i = 1;
            	angular.forEach($scope.orders.orderlist,function(value,index){
            		var a = parseFloat(value.totalmoney);
            		value.totalmoney = a.toFixed(2);
            		
            		value.seqid = i;
            		i++;
            	});
            	
            	var b = parseFloat($scope.orders.totgoodsmoney);
            	//总金额
            	$scope.orders.totgoodsmoney = b.toFixed(2);
            	//待付金额
            	var paymoney = ($scope.orders.totgoodsmoney*100  - $scope.orders.paidmoney*100)/100;
            	$scope.orders.paymoney = paymoney.toFixed(2);
            }else if(data.ret==10){
                $.jBox.tip("请先登录", 'warning');
            }else{ 
                $.jBox.tip("获取数据失败", 'warning');
            }
        }).error(function(rep){
            $.jBox.tip("获取数据失败", 'warning');
        });
	 	
	 	//订单支付流水
	 	$scope.getPaymentflow = function(orders){
	 		$http({
	            method : 'POST',
	            url : "/jsbweb/baseline/orders/get_paymentflow.do?orderid=" + $scope.orders.orderid,
	            headers : {
	                'Content-Type' : 'application/x-www-form-urlencoded'
	            }
	        }).success(function(data) {
	        	console.warn(data);
	            if(data.ret==0){
	            	
	            	$scope.orderpaymentflow = data.data.rows;
	            	console.log($scope.orderpaymentflow.orderpaymentflownum);
	            	angular.forEach($scope.orderpaymentflow,function(value,index){
    					if(value.state == 1){
    						value.statename = "已作废"
    					}else{
    						value.statename = "已收款 "
    					}
    				});
	            }else if(data.ret==10){
	                $.jBox.tip("请先登录", 'warning');
	            }else{ 
	                $.jBox.tip("获取数据失败", 'warning');
	            }
	        }).error(function(rep){
	            $.jBox.tip("获取数据失败", 'warning');
	        });
	 	};
        //采购方支付
        $scope.payPuchaseOrders = function(entity){
        	OrdersBaseService.setPayData(entity);
    		$timeout(function(){
    	    	$state.go("ordersPayment");
    	    },1000);
        };
	 	//打印预览-pdf
     	$scope.privewToPdf=function(){
     		console.log($scope.orders);
     		var params="data="+encodeURIComponent(encodeURIComponent(checkNull(angular.toJson($scope.orders))));
     		window.open("/jsbweb/enterprise/headquartersorders/reportOrders.do?" +params);
     	};
     	
     	var checkNull = function(v){
    		if(angular.isUndefined(v)||v == null){
    			v = "";
    		}
    		return v;
    	};
    	
    	//导出
        $scope.onBtnClickexportGoods = function(){
        	
        	var params= "ordernum=" + $scope.orders.ordernum;
        	window.location.href="/jsbweb/baseline/orders/export.do?" +params;
        };
}]);

