var billingModule = angular
		.module(
				'masgetWebApp.enterprise.billing',
				[ "ui.router", "ngMessages", 'infinite-scroll',
				'masgetWebApp.utils.service', "mgcrea.ngStrap" ])
		.run(['$rootScope','$state','$stateParams','$http', 'utils',
			function($rootScope, $state, $stateParams, $http, utils) {
					$rootScope.orders = {
						ordernum:"",
						totgoodsmoney : 0,
						orderlist:[],
						warehouseid:0
					};
					$rootScope.items = [];
					$rootScope.queryFormData = {
							goodsname : "",
							pageSize:20,
							pageNum:1,
							busy:false
						};

					$rootScope.addToCart = function() {
							$state.go("cart");
						}
					
					$rootScope.getordernum = function(){
						// 获取单号
						$http.get("/jsbweb/enterprise/billing/getordernum.do").success(
								function(data) {
									$rootScope.orders.ordernum = data.ordernum + "";
						});
					};
					$rootScope.getordernum();
					
					$rootScope.sumgoodsmoney = function(){
						//$scope.orders.totgoodsmoney
						$rootScope.orders.totgoodsmoney = 0;
						$rootScope.orders.totgoodsqty = 0;
						$rootScope.orders.totdiscountmoney = 0;
						for(var index=0; index < $rootScope.orders.orderlist.length; index++){
							var cart = $rootScope.orders.orderlist[index];
							$rootScope.orders.totgoodsmoney += cart.dealingprice * cart.goodsqty;
							$rootScope.orders.totgoodsqty += cart.goodsqty;
							$rootScope.orders.totdiscountmoney += (cart.goodsunitprice - cart.dealingprice)* cart.goodsqty
						}
					}
					
					$rootScope.queryForm = function(flag){
						if(flag == true)
						{
							$rootScope.queryFormData.busy = false;
							$rootScope.queryFormData.pageNum = 1;
						}
						if ($rootScope.queryFormData.busy) return;
						$rootScope.queryFormData.busy = true;
		            	$http({
		        	        method  : 'POST',
		        	        url     : 'list.do',
		        	        data    : $.param($rootScope.queryFormData),  // pass in data as strings
		        	        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
		        	    }).success(function(data) {
		        	    	$rootScope.queryFormData.busy = false;
		    	            console.log(data);
		    	            if(data.data.rows.length >= 20)
		    	            	$rootScope.queryFormData.pageNum++;
		    	            else{
		    	            	$rootScope.queryFormData.busy = true;
		    	            }
		    	            if(flag){
		    	            	$rootScope.items = data.data.rows;
		    	            }else{
			    	            var item =  data.data.rows;
			    	            for (var i = 0; i < item.length; i++) {
			    	            	 $rootScope.items.push(item[i]);
			    	            }
		    	            }
		    	        }).error(function(resp){
		    	        	$rootScope.queryFormData.busy = false;
		    	    		console.log("error.....");
		    	    	});
					}
					
			} ])
		.config(
				function($stateProvider, $urlRouterProvider) {
					$urlRouterProvider.otherwise('/cart');
					$stateProvider
							.state('cart',
									{
										url : '/cart',
										views : {
											"content" : {
												templateUrl : '/jsbweb/enterprise/billing/tpls/cart.html',
												controller : 'cartCtr'
											}
										}
									})
							.state('goodsList',
									{
										url : '/goodsList',
										views : {
											"content" : {
												templateUrl : '/jsbweb/enterprise/billing/tpls/goods_list.html',
												controller : 'goodsListCtr'
											}
										}
									})
				});
