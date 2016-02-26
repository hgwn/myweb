angular.module('masgetWebApp.commodity').
controller('commodityGoodscartController',['$scope','$rootScope','$cacheFactory','$http','$cookieStore','commodityService','$alert','$timeout','$state',
function($scope,$rootScope,$cacheFactory,$http,$cookieStore,commodityService,$alert,$timeout,$state){
    //供应商信息
	//$merchants  = $rootScope.rootCompanyid;

	commodityService.httpGet(commodityService.getGetGoodsCartUrl()+"?companyid="+$rootScope.rootCompanyid,function(resp){
        $scope.goodscartList = resp.data.rows[0];
        angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
        	$scope.goodscartList.goodslist[index].selected = false; 
        });
    });
	//默认不勾选全选购物车按钮
	$scope.sa = false;
	//处理勾选购物车
	var ary = new Array();
	$scope.countCartsPrice = 0;
	$scope.countAmount = function(items){
		if(items.selected){
			//勾选托运单数据则push进入数组
			var a = {};
			a.goodscartid = items.goodscartid;
			a.dealprice = items.dealprice;
			a.numbers = items.numbers;
			ary.push(items);		
		}else{
			//反勾选则从数组中删除已添加的托运单
			ary.remove(items.goodscartid);	
		}
		$scope.cp();
	};
	//改变购物车商品数量
	$scope.changeGoodscart = function(items){
		if(items.numbers>0){
			
		}else{
			items.numbers = 1;
			$alert({title: '提示：', content: '商品数量必须大于零!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}
		$scope.modifyGoodscart(items);
	};
	//购物车数量减一
	$scope.minusGoodscart = function(items){
		if(items.numbers>1){
			items.numbers--;
		}
		$scope.modifyGoodscart(items);
	};
	//购物车数量加一
	$scope.plusGoodscart = function(items){
		if(items.numbers>0){
			items.numbers++;
		}		
		$scope.modifyGoodscart(items);
	};
	$scope.modifyGoodscart = function(items){
		$scope.modifyGoodscartsParams = {};
		$scope.modifyGoodscartsParams.goodscartid = items.goodscartid;
		$scope.modifyGoodscartsParams.numbers = items.numbers;
		$scope.modifyGoodscartsParams.skuid = items.skuid;
        $http({
            method : 'POST',
            url : commodityService.getModifyGoodscartsUrl(),
            data : $.param($scope.modifyGoodscartsParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	$scope.cp();
        });
	};
    //全选购物车
    $scope.selectAll = function(){
        if($scope.sa){
            ary.length = 0;
            angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
                $scope.goodscartList.goodslist[index].selected = true;
                ary.push(data);
            });
        }else{
            ary.length = 0;
            angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
                $scope.goodscartList.goodslist[index].selected = false;
            });
        }
        $scope.cp();
    };
    //计算结算时应付钱财
    $scope.cp = function(){
		$scope.countCartsPrice = 0;
		angular.forEach(ary,function(data,index,array){
			$scope.countCartsPrice = $scope.countCartsPrice + parseFloat(data.dealprice) * parseFloat(data.numbers)
	    
		});
		$scope.countCartsPrice = $scope.countCartsPrice.toFixed(2);
    };
	//删除goodscartid值为val的数组元素
	Array.prototype.indexOfIt = function(val) {
		for (var i = 0; i < this.length; i++) {
		    if (this[i].goodscartid == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOfIt(val);
		if (index > -1) {
		    this.splice(index, 1);
		}
	};
	//删除购物车
	$scope.deleteGoodsCarts = function(){
		if(ary.length==0){
            $alert({title: '删除提示：', content: '请选择商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}else{
            $scope.goodsCart={goodscarts:{}};
            $scope.goodsCart.goodscarts = angular.toJson(ary);
            $http({
                method : 'POST',
                url : commodityService.getDeleteGoodscartUrl(),
                data : $.param($scope.goodsCart),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data) {
                $alert({title: '提示：', content: '删除购物车成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
                commodityService.httpGet(commodityService.getGetGoodsCartUrl()+"?companyid="+$rootScope.rootCompanyid,function(resp){
                    $scope.goodscartList = resp.data.rows[0];
                    if(typeof($scope.goodscartList)!='undefined'){
                        angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
                            $scope.goodscartList.goodslist[index].selected = false;
                        });
                    }
                });
                //删除后把金额置零
                $scope.countCartsPrice = 0;
            });
        }
	};

	//跳转到开单页面
	$scope.billingGoodsCarts = function(){
        if(ary.length==0){
            $alert({title: '结算提示：', content: '请选择商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
        }else{
            $state.go("billing");
            $rootScope.rootGoodscartArr = ary;
            $rootScope.rootCountCartsPrice = $scope.countCartsPrice;
            //$rootScope.rootCompanyid = $rootScope.rootCompanyid;
        }
	};
}]);