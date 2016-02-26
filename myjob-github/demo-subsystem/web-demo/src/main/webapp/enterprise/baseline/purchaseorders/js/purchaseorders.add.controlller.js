purchaseOrdersApp.
controller('purchaseOrdersAddController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert){
	//查询参数
	$scope.goodsList_queryData = {};                             
    $scope.goodsList_queryData.pagesize=16;
    $scope.supplier={};
    //goodsCartObject购物车状态
    $scope.goodsCartObject = {};
	$scope.goodsCartObject.countCartsPrice = 0.00;
	$scope.goodsCartObject.countCartsNumber = 0;
	//默认勾选全选购物车按钮
	$scope.goodsCartObject.sa = true;
    //购物车
    $scope.goodsCart = [];
	//供应商下拉表格start
	$scope.formData ={};
	$scope.formData.datas = [];
	$scope.getSuppliers = function(pagesize,pagenum,companyname,key){
		var params = {};
		params.pagesize = 1000;
		params.pagenum = 1;
		purchaseOrdersService.httpPost(purchaseOrdersService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
			$scope.formData.datas = resp.data.rows;
			//页面初始化的时候默认选中第一位供应商
			if(key == 1){
				$scope.supplier.companyid = $scope.formData.datas[0].companyid;
				$scope.formData.keyWord = $scope.formData.datas[0].companyname;
				$scope.searchGoodsList();
			}
		});	
	};
    $scope.query = function () {
    	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
        $scope.getSuppliers(2);
    };
	var countClickSupplierQuery = 0;
    
    $scope.$watch("supplier",function(){
    	//更改供应商时候清除采购明细数据
    	$scope.goodsCart.length = 0; 
    	countClickSupplierQuery = countClickSupplierQuery + 1;
    	if(countClickSupplierQuery == 2){
    		$alert({title: '警告：', content: '更改供应商后,商品添加记录会被清空!', placement: 'masget-top',type: 'warning', duration:2, show: true});
    	}
    });
    //在comboxtable里的文本框输入时触发的方法
    $scope.onReset = function(){
    	$scope.supplier={};
    };
    //供应商下拉表格end
    
    //页面初始化的时候默认选中第一位供应商
    $scope.getSuppliers(10,1,"",1);

    $scope.goodsList = {};
    $scope.searchGoodsList = function(){
    	if($scope.supplier.companyid == null || $scope.supplier.companyid == undefined){
    		$alert({title: '提示：', content: '请选择供应商!', placement: 'masget-top',type: 'info', duration:1, show: true});
    	    return ;
    	}
    	$scope.goodsList_queryData.companyid = $scope.supplier.companyid;
    	$scope.goodsList_queryData.goodsname = $scope.formData.goodsname;
    	purchaseOrdersService.httpPost(purchaseOrdersService.getGoodsList(),$scope.goodsList_queryData,function(resp){
    		if(resp.ret == 0){
        		$scope.goodsList = resp.data;
        		angular.forEach($scope.goodsList.rows,function(data,index){
        			data.goodsnumber = 1;
        		});    			
    		}else if(resp.ret == 18){
    			$alert({title: '提示：', content: '数据校验失败', placement: 'masget-top',type: 'info', duration:2, show: true});
    		}else{
    			$alert({title: '提示：', content: resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
    		}
    		console.info(resp);
		});	
    };
    //切换到购物车列表
    $scope.openPurchaseGoodsModal = function(){
    	$scope.goodsCartObject.countCartsPrice = 0;
    	$scope.goodsCartObject.sa = true;
    	//清空购物车记录
    	$rootScope.resetAry();
    	$rootScope.clickSelectAll();
    	angular.forEach($scope.goodsCart,function(data,index,array){
    		data.selected = true;
    	});
    	$("#viewPurchaseGoods").modal("show");	
    };
    //路由跳转到采购单管理界面
    $scope.getPurchaseorders = function(){
		$state.go("getPurchaseorders");
    };
}])
.controller('goodsListController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert){
	//验证购买数量输入是否合法
    $scope.testGoodsnumber = function(item){
    	if(!regularValidationService.testNumber(item.goodsnumber)){
    		$alert({title: '提示：', content: '购买数量必须为整数!', placement: 'masget-top',type: 'info', duration:1, show: true});
    	    return false;
    	}else if (item.goodsnumber < 0 || item.goodsnumber == 0){
    		$alert({title: '提示：', content: '购买数量必须大于0!', placement: 'masget-top',type: 'info', duration:1, show: true});
    	    return false;
    	}else{
    		return true;
    	}
    };
    //添加商品到采购单
    $scope.addCart = function(item){
    	$scope.hasFlag = false;      //商品是否存在于购物车标志，一开始设定为不存在
    	//验证购买数量输入是否合法
    	if(!$scope.testGoodsnumber(item)){
        	return ;    		
    	}
    	if($scope.goodsCart.length == 0){
    		$scope.goodsCart.push(angular.copy(item));
    	}else if($scope.goodsCart.length > 0){
        	angular.forEach($scope.goodsCart,function(data,index,array){
        		if($scope.goodsCart[index].goodsid == item.goodsid){
        			$scope.goodsCart[index].goodsnumber = $scope.goodsCart[index].goodsnumber + item.goodsnumber;
        			$scope.hasFlag = true;
        		}
        	});   
        	//没有存在于购物车的商品将被添加进购物车
    		if(!$scope.hasFlag){
    			$scope.goodsCart.push(angular.copy(item));
    		}
    	}
    	$alert({title: '提示：', content: '成功加入采购单!', placement: 'masget-top',type: 'info', duration:1, show: true});
		for(var i=0;i<$scope.goodsCart.length;i++){
		    console.log($scope.goodsCart[i].goodsnumber);	
	    }
    };	
}])
.controller('purchaseGoodsModalController',['$timeout','$state','$scope','$rootScope','$http','purchaseOrdersService','$alert',
function($timeout,$state,$scope,$rootScope,$http,purchaseOrdersService,$alert){
	
	$scope.closeModal = function(){
		$('#viewPurchaseGoods').modal('hide');
	};

	//处理勾选购物车
	var ary = new Array();
	//处理结算钱财
	//$scope.goodsCartObject.countCartsPrice = 0;
	$scope.countAmount = function(items){
		if(items.selected){
			//勾选托运单数据则push进入数组
			ary.push(items);		
		}else{
			//反勾选则从数组中删除已添加的托运单
			ary.remove(items.goodsid);	
		}
		$scope.cp();
	};
	//清空购物车记录
	$rootScope.resetAry = function(){
		ary.length = 0;
	};
	//删除goodsid值为val的数组元素
	Array.prototype.indexOfIt = function(val) {
		for (var i = 0; i < this.length; i++) {
		    if (this[i].goodsid == val) return i;
		}
		return -1;
	};
	Array.prototype.remove = function(val) {
		var index = this.indexOfIt(val);
		if (index > -1) {
		    this.splice(index, 1);
		}
	};
	$rootScope.clickSelectAll = function(){
		console.log($scope.goodsCartObject.sa);
		$scope.selectAll();
	};
    //全选购物车
    $scope.selectAll = function(){
        if($scope.goodsCartObject.sa){
            ary.length = 0;
            angular.forEach($scope.goodsCart,function(data,index,array){
                $scope.goodsCart[index].selected = true;
                ary.push(data);
            });
        }else{
            ary.length = 0;
            angular.forEach($scope.goodsCart,function(data,index,array){
                $scope.goodsCart[index].selected = false;
            });
        }
        $scope.cp();
    };
	//改变购物车商品数量
	$scope.changeGoodscart = function(items){
		if(items.goodsnumber>0){
			
		}else{
			items.goodsnumber = 1;
			$alert({title: '提示：', content: '商品数量必须大于零!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}
		$scope.cp();
	};
	//购物车数量减一
	$scope.minusGoodscart = function(items){
		if(items.goodsnumber>1){
			items.goodsnumber--;
		}
		$scope.cp();
	};
	//购物车数量加一
	$scope.plusGoodscart = function(items){
		if(items.goodsnumber>0){
			items.goodsnumber++;
		}
		$scope.cp();
	};    
	//删除购物车
	$scope.deleteGoodsCarts = function(){
		if(ary.length==0){
            $alert({title: '删除提示：', content: '请选择商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}else{
            $scope.goodsCart.goodscarts = angular.toJson(ary);
            angular.forEach(ary,function(data,index,array){
            	angular.forEach($scope.goodsCart,function(value,i){
            		if($scope.goodsCart[i].goodsid == data.goodsid){
            			$scope.goodsCart.remove($scope.goodsCart[i].goodsid);
            		}
            	});
            });
            $alert({title: '删除提示：', content: '删除成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
            $scope.cp();
		} 
	};	
    //计算结算应付钱财
    $scope.cp = function(){
		$scope.goodsCartObject.countCartsPrice = 0;
		$scope.goodsCartObject.countCartsNumber = 0;
		angular.forEach(ary,function(data,index,array){
			$scope.goodsCartObject.countCartsPrice = $scope.goodsCartObject.countCartsPrice + parseFloat(data.shopprice) * parseFloat(data.goodsnumber);
			$scope.goodsCartObject.countCartsNumber = $scope.goodsCartObject.countCartsNumber + parseFloat(data.goodsnumber);
		});
		$scope.goodsCartObject.countCartsPrice = $scope.goodsCartObject.countCartsPrice.toFixed(2);
    };	 
    $scope.billingGoodsCarts = function(){
    	if(ary.length==0){
            $alert({title: '提示：', content: '请选择商品!', placement: 'masget-top',type: 'info', duration:1, show: true});
		}else{
			$('#viewPurchaseGoods').modal('hide');
            $timeout(function(){
            	$state.go("purchaseOrdersbilling");
            },500);
            $rootScope.rootGoodscartArr = ary;
            $rootScope.rootCountCartsPrice = $scope.goodsCartObject.countCartsPrice;
            $rootScope.rootCountCartsNumber = $scope.goodsCartObject.countCartsNumber;
            $rootScope.rootSupplier = $scope.supplier;
        }
    };
}]);
