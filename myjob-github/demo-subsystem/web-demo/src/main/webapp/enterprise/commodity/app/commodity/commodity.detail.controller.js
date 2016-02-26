angular.module('masgetWebApp.commodity')
.controller('commodityDetailController',['$scope','$cookieStore','$rootScope','$http','commodityService','$state','$alert',
    function($scope,$cookieStore,$rootScope,$http,commodityService,$state,$alert){
	    //判断是否刚从访问商品详细页面回来,如果是防重复添加数据
	    $rootScope.commoditiesInDetailFlag = true;
	    $scope.commodity = $rootScope.rootC;
	    $scope.merchant = $rootScope.rootM;
	    $scope.toList = function(){
	    	$rootScope.commoditiesInDetailFlag = false;
	    	$state.go("list",{path:'companyid='+$rootScope.rootCompanyid});
	    };
	    
	    
	    var arr ;
	    //添加购物车、立即购买按钮触发的方法
	    $scope.addCart = function(item){
	        //每次打开购物车都清空属性选择样式，恢复出厂设置
	        angular.forEach(item.goodsskuattrib,function(data,index,array){
	            data.selectedFlag = false;
	            angular.forEach(data.properties,function(data,index,array){
	                data.cssFlag = false;
	            });
	        });
	        //某商品
	        $scope.merchant  = item;
	        arr = new Array();
	        
	        $scope.merchantPriceDetail = {};
	        $scope.merchantPriceDetail.price = $scope.merchant.shopprice;
	        //$scope.merchantPriceDetail.quantity = 0;
	        $scope.merchantPriceDetail.num = 1;
	        $scope.merchantPriceDetail.flag = 2;
	        $scope.merchantPriceDetail.totalPrice = function(){
	            var p = $scope.merchantPriceDetail;
	            var sum = parseFloat(p.num) * parseFloat(p.price);
	            return sum.toFixed(2);
	        };
	    };
	    //删除attribproperties值为val的数组元素start
	    Array.prototype.indexOfIt = function(val) {
	        for (var i = 0; i < this.length; i++) {
	            if (this[i].attribproperties == val) return i;
	        }
	        return -1;
	    };
	    Array.prototype.remove = function(val) {
	        var index = this.indexOfIt(val);
	        if (index > -1) {
	            this.splice(index, 1);
	        }
	    };
	    //删除attribproperties值为val的数组元素end

	    //用户选择某一属性触发的一系列操作.item为具体某一属性,items则为某一类属性的集合
	    $scope.selectedClick = function(item,items,merchant){
	        //如果某大类属性未被选择则选择
	        if(!items.selectedFlag){
	            var a = {};
	            a.attribid = items.attribid;
	            a.attribtype = items.attribtype;
	            a.attribproperties = item.attribproperties;
	            arr.push(a);
	        }else{
	            for(var i=0;i<items.properties.length;i++){
	                arr.remove(items.properties[i].attribproperties);
	            }
	            if(!item.cssFlag){
	                var a = {};
	                a.attribid = items.attribid;
	                a.attribtype = items.attribtype;
	                a.attribproperties = item.attribproperties;
	                arr.push(a);
	            }
	        }
	        $scope.selectedAttributeList={reconciliationOrder:{}};
	        $scope.selectedAttributeList.reconciliationOrder.companyid = merchant.companyid;
	        $scope.selectedAttributeList.reconciliationOrder.goodsid = merchant.goodsid;
	        $scope.selectedAttributeList.reconciliationOrder.goodsattrib = angular.toJson(arr);

	        $http({
	            method : 'POST',
	            url : commodityService.getCommodityGoodsSkuUrl(),
	            data : $.param($scope.selectedAttributeList.reconciliationOrder),
	            headers : {
	                'Content-Type' : 'application/x-www-form-urlencoded'
	            }
	        }).success(function(data){
	            //将现有的商品属性跟返回的商品属性进行比较，若有返回则替换现有的商品属性
	            angular.forEach($scope.merchant.goodsskuattrib,function(da,ind,array){
	                angular.forEach(data.goodsskuattrib,function(data,index,array){
	                    if(da.attribid==data.attribid){
	                        $scope.merchant.goodsskuattrib[ind] = data;
	                    }
	                });
	            });
	            //选择完商品属性之后,查询出来价格跟数量
	            if(data.endedflag == 2){
	                $scope.merchantPriceDetail = data;
	                $scope.merchantPriceDetail.num = 1;
	                $scope.merchantPriceDetail.flag = data.endedflag;
	                $scope.merchantPriceDetail.totalPrice = function(){
	                    var p = $scope.merchantPriceDetail;
	                    var sum = parseFloat(p.num) * parseFloat(p.price);
	                    return sum.toFixed(2);
	                };
	            }else{
	            }
	        }).error(function(){

	        });
	        //被顾客选中某一属性则更换特殊样式,则同类的其它属性样式恢复原貌
	        commodityService.selectedClick(item,items);
	    };
	    
	    
	    //计算顾客购买了几件商品
		$scope.countCommodity = 0;
		var arrCart = new Array();
	    angular.forEach($cookieStore.get("myCarts_rb"),function(data,index,array){
	        $scope.countCommodity = $scope.countCommodity + parseInt(data.numbers);
	        arrCart.push(data);
	    });   
	    commodityService.httpGet(commodityService.getGetSessionUrl(),function(resp){
	        //判断是否登录，如果登录成功则把数据库保存的购物数量查询出来
	    	if(resp.ret == 0){
	        	$scope.hasLogin = resp;
	            commodityService.httpGet(commodityService.getGetGoodsCartUrl()+"?companyid="+$rootScope.rootCompanyid,function(resp){
	                $scope.goodscartList = resp.data.rows[0];
	                if(typeof($scope.goodscartList)!='undefined'){
	                    angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
	                    	$scope.countCommodity = $scope.countCommodity + parseInt(data.numbers);
	                    });                	
	                }
	            });
	        }else{
	        	$scope.hasLogin = "";
	        	$alert({title: '提示：', content: '您已下线，请重新登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
	        }
	    });
	        
	    $scope.submitAddCart = function(){
	    	//判断是否重复添加商品
	    	var repeatedFlag = false;

	        if($scope.merchantPriceDetail.flag == 2){
	            var cart = {};
	            cart.companyid = $scope.merchant.companyid;
	            cart.brandid = $scope.merchant.brandid;
	            cart.companygoodsclassifyid = $scope.merchant.companygoodsclassifyid;
	            cart.goodsid = $scope.merchant.goodsid;
	            cart.marketprice = $scope.merchant.marketprice;
	            cart.virtualflag = $scope.merchant.virtualflag;
	            
	            cart.barcode = $scope.merchantPriceDetail.barcode;
	            cart.shopprice = $scope.merchantPriceDetail.price;
	            cart.dealprice = $scope.merchantPriceDetail.price;
	            if(typeof($scope.merchantPriceDetail.skuid)=='undefined'){
	            	cart.skuid = 0;
	            }else{
	            	cart.skuid = $scope.merchantPriceDetail.skuid;
	            }
	            cart.numbers = $scope.merchantPriceDetail.num;
	            if($scope.hasLogin.ret == 0){
	            	cart.currentcompanyid = $scope.hasLogin.companyid;
	            }
	            //额外显示的属性值
	            cart.goodsname = $scope.merchant.goodsname;
	            arrCart.push(cart);	

	            $cookieStore.put('myCarts_rb',arrCart);
	            
	            $scope.goodsCart={goodscart:{}};
	            $scope.goodsCart.goodscart = angular.toJson($cookieStore.get('myCarts_rb'));
	            $http({
					method : 'POST',
					url : commodityService.getAddGoodscartUrl(),
					data : $.param($scope.goodsCart),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(data) {
		            //计算顾客购买了几件商品
		            $scope.countCommodity = 0;
		            commodityService.httpGet(commodityService.getGetGoodsCartUrl()+"?companyid="+$rootScope.rootCompanyid,function(resp){
		                $scope.goodscartList = resp.data.rows[0];
		                angular.forEach($scope.goodscartList.goodslist,function(data,index,array){
		                	$scope.countCommodity = $scope.countCommodity + parseInt(data.numbers);
		                });
		            });
					$alert({title: '提示：', content: '成功加入购物车!', placement: 'masget-top',type: 'info', duration:1, show: true});
				});
				$cookieStore.remove('myCarts_rb');
				//清空购物车
				arrCart.length=0;
	        }else{
	        	$alert({title: '提示：', content: '亲,请选择商品型号!', placement: 'masget-top',type: 'info', duration:1, show: true});
	        }
	    };
	    $scope.submitOrder = function(){
	    	$alert({title: '提示:', content: '此功能尚待完善!', placement: 'masget-top',type: 'warning', duration:2, show: true});
	    };
	    //跳转到购物车
	    $scope.balanceAccount = function(){
	        commodityService.httpGet(commodityService.getGetSessionUrl(),function(resp){
	            $scope.hasLogin = resp;
	            if($scope.hasLogin.ret == 10){
	            	$alert({title: '您好，', content: '请先登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
	            }else if($scope.hasLogin.ret == 0){
	            	$state.go("goodscart");
	            	//$rootScope.rootCompanyid = $rootScope.rootCompanyid;
	            }
	        });
	    };
    }]);