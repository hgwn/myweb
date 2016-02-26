//商品控制器
billingModule.controller("goodsListCtr", [ '$scope', '$http', "$stateParams",
		"$state", "$timeout",'utils','$alert',
		function($scope, $http, $stateParams, $state, $timeout, utils,$alert) {

	
//				$scope.$on('goodsSearchList',function(event,data){
//					$scope.items = data.items;
//					$scope.goodsdata=data;
//				})
//				
//				//购物车
//				$scope.edit = function(v) {	
//					$scope.billing = v;
//										
//				};
//				
				//默认跳转到该页面时,自动查询一次数据
				$timeout(function(){
					$scope.queryForm();
				},100);
				
				$scope.goodsskuattrib = {};
				
				$scope.addToOrder = function(item){
					$scope.selectedGoods = jQuery.extend(true, {}, item);
					$scope.selectedGoods.goodsqty = 1;
					$scope.selectedGoods.goodsunitprice = $scope.selectedGoods.shopprice;
					$scope.selectedGoods.dealingprice =  $scope.selectedGoods.shopprice + "";
					if( $scope.selectedGoods.goodsskuattrib.length == 0){
						$scope.selectedGoods.skuid = 0;
						
					}else{
						for(var index=0; index < $scope.selectedGoods.goodsskuattrib.length; index++){
							var items = $scope.selectedGoods.goodsskuattrib[index];
							$scope.goodsskuattrib[items.attribid] = items;
						}
					}
					//					$scope.goodsskuattrib[items.attribid] = "";
					
				}
				$scope.$watch("goodsskuattrib", function(newValue, oldValue,
						scope) {
					console.log(newValue);
				});
				$scope.cancelModel = function(){
					
				}
				
				$scope.selectedSKUAttribClick = function(item, items){
					if($scope.goodsskuattrib[items.attribid].attribproperties == item.attribproperties){
						//如果该属性已经是选中状态,则将该状态设置为未选中状态
						item.selected = false;
						$scope.goodsskuattrib[items.attribid].attribproperties = "";
//						return;//不往下执行
					}else{//该属性值是最新选中，则将同一属性的其他属性的设置为未选中状态，同时设置当前属性值为选中状态
						for(var i=0;i<items.properties.length;i++){
							if(items.properties[i].attribproperties != item.attribproperties){
								items.properties[i].selected = false;
							}else{
								items.properties[i].selected = true;
							}
			            }
						$scope.goodsskuattrib[items.attribid].attribproperties = item.attribproperties;
					}
					console.log($scope.goodsskuattrib);
					var goodsattrib = [];
					//现在组织goodsattrib数组
					for(var index=0; index < $scope.selectedGoods.goodsskuattrib.length; index++){
						var row = $scope.selectedGoods.goodsskuattrib[index];
						if($scope.goodsskuattrib[row.attribid].attribproperties != undefined 
							&& $scope.goodsskuattrib[row.attribid].attribproperties != ""){
							var goodsattrib_row = {};
							goodsattrib_row.attribid = row.attribid;
							goodsattrib_row.attribtype = row.attribtype;
							goodsattrib_row.attribproperties = $scope.goodsskuattrib[row.attribid].attribproperties;
							goodsattrib.push(goodsattrib_row);
						}
					}
					console.log(goodsattrib);
					//现在组织接口参数:
					var skuattrib = {};
					skuattrib.companyid = $scope.selectedGoods.companyid;
					skuattrib.goodsid = $scope.selectedGoods.goodsid;
					skuattrib.goodsattrib = angular.toJson(goodsattrib);
					console.log(skuattrib);
					//现在调用获取sku方法
			        $http({
			            method : 'POST',
			            url : '../commodity/get_goods_sku.do',
			            data : $.param(skuattrib),
			            headers : {
			                'Content-Type' : 'application/x-www-form-urlencoded'
			            }
			        }).success(function(data){
			        	console.log("getsku");
			        	console.log(data);
			        	if(data.endedflag == 1){
//				            将现有的商品属性跟返回的商品属性进行比较，若有返回则替换现有的商品属性
//				            angular.forEach($scope.selectedGoods.goodsskuattrib,function(da,ind,array){
//				                angular.forEach(data.goodsskuattrib,function(data,index,array){
//				                    if(da.attribid==data.attribid){
//				                        $scope.selectedGoods.goodsskuattrib[ind] = data;
//				                    }
//				                });
//				            });
			        		for(var index=0; index < data.goodsskuattrib.length; index++){
			        			for(var index1 = 0; index1 < $scope.selectedGoods.goodsskuattrib.length; index1++){
			        				if(data.goodsskuattrib[index].attribid == $scope.selectedGoods.goodsskuattrib[index1].attribid){
			        					$scope.selectedGoods.goodsskuattrib[index1].properties = [].concat(data.goodsskuattrib[index].properties);
			        					for(var i=0;i<$scope.selectedGoods.goodsskuattrib[index1].properties.length;i++){
		    								$scope.selectedGoods.goodsskuattrib[index1].properties[i].selected = false;
			    			            }
			        				}
			        			}
			        		}
				            console.log($scope.selectedGoods.goodsskuattrib)
			        	}else{//sku选择结束，现在显示金额/库存等信息
			        		var skuattribstring = "";
							for(var index=0; index < $scope.selectedGoods.goodsskuattrib.length; index++){
								var row = $scope.selectedGoods.goodsskuattrib[index];
								if(index == 0)
									skuattribstring += $scope.goodsskuattrib[row.attribid].attribproperties;
								else
									skuattribstring += "+" + $scope.goodsskuattrib[row.attribid].attribproperties;
							}
							console.log(skuattribstring)
							
							$scope.selectedGoods.shopprice = data.price + "";
							$scope.selectedGoods.dealingprice = data.price + "";
							$scope.selectedGoods.skuid = data.skuid;
			        	}
			        }).error(function(){
			        	
			        });
				}
							    
			    $scope.submitAddCart = function(){
			    	console.log($scope.selectedGoods);
			    	if(($scope.selectedGoods.skuid==0 && $scope.selectedGoods.goodsskuattrib.length == 0)||$scope.selectedGoods.skuid > 0){
				    	var orderlist = {};
				    	orderlist = jQuery.extend(true, {}, $scope.selectedGoods);
//				    	$scope.orders.orderlist.splice($scope.orders.orderlist.length-3, 0, orderlist);
				    	$scope.orders.orderlist.push(orderlist);
				    	$scope.sumgoodsmoney();
				    	console.log($scope.orders);
				    	$alert({title: '提示：', content: '亲,加入购物车成功！！', placement: 'masget-top',type: 'info',duration:2,show: true});
			    	}
			    	else{
			    		//alert("请先选择商品规格");
			    		$alert({title: '提示：', content: '亲,请选择商品型号!', placement: 'masget-top',type: 'success',duration:2,show: true});
			    	}
			    }
			    
//			    $scope.initParams = function(){
//			        $scope.merchantPriceDetail = {};
//			        $scope.merchantPriceDetail.dealingprice = 0;
//			        $scope.merchantPriceDetail.goodsqty = 1;
//			        $scope.merchantPriceDetail.endedflag = 1;
//			    };
//			    
//			    $scope.selectedClicked = function(item,items){
//		            if(item.selected){
//		                items.selectedFlag = false;
//		                item.selected = false;
//		            }else{
//		                angular.forEach(items.properties,function(data,index,array){
//		                    items.properties[index].selected = false;
//		                });
//		                items.selectedFlag = true;
//		                item.selected = true;
//		            }
//		        };
//			    
				//购物车选择商品获取剩余库存量
				/*$scope.point= function(k){
					$scope.search = k;
					var objAdd = {};
					var obj = new Object();
					var ary2 = new Array();
					obj.attribid = k.attribid;
					obj.attribtype = k.attribtype;
					obj.attribproperties = k.attribproperties;
					ary.push(obj);
					
					objAdd.goodsid = k.goodsid
					objAdd.goodsattrib = ary;
					
					var data = {};
					data.data = $.toJSON(objAdd);
					$http(
							{
								method : 'POST',
								url : "/jsbweb/enterprise/billing/getgoodssku.do",
								data : $.param(data), // pass in data as strings 		
								headers : {
									'Content-Type' : 'application/x-www-form-urlencoded'
								}
							// set the headers so angular passing info as form data (not request payload) 		
							}).success(function(data) {
							$scope.result2 = data;	
					});
				}*/
//				
//				//加入购物车
//				$scope.processForm = function() {
//					
//					var objAdd = {};
//					var obj = new Object();
//					var ary = new Array();
//					
//					obj.numbers = $scope.merchantPriceDetail.num;
//					obj.marketprice = $scope.billing.marketprice;
//					obj.barcode = $scope.billing.barcode;
//					obj.brandid = $scope.billing.brandid;
//					obj.companygoodsclassifyid = $scope.billing.companygoodsclassifyid;
//					obj.goodsid = $scope.billing.goodsid;
//					obj.dealprice = $scope.merchantPriceDetail.price;
//					obj.shopprice = $scope.billing.shopprice;
//					obj.skuid = $scope.merchantPriceDetail.skuid;
//					obj.virtualflag = $scope.billing.virtualflag;
//					obj.companyid = $scope.billing.companyid;
//					
//					ary.push(obj);
//					objAdd. goodscart = ary;
//					var data = {};
//					data.data = $.toJSON(objAdd);
//					$http(
//							{
//								method : 'POST',
//								url : "/jsbweb/enterprise/billing/addcart.do",
//								data : $.param(data),
//								headers : {
//									'Content-Type' : 'application/x-www-form-urlencoded'
//								}
//							// set the headers so angular passing info as form data (not request payload) 		
//							}).success(function(data) {
//						if (data.ret == 0) {
//							$('#modal-container-355358').modal('hide');
//							alert("成功")
//						} else {
//							alert("失败")
//						}
//					});
//				};
//				
//				
//				//打开购物车	
//				 $scope.initParams = function(){
//				        $scope.merchantPriceDetail = {};
//				        $scope.merchantPriceDetail.price = 0;
//				        $scope.merchantPriceDetail.quantity = 0;
//				        $scope.merchantPriceDetail.num = 1;
//				        $scope.merchantPriceDetail.endedflag = 1;
//				        $scope.merchantPriceDetail.totalPrice = function(){
//				            return 0;
//				        };
//				    };
//				    $scope.initParams();
//				    var arr = new Array();
//				    //添加购物车、立即购买
//				    $scope.addCart = function(item){
//				        $scope.initParams();
//				        //每次打开购物车都清空属性选择样式，恢复出厂设置
//				        angular.forEach(item.goodsskuattrib,function(data,index,array){
//				            data.selectedFlag = false;
//				            angular.forEach(data.properties,function(data,index,array){
//				                data.cssFlag = false;
//				            });
//				        });
//				        //某商品
//				        $scope.billing = item;
//				        //arr = new Array();
//
//				    };
//				    //删除attribproperties值为val的数组元素start
//				    Array.prototype.indexOfIt = function(val) {
//				        for (var i = 0; i < this.length; i++) {
//				            if (this[i].attribproperties == val) return i;
//				        }
//				        return -1;
//				    };
//				    Array.prototype.remove = function(val) {
//				        var index = this.indexOfIt(val);
//				        if (index > -1) {
//				            this.splice(index, 1);
//				        }
//				    };
//				    //删除attribproperties值为val的数组元素end
//
//				    //用户选择某一属性触发的一系列操作.item为具体某一属性,items则为某一类属性的集合
//				    $scope.selectedClick = function(item,items,billing){
//				        //如果某大类属性未被选择则选择
//				        if(!items.selectedFlag){
//				            var a = {};
//				            a.attribid = items.attribid;
//				            a.attribtype = items.attribtype;
//				            a.attribproperties = item.attribproperties;
//				            arr.push(a);
//				        }else{
//				            for(var i=0;i<items.properties.length;i++){
//				                arr.remove(items.properties[i].attribproperties);
//				            }
//				            if(!item.cssFlag){
//				                var a = {};
//				                a.attribid = items.attribid;
//				                a.attribtype = items.attribtype;
//				                a.attribproperties = item.attribproperties;
//				                arr.push(a);
//				            }
//				        }
//				        $scope.selectedAttributeList={reconciliationOrder:{}};
//				        $scope.selectedAttributeList.reconciliationOrder.companyid = $scope.billing.companyid;
//				        $scope.selectedAttributeList.reconciliationOrder.goodsid = billing.goodsid;
//				        $scope.selectedAttributeList.reconciliationOrder.goodsattrib = angular.toJson(arr);
//
//				        $http({
//				            method : 'POST',
//				            url : '/jsbweb/enterprise/billing/get_goods_sku.do',
//				            data : $.param($scope.selectedAttributeList.reconciliationOrder),
//				            headers : {
//				                'Content-Type' : 'application/x-www-form-urlencoded'
//				            }
//				        }).success(function(data){
//				            //将现有的商品属性跟返回的商品属性进行比较，若有返回则替换现有的商品属性
//				            angular.forEach($scope.billing.goodsskuattrib,function(da,ind,array){
//				                angular.forEach(data.goodsskuattrib,function(data,index,array){
//				                    if(da.attribid==data.attribid){
//				                        $scope.billing.goodsskuattrib[ind] = data;
//				                    }
//				                });
//				            });
//				            //选择完商品属性之后,查询出来价格跟数量
//				            if(data.endedflag == 2){
//				                $scope.merchantPriceDetail = data;
//				                $scope.merchantPriceDetail.num = 1;
//				                $scope.merchantPriceDetail.flag = data.endedflag;
//				                $scope.merchantPriceDetail.totalPrice = function(){
//				                    var p = $scope.merchantPriceDetail;
//				                    var sum = parseFloat(p.num) * parseFloat(p.price);
//				                    return sum.toFixed(2);
//				                };
//				            }else{
//				                $scope.initParams();
//				            }
//				        }).error(function(){
//
//				        });
//				        //被顾客选中某一属性则更换特殊样式,则同类的其它属性样式恢复原貌
//				        $scope.selectedClick(item,items);
//				    };
//				    
//				    
//				    //打开页面获取cookies保存的商品数量
//					/*$scope.countCommodity = 0;
//					var arrCart = new Array();
//				    angular.forEach($cookieStore.get("myCarts_rb"),function(data,index,array){
//				        $scope.countCommodity = $scope.countCommodity + parseInt(data.numbers);
//				        arrCart.push(data);
//				    }); */   	
//				    
//				    $scope.submitAddCart = function(){
//				    	//判断是否重复添加商品
//				    	var repeatedFlag = false;
//
//				        if($scope.merchantPriceDetail.flag == 2){
//				        	$alert({title: '提示：', content: '成功加入购物车!', placement: 'masget-top',type: 'info', duration:2, show: true});
//				            
//				            for(i=0;i<arrCart.length;i++){
//				                var a = arrCart[i];
//				                if($scope.billing.goodsid == arrCart[i].goodsid && $scope.merchantPriceDetail.skuid == arrCart[i].skuid){
//				                	arrCart[i].numbers = parseInt(arrCart[i].numbers)+parseInt($scope.merchantPriceDetail.num);
//				                	//若重复添加,则把重复状态置为true
//				                	repeatedFlag = true;
//				                }
//				            }
//				            if(!repeatedFlag){
//				                var cart = {};
//				                cart.companyid = $scope.billing.companyid;
//				                cart.brandid = $scope.billing.brandid;
//				                cart.companygoodsclassifyid = $scope.billing.companygoodsclassifyid;
//				                cart.goodsid = $scope.billing.goodsid;
//				                cart.marketprice = $scope.billing.marketprice;
//				                cart.virtualflag = $scope.billing.virtualflag;
//				                cart.barcode = $scope.merchantPriceDetail.barcode;
//				                cart.shopprice = $scope.merchantPriceDetail.price;
//				                cart.dealprice = $scope.merchantPriceDetail.price;
//				                cart.skuid = $scope.merchantPriceDetail.skuid;
//				                cart.numbers = $scope.merchantPriceDetail.num;
//				                arrCart.push(cart);	
//				            }
//				            $cookieStore.put("myCarts_rb",arrCart);
//				            $scope.countCommodity = 0;
//				            angular.forEach($cookieStore.get("myCarts_rb"),function(data,index,array){
//				                $scope.countCommodity = $scope.countCommodity + parseInt(data.numbers);
//				            }); 
//				            console.info($cookieStore.get("myCarts_rb"));
//				        }else{
//				        	$alert({title: '提示：', content: '亲,请选择商品型号!', placement: 'masget-top',type: 'info', duration:1, show: true});
//				        }
//				        
//				        
//				    };
//				   
//				    $scope.balanceAccount = function(){
//				        commodityService.httpGet(commodityService.getGetSessionUrl(),function(resp){
//				            $scope.hasLogin = resp;
//				            console.info(resp);
//				            if($scope.hasLogin.ret == 10){
//				            	$alert({title: '您好，', content: '请先登录!', placement: 'masget-top',type: 'info', duration:1, show: true});
//				            }else if($scope.hasLogin.ret == 0){
//				            	$scope.hasLogin.companyid;
//				            }
//				        });
//				    }; 
//				    
				    
				    //判断是否存在cookies
				  /*  $scope.isCookie = function(key){
				        var acookie=document.cookie.split("; ");
				        console.info(acookie);
				        for(var i=0;i<acookie.length;i++) {
				            var arr = acookie[i].split("=");
				            if(arr[0]==key){
				                return true;
				            }
				        }
				        return false;
				    };*/
				
		} ]);