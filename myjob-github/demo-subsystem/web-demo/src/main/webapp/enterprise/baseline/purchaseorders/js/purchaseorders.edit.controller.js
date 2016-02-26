purchaseOrdersApp.
controller('purchaseOrdersEditController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','commodityService','$timeout',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,commodityService,$timeout){
	$scope.edit_datas = $rootScope.editDatas;
	$scope.provinceList = [];
	$scope.areaList = [];
	$scope.districtList = [];
	//获取省份信息
	commodityService.httpGet(commodityService.getDistrictUrl(),function(resp){
        $scope.provinceList = resp.data.rows;
    });

	//获取城市信息
	$scope.getArea = function(){
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.edit_datas.provinceid,function(resp){
	        $scope.areaList = resp.data.rows;
	        var newObject = {
        		cityid:0,
        		cityname:'--请选择城市--'
			};
	        $scope.areaList.push(newObject);
	        $scope.edit_datas.cityid = 0;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.edit_datas.provinceid+
		          "&cityid="+$scope.edit_datas.cityid;
		commodityService.httpGet(url,function(resp){
	        $scope.districtList = resp.data.rows;
	        var newObject = {
        		areaid:0,
        		areaname:'--请选择县/区--'
			};
	        $scope.districtList.push(newObject);
	        $scope.edit_datas.areaid = 0;
	    });
	};
	$scope.recoverAddress = function(){
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.edit_datas.provinceid,function(resp){
	        $scope.areaList = resp.data.rows;
	    });
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.edit_datas.provinceid+
                  "&cityid="+$scope.edit_datas.cityid;
		commodityService.httpGet(url,function(resp){
		    $scope.districtList = resp.data.rows;
		});
		$scope.cp();
	};
	
	//更改商品购买数量触发方法
	$scope.changeGoodsqty = function(items){
		if(items.goodsqty>0){
			
		}else{
			items.goodsqty = 1;
			$alert({title: '提示：', content: '商品数量必须大于零!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}
		$scope.cp();
	};
    //计算结算应付钱财
	$scope.countPrice = 0;
    $scope.cp = function(){
		$scope.countPrice = 0;
		angular.forEach($scope.edit_datas.purchaseorderlist,function(data,index,array){
			$scope.countPrice = $scope.countPrice + parseFloat(data.dealingprice) * parseFloat(data.goodsqty);
		});
		$scope.countPrice = $scope.countPrice.toFixed(2);
    };
	//验证收货人信息输入是否合法
    $scope.testPurchaseOrders = function(){
    	if(!regularValidationService.testPhoneNum($scope.edit_datas.mobile)){
    		$alert({title: '提示：', content: '手机号码输入不合法!', placement: 'masget-top',type: 'info', duration:2, show: true});
    	    return false;
    	}else if ($scope.edit_datas.contactname == "" || $scope.edit_datas.contactname == null){
    		$alert({title: '提示：', content: '收货人不能为空!', placement: 'masget-top',type: 'info', duration:2, show: true});
    	    return false;
    	}else if($scope.edit_datas.provinceid == undefined || $scope.edit_datas.provinceid == 0){
    		$alert({title: '提示：', content: '请选择省份!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else if($scope.edit_datas.cityid == undefined || $scope.edit_datas.cityid == 0){
    		$alert({title: '提示：', content: '请选择城市!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else if($scope.edit_datas.areaid == undefined || $scope.edit_datas.areaid == 0){
    		$alert({title: '提示：', content: '请选择区县!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else{
    		return true;
    	}
    };
    //提交
    $scope.submit = function(){
		if(!$scope.testPurchaseOrders()){
			return ;
		};
		/*$scope.edit_datas.purchaseorderlist = angular.toJson($scope.edit_datas.purchaseorderlist);*/
		$scope.params = {};
		$scope.params.data = angular.toJson($scope.edit_datas);
		purchaseOrdersService.httpPost(purchaseOrdersService.getModifyPurchaseOrders(),$scope.params,function(resp){
			console.info(resp);
			if(resp.ret == 0){
				$alert({title: '提示：', content: '修改成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
				$timeout(function(){
					$state.go("getPurchaseorders");
				},1000);
			}else if(resp.ret == 10){
				$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
			}else{
				$alert({title: '提示：', content: '修改采购单异常,'+resp.message, placement: 'masget-top',type: 'warning', duration:2, show: true});
			}
		});
    };
    //返回采购单查询
    $scope.getPurchaseorders = function(){
    	$state.go("getPurchaseorders");
    };
    $scope.recoverAddress();
}]);