//购物车控制器
billingModule.controller("cartCtr", [
		'$scope',
		'$http',
		"$stateParams",
		"$state",
		"$timeout",
		'utils',
		'$alert',
		function($scope, $http, $stateParams, $state, $timeout, utils,$alert) {
			$scope.settlementtype = [ {
				id : 1,
				name : "现付",
				
			} ];
			
			$scope.paymenttype = [ {
				id : 1,
				name : "现金"
					
			}, {
				id : 2,
				name : "刷卡"
			}, {
				id : 11,
				name : "二维码"
			} ];
			$scope.deliverytype = [ {
				id : 1,
				name : "送货上门"
			}, {
				id : 2,
				name : "仓库自提"
			}, {
				id : 3,
				name : "现场交货"
			} ];
			$scope.buyname = [ {
				scenetypeid : 3,
				scenetypename : "客户"
			}, {
				scenetypeid : 4,
				scenetypename : "渠道商"
			} ];
			
			$scope.$state = $state;
			$scope.$stateParams = $stateParams;

///////////////////省市县三级联动部分 begin//////////////////////////////
			$scope.pca = utils.pca;
			$scope.cities = [];
			$scope.areas = [];
			// 获取市
			$scope.$watch("orders.buyerprovinceid", function(newValue,
					oldValue, scope) {
				if (newValue != oldValue) {
					utils.httpGet(
							"/jsbweb/commonUtils.do?type=district&provinceid="
									+ newValue, function(resp) {
										console.log(resp)
								$scope.cities = resp.data.rows;
								$scope.areas = [];
							});
				}
			});
			// 获取县、区
			$scope.$watch("orders.buyercityid", function(newValue, oldValue,
					scope) {
				if (newValue != oldValue) {
					utils.httpGet(
							"/jsbweb/commonUtils.do?type=district&cityid="
									+ newValue, function(resp) {
								$scope.areas = resp.data.rows;
							});
				}
			});			
///////////////////省市县三级联动部分  end//////////////////////////////
			
///////////////////注册客户省市县三级联动部分 begin//////////////////////////////
			$scope.pca = utils.pca;
			$scope.cities = [];
			$scope.areas = [];
			// 获取市
			$scope.$watch("orders.provinceid", function(newValue,
					oldValue, scope) {
				if (newValue != oldValue) {
					utils.httpGet(
							"/jsbweb/commonUtils.do?type=district&provinceid="
									+ newValue, function(resp) {
										console.log(resp)
								$scope.cities = resp.data.rows;
								$scope.areas = [];
							});
				}
			});
			// 获取县、区
			$scope.$watch("orders.cityid", function(newValue, oldValue,
					scope) {
				if (newValue != oldValue) {
					utils.httpGet(
							"/jsbweb/commonUtils.do?type=district&cityid="
									+ newValue, function(resp) {
								$scope.areas = resp.data.rows;
							});
				}
			});			
///////////////////注册客户省市县三级联动部分  end//////////////////////////////
			

/////////////////////获取仓库、、、			
			$http
			.get("/jsbweb/enterprise/billing/getstationtype.do")
			.success(function(data) {
				$scope.stationtype = data;
			});
	
//////////////////////获取客户			
			$http
			.get("/jsbweb/enterprise/billing/getcontactname.do")
			.success(function(data) {
				$scope.buy = data;
			});
			
			
			//
			$scope.$watch("orders.goodsdeposit", function(newValue, oldValue,
					scope) {
				if (newValue > $scope.orders.totgoodsmoney) {
					$alert({title: '提示：', content: '收款金额不能大于货物总金额！', placement: 'masget-top',type: 'info',duration:2,show: true});
					return;
				}
				if (newValue == $scope.orders.totgoodsmoney) {
					var item = {};
					item.id = 1;
					item.name = "现付";
					$scope.settlementtype.splice(0,
							$scope.settlementtype.length);
					$scope.settlementtype.push(item);
				} else if (newValue >= 0
						&& newValue < $scope.orders.totgoodsmoney) {
					$scope.settlementtype.splice(0,
							$scope.settlementtype.length);
					var item = {};
					item.id = 2;
					item.name = "到付";
					$scope.settlementtype.push(item);
					var item1 = {};
					item1.id = 4;
					item1.name = "月结";
					$scope.settlementtype.push(item1);
				}
			})
			
			$scope.doQueryAndLinkGoodsData = function(){
				$state.go("goodsList");
			}

			$scope.addsalesorder = function(){
				if($scope.orders.unknowbuery){
					$scope.orders.buyerid = 0;
					$scope.orders.buyerstationid = 0;
					$scope.orders.buyerstafferid = 0;
				}
				var data = {data: angular.toJson($scope.orders)};
				 $http({
			            method : 'POST',
			            url : 'addsalesorder.do',
			            data : $.param(data),
			            headers : {
			                'Content-Type' : 'application/x-www-form-urlencoded'
			            }
			        }).success(function(data){
			        	console.log(data);
			        	if (data.ret == 0) {
			        		$alert({title: '提示：', content: '亲,售货开单成功！！', placement: 'masget-top',type: 'info',duration:2,show: true});
			        		setTimeout("location.reload()",3000);
						} else {
							$alert({title: '提示：', content: '亲,售货开单失败！！', placement: 'masget-top',type: 'info',duration:2,show: true});
						}
//			        	$scope.orders = {
//								ordernum:"",
//								totgoodsmoney : 0,
//								orderlist:[],
//								warehouseid:0
//							};
			        }).error(function(){
			        	console.log("err");
			        	$alert({title: '提示：', content: '亲,售货开单失败！！', placement: 'masget-top',type: 'info',duration:2,show: true});
			    });
			}
			
			
			//	
			// //查询购物车
			// $http
			// .get("/jsbweb/enterprise/billing/listcart.do?companyid=111507530")
			// .success(function(data) {
			// console.log(data);
			// $scope.result3 = data;
			// $scope.$watch(function(){
			// var total = 0;
			// var goodslist = $scope.result3[0].goodslist;
			// for(var i =0;i<goodslist.length;i++){
			// console.info(goodslist[i].numbers);
			// total+=parseInt((goodslist[i].numbers==null||goodslist[i].numbers=='')?0:goodslist[i].numbers);
			// }
			// return total;
			// },function(newValue,oldValue){
			// $scope.newValue = newValue;
			// })
			//						
			// });
			//		
			//		
			 //删除购物车
			/* $scope.deletecart = function(cart) {
			 //var goodscartid = cart.goodscartid;
			 var objAdd = {};
			 var obj = new Object();
			 var ary = new Array();
						
			 obj.goodscartid = cart.goodscartid;
			 	ary.push(obj);
			 	objAdd. goodscarts = ary;
			 	var data = {};
			 		data.data = $.toJSON(objAdd);
			 			$http(
			 					{
			 							method : 'POST',
			 							url : "/jsbweb/enterprise/billing/delete.do",
			 							data : $.param(data),
			 							headers : {
			 								'Content-Type' : 'application/x-www-form-urlencoded'
			 							}
				}).success(function(data) {
					if (data.ret == 0) {
						$alert({title: '提示：', content: '删除成功!', placement:'masget-top',type: 'info', duration:2, show: true});
					} else {
				$alert({title: '提示：', content: '删除失败!', placement:'masget-top',type: 'warning', duration:2, show: true});
					}
				});
			 };*/

		} ]);