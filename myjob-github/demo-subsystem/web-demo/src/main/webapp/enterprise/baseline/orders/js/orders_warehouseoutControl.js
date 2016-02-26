/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersWarehouseoutController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.ordersWarehouseout = {};
    	$scope.ordersWarehouseout.orderlist = [];
    	$scope.ordersWarehouseout.warehouseoutlist = [];
    	
    	$rootScope.rootItem = {};
    	
    	//出库的查询
	 	$http({
            method : 'POST',
            url : "/jsbweb/baseline/orders/getWarehouseout.do",
            data : $.param($stateParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
            	
            	$scope.ordersWarehouseout = data.data;
            	console.info($scope.ordersWarehouseout);
            	console.info($scope.ordersWarehouseout.orderlist[0].goodsstock.warehouseid);
            	
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
    	
    	//出库
    	$scope.submit = function(){
    		
    		
    		$scope.ordersWarehouseout.warehouseoutlist = $scope.ordersWarehouseout.orderlist;
    		
    		
    		angular.forEach($scope.ordersWarehouseout.warehouseoutlist,function(value,index){
    			
        		if(value.batchcode == undefined){
        			
        			$scope.ordersWarehouseout.warehouseoutlist[index].goodsstockid = $scope.ordersWarehouseout.orderlist[index].goodsstock.goodsstockid;
        			
        		}else{
        			
        			$scope.ordersWarehouseout.warehouseoutlist[index].goodsstockid = $scope.ordersWarehouseout.orderlist[index].goodsstockid;
        			$scope.ordersWarehouseout.warehouseoutlist[index].goodsstocklistid = $scope.ordersWarehouseout.orderlist[index].goodsstocklistid;
        			$scope.ordersWarehouseout.warehouseoutlist[index].orderlistid = $scope.ordersWarehouseout.orderlist[index].orderlistid;
        			$scope.ordersWarehouseout.warehouseoutlist[index].orderid = $scope.ordersWarehouseout.orderid;
        		}
        	});
    		
    		$scope.ordersWarehouseout.warehouseid = $scope.ordersWarehouseout.supplierstationid;
    		
    		angular.forEach($scope.ordersWarehouseout.warehouseoutlist,function(value,index){
        		
        		if(value.warehouseoutqty > value.goodsqty - value.deliverygoodsqty){
        			
        			 $.jBox.confirm("第"+ (index+1) +"行，累计出库数量不能大于销售数量" + "！", "温馨提示", function(v, h, f){
        			 
        			 });
        		}
        	});
    		
    		var data = {data: angular.toJson($scope.ordersWarehouseout)};
            $http({
                method : 'POST',
                url : '/jsbweb/baseline/orders/audit_warehouseout.do',
                data : $.param(data),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                
                if(data.ret == 0) {
                    $.jBox.tip('本次销售单出库成功', 'success');
                    window.history.go(-1);
                }else if(data.ret == 18){
                	$.jBox.tip('本次出库数不能为空或者商品还未入库' , 'warning');
                } 
                else {
                    $.jBox.tip('本次销售单出库失败' , 'warning');
                }

            }).error(function(rep){
                $.jBox.tip('本次销售单出库失败', 'warning');
            });
    	}
    	
    	//弹出选择批次号model框
    	$scope.selectIsbatchcode = function(index,item){
    		
    		
    		if(item.goodsstock.isbatchcode == 2){
    			
    			var issernum=item.goodsstock.issernum;
    			var isbatchcode=item.goodsstock.isbatchcode;
    			
    			$('#select_batchcode').modal("show");
    			$scope.rowindex=item;
    			$scope.index = index;
    			
    			$rootScope.rootItem.goodssn = item.goodssn;
    			/*$rootScope.rootItem.companyid = item.goodsstock.companyid
    			$rootScope.rootItem.warehouseid = item.goodsstock.warehouseid*/
    			
    			console.warn($scope.rowindex.goodsname);
    		}
    	};
    	
    	//选择批次号确认后返回的方法
		$scope.getSelectedBatchcodeData = function(data){
			
			console.info(data);
			angular.forEach(data,function(value,index){
				var row = {};
				
                row.batchcode = value.batchcode;
                row.supplierid = value.supplierid;
                row.barcode = value.barcode;
                row.categoryid = value.categoryid;
                row.categoryname = value.categoryname;
                row.goodqty = value.goodqty;
                row.goodsid = value.goodsid;
                row.goodsname = value.goodsname;
                row.goodssn = value.goodssn;
                row.goodsstockid = value.goodsstockid;
                row.goodsstocklistid = value.goodsstocklistid;
                row.leftgoodqty = value.leftgoodqty;
                row.orderid = $scope.rowindex.orderid;
                row.orderlistid = $scope.rowindex.orderlistid;
                
                row.goodsqty = $scope.rowindex.goodsqty;
                row.deliverygoodsqty = $scope.rowindex.deliverygoodsqty;
                
                row.isbatchcode == 2;
                
                $scope.ordersWarehouseout.orderlist.push(row);
			});
			
			$scope.ordersWarehouseout.orderlist.splice($scope.index,1);
			
		};
            
}])

