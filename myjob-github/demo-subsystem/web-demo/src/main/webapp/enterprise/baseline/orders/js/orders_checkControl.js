/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersCheckController",
    ['$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout","purchaseOrdersService","purchaseOrdersService","commodityService",
        function($scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout,purchaseOrdersService,purchaseOrdersService,commodityService) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.orders = {};
    	$scope.orders.orderlist = [];
    	$scope.temp_orderlist=[];
    	$scope.selectedAcontact= {};
    	$scope.warehouse = {};
    	
    	$scope.orderpaymentflow= {};
    	
    	$scope.gathering = {};
    	
    	//收货人信息,初始化省市县
        $scope.receiveData = {};
        //开单地址是否显示
        $scope.receiveData.addressItemShow = false;
        //地址添加模态窗口是否显示
        $scope.receiveData.modalShow = false;
        $scope.receiveData.provinceid = 0;
        $scope.receiveData.cityid = 0;
        $scope.receiveData.areaid = 0;
        
        
        //默认标志
    	$scope.type = [
  	                 { id: 1, value: "是" },
  	                 { id: 2, value: "否" }
  	             ];
    	
    	//订单详解的查询
	 	$http({
            method : 'POST',
            url : "/jsbweb/baseline/orders/get_orders.do",
            data : $.param($stateParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
            if(data.ret==0){
            	
            	$scope.orders = data.data.rows[0];
            	
            	$scope.orders.orderaddressid = $scope.orders.orderaddress.orderaddressid;
            	
       		 	switch($scope.orders.orderstate)
	       	        {
	      	              case 2:
	      	            	$scope.orders.orderstatename = "待审核";
	      	            	break;
	      	              case 3:
	      	            	$scope.orders.orderstatename = "待财务审核";
	      	            	break;
	      	              case 12:
	      	            	$scope.orders.orderstatename = "待出库审核"; 
	      	            	break;
	      	              case 9:
	      	            	$scope.orders.orderstatename = "待发货";
	      	            	break;
	      	              case 5:
	      	            	$scope.orders.orderstatename = "已完成";
	      	            	break;
	      	              case 8:
	      	            	$scope.orders.orderstatename = "订单取消";
	      	            	break;
	       	        }
            	
            	console.info($scope.orders);
            	
            	var i = 1;
            	angular.forEach($scope.orders.orderlist,function(value,index){
            		var a = parseFloat(value.totalmoney);
            		value.totalmoney = a.toFixed(2);
            		
            		value.seqid = i;
            		i++;
            	});
            	
            	var b = parseFloat($scope.orders.totgoodsmoney);
            	$scope.orders.totgoodsmoney = b.toFixed(2);
            	
            	$scope.orders.contactname = $scope.orders.orderaddress.contactname;
            	$scope.orders.provincename = $scope.orders.orderaddress.provincename;
            	$scope.orders.cityname = $scope.orders.orderaddress.cityname;
            	$scope.orders.areaname = $scope.orders.orderaddress.areaname;
            	$scope.orders.address = $scope.orders.orderaddress.address;
            	$scope.orders.mobile = $scope.orders.orderaddress.mobile;
        		
            	//订单号生成条形码
        	    $("#bcTarget").empty().barcode($scope.orders.ordernum, "code128",{barWidth:1, barHeight:30,showHRI:false});
            	
        		
            }else if(data.ret==10){
                $.jBox.tip("请先登录", 'warning');
            }else{ 
                $.jBox.tip("获取数据失败", 'warning');
            }
        }).error(function(rep){
            $.jBox.tip("获取数据失败", 'warning');
        });
	 	
	 	//日志的查询
	 	/*$scope.searchlog = function(orders){
	 		$http({
	            method : 'POST',
	            url : "/jsbweb/baseline/orders/getOrdertracking.do?relationnum=" + $scope.orders.ordernum,
	            headers : {
	                'Content-Type' : 'application/x-www-form-urlencoded'
	            }
	        }).success(function(data) {
	        	console.warn(data);
	            if(data.ret==0){
	            	
	            	$scope.orderslog = data.data.rows;
	            	console.log($scope.orderslog);
	            	
	            }else if(data.ret==10){
	                $.jBox.tip("请先登录", 'warning');
	            }else{ 
	                $.jBox.tip("获取数据失败", 'warning');
	            }
	        }).error(function(rep){
	            $.jBox.tip("获取数据失败", 'warning');
	        });
	 	}*/
	 	
	 	//订单支付流水
	 	$scope.getPaymentflow = function(orders){
	 		$http({
	            method : 'POST',
	            url : "/jsbweb/baseline/orders/get_paymentflow.do?orderid=" + $scope.orders.orderid,
	            headers : {
	                'Content-Type' : 'application/x-www-form-urlencoded'
	            }
	        }).success(function(data) {
	        	console.warn(data);
	            if(data.ret==0){
	            	
	            	$scope.orderpaymentflow = data.data.rows;
	            	console.log($scope.orderpaymentflow);
	            	
	            	angular.forEach($scope.orderpaymentflow,function(value,index){
    					if(value.state == 1){
    						value.statename = "已作废"
    					}else{
    						value.statename = "已收款 "
    					}
    				});
	            	
	            	
	            }else if(data.ret==10){
	                $.jBox.tip("请先登录", 'warning');
	            }else{ 
	                $.jBox.tip("获取数据失败", 'warning');
	            }
	        }).error(function(rep){
	            $.jBox.tip("获取数据失败", 'warning');
	        });
	 	}
	 	
	 	
	 	
	 	//修改界面跳转
    	$scope.modifyOrders = function(orders){
    		console.warn("888888888888");
    		console.warn(orders);
    		$state.go("add");
    		
    		$state.orders = angular.copy(orders);
    		
    	}; 
	 	
	 	
	 	//打印预览-pdf
     	$scope.privewToPdf=function(){
     		
     		var params="data="+encodeURIComponent(encodeURIComponent(checkNull(angular.toJson($scope.orders))));
     		window.open("/jsbweb/baseline/orders/reportOrders.do?" +params);
     	};
     	
     	var checkNull = function(v){
    		if(angular.isUndefined(v)||v == null){
    			v = "";
    		}
    		return v;
    	};
    	
    	//导出
        $scope.onBtnClickexportGoods = function(){
        	
        	var params= "ordernum=" + $scope.orders.ordernum;
        	window.location.href="/jsbweb/baseline/orders/export.do?" +params;
        }
        
        //订单审核
    	$scope.auditOrders = function(orders){
    		console.info(orders.buyerid);
    		
            var param = {};
            param.orderid = orders.orderid;
            param.buyerid = orders.buyerid;
            param.ordernum = orders.ordernum;
            param.orderstate = orders.orderstate;
            $.jBox.confirm("审核销售单号：" +  orders.ordernum + "是否通过", "温馨提示", function(v, h, f){
            	if (v == 'yes') {
            		param.orderstate = 3;
        	    }
        	    if (v == 'cancel') {
        	        $.jBox.tip('已取消');
        	        return;
        	    }

            	$http({
		                method: 'POST',
		                url: "/jsbweb/baseline/orders/audit.do",
		                data: $.param(param),
		                headers: {
		                    'Content-Type': 'application/x-www-form-urlencoded'
		                }
		            }).success(function (data) {
		                if(data.ret==0){
		                    $.jBox.tip("操作成功", 'success');
		                    //$scope.onClickToQuery();
		                    location.reload();
		                    
		                }else if(data.ret==10){
		                    $.jBox.tip("登录信息异常,请重新登录", 'warning');
		                }else{
		                    $.jBox.tip("操作失败", 'warning');
		                }
		            }).error(function(rep){
		                console.log(rep)
		                $.jBox.tip("操作失败", 'warning');
		            });
            });

        };
        
        
        
        //订单财务审核
    	$scope.auditOrdersFinancial = function(orders){
    		console.info(orders.buyerid);
    		
            var param = {};
            param.orderid = orders.orderid;
            param.buyerid = orders.buyerid;
            param.ordernum = orders.ordernum;
            param.orderstate = orders.orderstate;
            
            $.jBox.confirm("财务审核销售单号：  " + orders.ordernum + " 是否通过？", "温馨提示", function(v, h, f){
                if(v == "ok"){
                    $http({
                        method: 'POST',
                        url: "/jsbweb/baseline/orders/auditFinancial.do",
                        data: $.param(param),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).success(function (data) {
                        if(data.ret==0){
                        	$.jBox.tip("操作成功", 'success');
		                    
                        	location.reload();
                        }else if(data.ret==10){
                            $.jBox.tip("登录信息异常,请重新登录", 'warning');
                        }else{
                        	$.jBox.tip("操作失败", 'warning');
                        }
                    }).error(function(rep){
                        console.log(rep)
                        $.jBox.tip("操作失败", 'warning');
                    });
                }
                return true;
            });
        };
        
        
        //x修改销售单收货地址   
        $scope.submitAddress = function(){
       	 
       	 $scope.ordersAddress = $scope.orders.orderaddress;
       	 $scope.ordersAddress.companyid = $scope.orders.buyerid;
         	 $scope.ordersAddress.companyname =  $scope.orders.buyername;
         	 $scope.ordersAddress.addressmanageid = $scope.orders.orderaddress.addressmanageid;
         	 $scope.ordersAddress.orderid =  $scope.orders.orderid;
         	 $scope.ordersAddress.buyerid =  $scope.orders.buyerid;
         	 $scope.ordersAddress.orderaddressid = $scope.orders.orderaddressid;
         	 
       	 
       	 var data = {data: angular.toJson($scope.ordersAddress)};
            $http({
                method : 'POST',
                url : '/jsbweb/baseline/orders/update_orderaddress.do',
                data : $.param(data),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                
                if(data.ret == 0) {
                    $.jBox.tip('地址修改成功', 'success');
                    $('#addressManager').modal("hide");
                    
                } 
                else if(data.ret == 20012){
               	 
               	 $.jBox.tip('订单号已存在' , 'warning');
                }
                else {
                    $.jBox.tip('地址修改失败' , 'warning');
                }

            }).error(function(rep){
                $.jBox.tip('地址修改失败', 'warning');
            });
       	 
        }    
            
      //查询收发货地址
    	$scope.getAddressmanage = function(buyerid,go){
    		
    		if(go != true){
    			if(buyerid == undefined){
        			$.jBox.tip("请选择一个经销商!", 'warning');
        			return;
        		}
    			$('#addressManager').modal("show");
    		}
    		
    		var params = {};
    		params.pagesize = 20;
    		params.pagenum = 1;
    		params.addresstype = 1;
    		params.companyid = buyerid;
    		if(buyerid == undefined ){
    			return;
    		}
    		purchaseOrdersService.httpPost(purchaseOrdersService.getAddressManage(),params,function(resp){
    			
    			if(resp.ret == 0){
    				$scope.receiveData.dataList = resp.data.rows;
    				//不显示编辑修改功能
    				angular.forEach($scope.receiveData.dataList,function(data,index,array){
    					data.editDeleteShow = false;
    				});
    				
    				if($scope.receiveData.dataList.length != 0 && go==true){
    					if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
    						$scope.addressClick($scope.receiveData.dataList[0]);
    						$scope.receiveData.dataList[0].receiveData = true;
    					}
    				}else{
    					$("#addressManager").modal("show");
    					return;
    				}
    				
    				//默认选中
    				if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
	     				angular.forEach($scope.receiveData.dataList,function(data,index,array){
	     					if(data.isdefault == 1){
	     						$scope.addressClick(data);
	     						data.receiveData = true;
	     					}
	     				});
    				}
    				
    				/*if($scope.receiveData.dataList.length != 0){
    					if($scope.orders.orderid == undefined || $scope.orders.orderid == ''){
    						$scope.addressClick($scope.receiveData.dataList[0]);
    						$scope.receiveData.dataList[0].receiveData = true;
    					}
    				}*/
    			}else if(resp.ret == 10){
    				
    				$.jBox.tip("请重新登录!", 'warning');
    			}else{
    				
    				$.jBox.tip("查询收发货地址失败", 'warning');
    			}
    		});
    	};   
    	
    	//点击选择地址
	   	$scope.addressClick = function(receiveItem){
	   		//不显示编辑修改功能
	   		angular.forEach($scope.receiveData.dataList,function(data,index,array){
	   			data.editDeleteShow = false;
	   		});
	   		$scope.receiveData.modalShow = false;
	   		$scope.receiveData.addressItemShow = true;
	   		receiveItem.editDeleteShow = true;
	   		//选择地址
	   		
	   		$scope.orders.orderaddress = receiveItem;
	   		console.warn($scope.orders.orderaddress);
	   	};
	   	
	   	
	   	//收款
		$scope.recharge = function(){
			$("#modal").modal("show");
			
		}
		
		//关闭model
		$scope.hide = function(){
			$("#modal").modal("hide");
			
			$scope.gathering = {};
		}
		
		$scope.gatheringOrders = function(gathering){
    		
    		console.info(gathering.selectValue);
    		if(gathering.selectValue == undefined){
    			$.jBox.tip('请选择支付方式', 'warning');
    			return;
    		}
    		if(gathering.selectValue == 1){
    			$("#modal").modal("hide");
    			return;
    		}
    		
    		if(gathering.selectValue == 2 ){
    			
    			$scope.gathering.ordernum = $scope.orders.ordernum;
    			$scope.gathering.orderid = $scope.orders.orderid;
    			
    			var data = { data: angular.toJson($scope.gathering)};
    			$http({
	                method: 'POST',
	                url: "/jsbweb/baseline/orders/cash.do",
	                data: $.param(data),
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded'
	                }
	            }).success(function (data) {
	
	                if (data.ret == 0) {
	                    $.jBox.tip('现金收款成功', 'success');  
	                    
	                    $("#modal").modal("hide");
	                    
	                    $scope.gathering = {};
	                    
	                    location.reload();
	                }else if(data.ret == 20365){
	                	$.jBox.tip('当次收款金额大于待收款金额,不能进行收款操作', 'warning');
	                }
	                else{
	                	$.jBox.tip('现金收款失败', 'warning');
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

