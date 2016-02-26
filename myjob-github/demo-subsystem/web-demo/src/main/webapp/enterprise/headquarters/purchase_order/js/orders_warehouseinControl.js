/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersWarehouseinController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.ordersWarehousein = {};
    	$scope.ordersWarehousein.orderlist = [];
    	
    	//出库的查询
	 	$http({
            method : 'POST',
            url : "/jsbweb/enterprise/baseline/warehousein/getWarehouseinOrders.do",
            data : $.param({data : angular.toJson($stateParams)}),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
            	$scope.ordersWarehousein = data.data;
            	console.info($scope.ordersWarehousein);
            	angular.forEach($scope.ordersWarehousein.orderlist,function(data,index){
            		data.goodsqtyCopy = data.goodsqty;
            	});
            }else if(data.ret==10){
                $.jBox.tip("请先登录", 'warning');
            }else{ 
                $.jBox.tip("获取数据失败", 'warning');
            }
        }).error(function(rep){
            $.jBox.tip("获取数据失败", 'warning');
        });
	 	
	 	
	 	//修改界面跳转
    	$scope.goback = function(orders){
    		window.history.go(-1);
    	}; 
    	
    	//检测出库数不能大于订购数
    	/*angular.forEach($scope.ordersWarehousein.orderlist,function(data,index){
    		$scope.$watch(function() {
                return $scope.ordersWarehousein.orderlist[0].warehouseoutqty;
            }, function(newVal, oldVal) {
            	if(newVal>10){
            		
            		$.jBox.tip("获取数据失败", 'warning');
            	}
            });
    	});*/
    	$scope.changeGoodsqtyCopy = function(goodqty){
    		console.log(goodqty);
    		if(goodqty < 0 || goodqty == undefined || goodqty == null){
    			$.jBox.tip('入库数量不能少于0', 'success');
    		}
    	};
    	//采购入库
    	$scope.warehousein = function(){
    		$scope.flag = true;
    		var params = {};
    		params.ordernum = $scope.ordersWarehousein.ordernum;
    		params.warehouseinlist = angular.copy($scope.ordersWarehousein.orderlist);
    		angular.forEach(params.warehouseinlist,function(data,index){
    			//计划入库数量
        		data.goodsqty = data.goodsqtyCopy;
        		//进货价
        		data.purchaseprice = data.dealingprice;
        		//商品库存配置
        		data.goodsstockconfig = data.goodsstock;
        		if(data.goodsstockconfig.isbatchcode == 2 && (data.batchcode == null||data.batchcode == "")){
        			
        			$scope.flag = false;
        		}
        	});
    		if(!$scope.flag){
    			$.jBox.tip('使用批次号的商品必须要填写批次号', 'success');
    			return ;
    		}
            $http({
                method : 'POST',
                url : '/jsbweb/enterprise/baseline/warehousein/auditWarehouseinOrders.do',
                data : $.param({data : angular.toJson(params)}),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                
                if(data.ret == 0) {
                    $.jBox.tip('本次采购入库成功', 'success');
                    window.history.go(-1);
                } 
                else {
                    $.jBox.tip('本次采购入库失败' , 'warning');
                }
            }).error(function(rep){
                $.jBox.tip('本次采购入库失败', 'warning');
            });
    	}
}]);

