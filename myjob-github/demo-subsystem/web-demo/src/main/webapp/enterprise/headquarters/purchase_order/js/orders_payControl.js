/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersPayController",
    ['$scope','$rootScope','$http',"$stateParams","$state","ordersService","$timeout",
        function($scope, $rootScope, $http,$stateParams,$state,ordersService,$timeout) {
    	$scope.payData = {};
    	$scope.installment = {};
    	$scope.orders = $rootScope.threePayDate;
    	
    	//加载分期配置
    	var data = {data: angular.toJson($scope.installment)};
        $http({
            method: 'POST',
            url: "/jsbweb/enterprise/installmentsconfig/getInstallmentsconfig.do",
            data : $.param(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (data) {
            if (data.ret == 0) {
                $scope.installmentData = data.data.rows;
                
                console.info($scope.installmentData);
            }
            if (data.ret == 10) {
                $.jBox.tip("请先登录", 'warning');
            }
        });
        
    	
    	$scope.goback = function(){
    		history.go(-1);
    	};
    	
    	$scope.pay = function(){
    		
    		console.info($scope.selectValue);
    		if($scope.selectValue == undefined){
    			$.jBox.tip('请选择支付方式', 'warning');
    			return;
    		}
    		if($scope.selectValue == 1){
    			$.jBox.tip('pos刷卡支付方式', 'warning');
    		}
    		if($scope.selectValue == 3){
    			$state.go("instalment");
    		}
    		
    		if($scope.selectValue == 2 ){
    			$scope.payData.amount = $scope.orders.totgoodsmoney;
    			$scope.payData.ordernum = $scope.orders.ordernum;
    			$scope.payData.orderid = $scope.orders.orderid;
    			
    			var data = { data: angular.toJson($scope.payData)};
    			$http({
	                method: 'POST',
	                url: "/jsbweb/enterprise/baseline/orders/cash.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('现金支付成功', 'success');  
	                }else{
	                	$.jBox.tip('现金支付添加失败', 'warning');
	                }
	
	                if (data.ret == 10) {
	                    $.jBox.tip("请先登录", 'warning');
	                }
	            }).error(function(data){
	                $.jBox.tip("连接服务器失败", "warning");
	            });
    		}
    	}
    	
}])

