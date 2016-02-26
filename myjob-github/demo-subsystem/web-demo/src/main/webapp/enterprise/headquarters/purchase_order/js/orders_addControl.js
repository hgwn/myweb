/**
 * Created by Administrator on 2015-09-06.
 */
entOrdersModule.controller("ordersAddController",
    ['OrdersBaseService','$scope','$rootScope','$http',"$stateParams","$state","i18nService","ordersService","$timeout",
        function(OrdersBaseService,$scope, $rootScope, $http,$stateParams,$state,i18nService,ordersService,$timeout) {
    	i18nService.setCurrentLang('zh-cn');
    	$scope.orders = {};
    	$scope.orders.orderlist = [];
    	$scope.temp_orderlist=[];
    	$scope.selectedAcontact= {};
    	$scope.warehouse = {};
    	$scope.orders.ordersource = 1;
    	$scope.orders.orderaddress = {};
    	//收货人信息,初始化省市县
        $scope.receiveData = {};
        $scope.receiveData.addressItem = {};
        //开单地址是否显示
        $scope.receiveData.addressItemShow = false;
        //地址添加模态窗口是否显示
        $scope.receiveData.modalShow = false;
        $scope.receiveData.provinceid = 0;
        $scope.receiveData.cityid = 0;
        $scope.receiveData.areaid = 0;
        $scope.addressModifyAddFlag = '';
    	
    	//收货人信息,初始化省市县
        $scope.receiveData = {};
        //开单地址是否显示
        $scope.receiveData.addressItemShow = false;
        //地址添加模态窗口是否显示
        $scope.receiveData.modalShow = false;
        $scope.receiveData.provinceid = 0;
        $scope.receiveData.cityid = 0;
        $scope.receiveData.areaid = 0;
    	
             //省市县初定义
             $scope.baseData = {
                 provinces:[],
                 citys:[],
                 areas:[]
             }
             
             //初始方法
             $scope.init = function(){
            	 
            	 //修改切换界面后赋值
            	 if($state.orders !=null){
            		 
 	    			$scope.orders = $state.orders;
 	    			$scope.contactkeyword = $state.orders.buyername;
 	    			$scope.selectedAcontact={
 	    					companyid:$scope.orders.buyerid,
 	    					companyname:$scope.orders.buyername,
 	    			};
 	    			
 	    			$scope.orders.edit = "修改";
 	    			
 	    			angular.forEach($scope.orders.orderlist, function(value, key){
 	    				if(value.giftflag == 1){
 	    					value.isgiftflag = false;
 	    				}else{
 	    					value.isgiftflag = true;
 	    				}
 	    			});
 	    			
 	    			//获取临时数据
 	    			$scope.orders.orderlist = angular.copy($state.orders.orderlist);
 	    			$scope.temp_orderlist = angular.copy($state.orders.orderlist);
 	    			
 	    			
 	    		}else{
 	    			
 	    			//新增界面 获取日期和单号
 	    			ordersService.getOrderNum(function(ordernum){
 	                     $scope.orders.ordernum = ordernum + "";
 	                 }, function(err){
 	                     console.log(err)
 	                 });
 	                 //$scope.getProvince();
 	    			$scope.orders.edit = "新增";
 	                console.log("新增订单")
 	                var begin_date = new Date();
 	                $scope.orders.createdtime = begin_date.pattern("yyyy-MM-dd HH:mm");
 	    			
 	    		}
             };
             //删除临时记录
             $scope.delrecord = function(index){
                 $scope.orders.orderlist.splice(index, 1);
                 $scope.temp_orderlist[index].action="delete";
             };

             //添加一行
             $scope.addNewRow = function(){
            	 
                 var row = {};
                 row.action = "add";
                 row.discountrate = 0;
                 row.goodsqty = 1;
                 row.giftflag = 1;
                 row.isgiftflag = false;
                 row.selected = "";
                 $scope.orders.orderlist.push(row);
                 
                 $scope.$watch(function() {
                     return row.selected;
                 }, function(newVal, oldVal) {
                	 
                	
         		 		
                	 //实现添加重复商品时自己匹配操作
                	 angular.forEach($scope.orders.orderlist, function(value, key){
                		 
                		 	if( value.goodsid !=undefined && value.goodsid == newVal.goodsid){
                		 		
                		 		value.goodsqty = value.goodsqty + 1;
                		 		$scope.orders.orderlist.pop();
                		 		$.jBox.tip('重复商品已合并,并且数量+1', 'warning');
                		 	}
                		});
                	 
                     row.goodsname = newVal.goodsname;
                     row.goodsid = newVal.goodsid;
                     row.dealingprice = newVal.shopprice;
                     row.goodssn = newVal.goodssn;
                     row.goodsspec = newVal.goodsspec;
                     /*if(row.goodsname != undefined){
                    	 row.maxinventory = newVal.productstockconfig.maxinventory;
                     }*/
                     
                 });
                 
                 //监听商品数量
                 $scope.$watch(function() {
                     return row.goodsqty;
                 }, function(newVal, oldVal) {
                 	var reg = /^(?:[1-9]\d*|0)$/;
                 	if(!reg.test(newVal)){
                 		newVal = oldVal;
                 		row.goodsqty = oldVal;
                 	}
                 	if(row.goodsqty>row.maxinventory){
                 		
                 		$.jBox.tip('商品数量已经超过库存数量', 'warning');
                 	}
                     row.goodsmoney = (newVal *  row.dealingprice);
                 })
                 
                 //监听单价
                 $scope.$watch(function() {
                     return row.dealingprice;
                 }, function(newVal, oldVal) {
                 	var reg1 = /^\d+(\.\d{2})?$/;
                 	var reg = /^\d+(\.\d{1})?$/;
                 	var reg2 = /^(?:[1-9]\d*|0)$/;
                 	if(!reg2.test(row.dealingprice) && !reg.test(row.dealingprice) && !reg1.test(row.dealingprice)){
                 		row.dealingprice = oldVal;
                 		newVal = oldVal;
                 	}
                     row.goodsmoney = (row.goodsqty *  newVal);

                 })
                 
                 //监听是否赠品
                 $scope.$watch(function(){
                     return row.isgiftflag;
                 }, function(newVal, oldVal){
                     if(newVal){
                         row.giftflag = 2;
                         row.goodsmoney = 0;
                         row.dealingprice = 0;
                         row.discountrate = 100;
                     }
                     else{
                         row.giftflag = 1;
                         row.dealingprice = row.shopprice;
                         row.discountrate = row.discountrate;
                         row.goodsmoney = (row.goodsqty *  row.dealingprice).toFixed(2);
                     }
                 })
                 
                 //监听折扣率
                  $scope.$watch(function(){
                     return row.discountrate;
                 }, function(newVal, oldVal){
                	var reg1 = /^\d+(\.\d{2})?$/;
                  	var reg = /^\d+(\.\d{1})?$/;
                  	var reg2 = /^(?:[1-9]\d*|0)$/;
                  	if(!reg2.test(row.discountrate) && !reg.test(row.discountrate) && !reg1.test(row.discountrate)){
                  		row.discountrate = oldVal;
                  		newVal = oldVal;
                  	}
                    row.goodsmoney = parseInt(row.goodsqty * row.dealingprice * 100 - (row.goodsqty *  row.dealingprice * newVal));
                    row.goodsmoney = row.goodsmoney/100;
                    row.goodsmoney = row.goodsmoney.toFixed(2);
                 });
              
             //计算总数量
             $scope.sumGoodsQty = function(){
                 var totgoodsqty = 0;
                 angular.forEach($scope.orders.orderlist, function(data,index,array){
                     if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice))
                         totgoodsqty += data.goodsqty;
                 });
                 $scope.orders.totgoodsqty = totgoodsqty;
                 return totgoodsqty;
             };
             //计算总金额
             $scope.sumGoodsMoney = function(){
                 var totgoodsmoney = 0;
                 angular.forEach($scope.orders.orderlist, function(data,index,array){
                     if(data.goodsid != undefined && !isNaN(data.goodsqty) && !isNaN(data.dealingprice) && !isNaN(data.discountrate))
                         totgoodsmoney += data.goodsqty * data.dealingprice - (data.goodsqty *  data.dealingprice * data.discountrate * 0.01);
                 });
                 $scope.orders.totgoodsmoney = totgoodsmoney;
                 return totgoodsmoney;
             };
             
          }
             $scope.addNewRow(); 
             
           //供应商下拉表格start
         	$scope.formData ={};
         	$scope.formData.datas = [];
         	$scope.getSuppliers = function(key){
         		var params = {};
         		params.pagesize = 1000;
         		params.pagenum = 1;
         		OrdersBaseService.httpPost(OrdersBaseService.getAllReverseSuppliers(),{data : angular.toJson(params)},function(resp){
         			$scope.formData.datas = resp.data.rows;
         			
         			//页面初始化的时候默认选中第一位供应商
         			if(key == 1){
         				$scope.supplier = $scope.formData.datas[0];
         				$scope.formData.keyWord = $scope.formData.datas[0].companyname;
         			}
         		});	
         	};
             $scope.query = function () {
             	$scope.formData.keyWord=$scope.formData.keyWord==null?"":$scope.formData.keyWord;
                 $scope.getSuppliers(2);
             };
             
             $scope.$watch("supplier",function(){
             	
             });
             //在comboxtable里的文本框输入时触发的方法
             $scope.onReset = function(){
             	$scope.supplier={};
             };
             //供应商下拉表格end
             //页面初始化的时候默认选中第一位供应商
             $scope.getSuppliers(1);
             
             //检测赠品改变时触发
             $scope.changeGiftflag = function(index){
            	 console.info(1111);
            	 $scope.orders.orderlist[index].giftflag = 2;
            	 $scope.orders.orderlist[index].goodsmoney = 0;
            	 $scope.orders.orderlist[index].dealingprice = 0;
            	 $scope.orders.orderlist[index].discountrate = 100;
         	};
             
             
             //获取商品信息
             $scope.querygoodssku=function(item){
                if($scope.supplier == undefined || $scope.supplier == ""){
                	$.jBox.tip('请选择总部公司', 'warning');
                }
             	var param = {
         			pagenum:1,
         			pagesize:550,
         			onlineflag : 1,
         			companyid:$scope.supplier.companyid
             	};
             	
                 $http({
                     method : 'POST',
                     url : "/jsbweb/enterprise/baseline/goods/getExternal.do",
                     data : $.param({data:angular.toJson(param)}),
                     headers : {
                         'Content-Type' : 'application/x-www-form-urlencoded'
                     }
                 }).success(function(data) {
                     if(data.ret==0){
                         $scope.goodsskus = data;
                         console.info(data);
                     }
                     if(data.ret==10){
                         $.jBox.tip("请先登录", 'warning');
                     }
                 });
             };
             
             
             //初始方法
             $scope.init();
             //获取当前年月日
             $scope.getCurrentTime = function(){
            	 var date = new Date();
        	     var seperator1 = "-";
        	     var month = date.getMonth() + 1;
        	     var strDate = date.getDate();
        	     if (month >= 1 && month <= 9) {
        	         month = "0" + month;
        	     }
        	     if (strDate >= 0 && strDate <= 9) {
        	         strDate = "0" + strDate;
        	     }
        	     var currentTime = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        	     return currentTime;
             };
             //手工开单
             $scope.submit = function() {
            	 if($scope.orders.deliverydate != null || $scope.orders.deliverydate != ""){
                     if($scope.orders.deliverydate < $scope.getCurrentTime()){
                    	 $.jBox.tip('发货时间不能晚于当天', 'warning');
                    	 return;
                     }
                 }
                 for (var i = 0; i < $scope.orders.orderlist.length; i++) {
                     if ($scope.orders.orderlist[i].goodsid == undefined) {
                         $scope.orders.orderlist.splice(i, 1);
                         i--;
                     }
                 }
                 if ($scope.orders.orderlist.length == undefined || $scope.orders.orderlist.length <= 0) {
                     $.jBox.tip('订单明细不能为空', 'warning');
                     return ;
                 }
                 
                 //新增操作
                 
                 if($scope.orders.orderid == undefined) {
                	 if($scope.supplier == undefined || $scope.supplier == ""){
                         $.jBox.tip('客户不能为空', 'warning');
                         return ; 
                	 }
                	 if($scope.receiveData.addressItem == undefined){
                		 $.jBox.tip('请选择地址', 'warning');
                         return ;
                	 }
                	 if($scope.receiveData.addressItem.addressmanageid == undefined || $scope.receiveData.addressItem.addressmanageid == ''){
                         $.jBox.tip('请选择地址', 'warning');
                         return ; 
                	 }
                	 $scope.orders.supplierid = $scope.supplier.companyid;
                	 $scope.orders.supplierstationid = $scope.supplier.stationid;
                	 $scope.orders.buyername = $scope.receiveData.addressItem.contactname;
                	 
                     //地址
                     var orderaddress = {};
                     orderaddress = $scope.receiveData.addressItem;
                     orderaddress.companyid = $scope.supplier.companyid;
                     orderaddress.companyname = $scope.supplier.companyname;
                     $scope.orders.orderaddress = orderaddress;
                     
	                 var data = {data: angular.toJson($scope.orders)};
	                 $http({
	                     method : 'POST',
	                     url : '/jsbweb/enterprise/headquartersorders/addHeadQuartersOrders.do',
	                     data : $.param(data),
	                     headers : {
	                         'Content-Type' : 'application/x-www-form-urlencoded'
	                     }
	                 }).success(function(data){
	                     
	                     if(data.ret == 0) {
	                         $.jBox.tip('采购开单成功,跳转至详情页', 'success');
	                         
	                         $state.go("check",{ordernum:$scope.orders.ordernum});
	                     } 
	                     else if(data.ret == 20012){
	                    	 
	                    	 $.jBox.tip('订单号已存在' , 'warning');
	                     }
	                     else {
	                         $.jBox.tip('采购开单失败' , 'warning');
	                     }
	
	                 }).error(function(rep){
	                     $.jBox.tip('采购开单失败', 'warning');
	                 });
          
             }	 
         };
             
       //在datas中查找key为value的对象
     	$scope.findById = function findById(datas, key,value) {
     		if(datas == null){
     			return null;
     		}
             for (var i = 0; i < datas.length; i++) {
                 if (datas[i][key] == value) return datas[i];
             }
             return null;
         };
             
}])
.controller('OrdersAddressManageController',['$state','$scope','$rootScope','$http','$timeout','OrdersBaseService','$alert','commodityService',
function($state,$scope,$rootScope,$http,$timeout,OrdersBaseService,$alert,commodityService){
	
    
  //获取省份信息
	$scope.getProvince = function(){
		commodityService.httpGet(commodityService.getDistrictUrl(),function(resp){
			var newObject = {
					provinceid:0,
					provincename:'--请选择省份--'
			};
	        $scope.provinceList = resp.data.rows;
	        $scope.provinceList.push(newObject);
	    });
	};
	//获取城市信息
	$scope.getArea = function(){
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {
					cityid:0,
					cityname:'--请选择城市--'
			};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
			//
			$scope.receiveData.cityid = 0;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		          "&cityid="+$scope.receiveData.cityid;
		commodityService.httpGet(url,function(resp){
			var newObject = {
					areaid:0,
					areaname:'--请选择区县--'
			};
	        $scope.districtList = resp.data.rows;
	        $scope.districtList.push(newObject);
	        $scope.receiveData.areaid = 0;
	    });
	};
	$scope.getProvince();
	$scope.getArea();
	$scope.getDistrict();
	
	//查询收发货地址
	$scope.getAddressmanage = function(){
		var params = {};
		params.pagesize = 20;
		params.pagenum = 1;
		params.addresstype = 1;
		OrdersBaseService.httpPost(OrdersBaseService.getAddressManage(),params,function(resp){
			if(resp.ret == 0){
				$scope.receiveData.dataList = resp.data.rows;
				//不显示编辑修改功能
				angular.forEach($scope.receiveData.dataList,function(data,index,array){
					data.editDeleteShow = false;
				});
				//默认选中第一个
				if($scope.receiveData.dataList.length != 0){
					$scope.addressClick($scope.receiveData.dataList[0]);
					$scope.receiveData.dataList[0].receiveData = true;
				}
			}else if(resp.ret == 10){
				
				$.jBox.tip("请重新登录!", 'warning');
			}else{
				
				$.jBox.tip("查询收发货地址失败", 'warning');
			}
		});
	};
	$scope.getAddressmanage();
	
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
	
	//点击选择新地址
	$scope.newAddressClick = function(){
		//不显示编辑修改功能
		angular.forEach($scope.receiveData.dataList,function(data,index,array){
			data.editDeleteShow = false;
		});
		//添加新地址标志
		$scope.addressModifyAddFlag = 'add';
		//显示地址管理模态界面
		$scope.receiveData.modalShow = true;
		//清空所选地址
		$scope.orders.orderaddress = {};
		$scope.receiveData.addressItemShow = false;
		console.log($scope.receiveData.newReceiveItem);
	};
	
}]).controller('ordersPaymentController',['$state','$scope','$rootScope','$http','OrdersBaseService','$alert','$timeout',
function($state,$scope,$rootScope,$http,OrdersBaseService,$alert,$timeout){
	console.info(OrdersBaseService.getPayData());
	$scope.paramsData = {};
	$scope.paramsData.prepayWallet = {};
	$scope.paramsData = OrdersBaseService.getPayData();
	$scope.paramsData.prepaywalletamount = parseFloat($scope.paramsData.paymoney);
	//$scope.paramsData.paymentType = true;
	//默认是预付款支付方式
	$scope.paramsData.paymentType = 2;
	$scope.returnPurchaseOrders = function(){
		$state.go("entry");
	};
	$scope.payIng = function(){
		$scope.payButtonText = "支付中...";
		$scope.payButtonFlag = true;
	};
	$scope.paid = function(){
		$scope.payButtonText = "确认支付";
		$scope.payButtonFlag = false;
	};
	$scope.paid();
	//预付款账户查询
	$scope.getPrepayWallet = function(){
		OrdersBaseService.httpPost(OrdersBaseService.getprepaywallet(),{data : angular.toJson({})},function(resp){
			console.log(resp);
			if(resp.ret == 0){
				$scope.paramsData.prepayWallet = resp.data.rows[0];
				var balance = parseFloat($scope.paramsData.prepayWallet.usablebalance);
				$scope.paramsData.prepayWallet.usablebalance = balance.toFixed(2);
			}else if(resp.ret == 10){
				$.jBox.tip("请重新登录", 'warning');
			}
		}); 
	};
	$scope.prepaywallet = function() {
		$scope.getPrepayWallet();
	};
	//首次查询
	$scope.prepaywallet();
    //确认支付
	$scope.payPurchaseOrders = function(){
		if($scope.paramsData.paymentType == 1) {
			//请求mpost是所带参数
			var staData = {
				action : 4,
				relationnumber : $scope.paramsData.ordernum,
				btname: "J-ME31-067282",
				//支付待付金额
				money : $scope.paramsData.paymoney
			};
			console.log(staData);
			$.ajax({
				url:"http://127.0.0.1:9876",
				dataType:'jsonp',
				async:false,
				jsonp:'callback',
				data:staData,
				success:function(result) {
					console.log(result);
					if(result.ret==0){
						$scope.iconFlag = "";
						$.jBox.tip("支付成功", 'warning');
					}else{
						$scope.iconFlag = "";
						$.jBox.tip("支付失败，请稍后重试", 'warning');
					}
					//支付成功后更新订单状态
					var params = {};
					params.orderid = $scope.paramsData.orderid;
					params.ordernum = $scope.paramsData.ordernum;
					params.paystate = 3;
					OrdersBaseService.httpPost(OrdersBaseService.paidOrders(),params,function(resp){
						console.info(resp);
						if(resp.ret == 0){
							$.jBox.tip("订单状态已更新为已支付", 'warning');
						}else{
							$.jBox.tip("订单状态更新异常", 'warning');
						}
					});
					$timeout(function(){
	        	    	$state.go("getHeadQuartersOrders");
	        	    },600);
				},
				error:function(err){
					console.log(err);
					$scope.iconFlag = "";
					$.jBox.tip("获取设备信息失败，请稍后重试", 'warning');
				},
				timeout:10000
			});
		}else if ($scope.paramsData.paymentType == 2){
			$scope.payIng();
			if(!$scope.regularPrepay($scope.paramsData.prepaywalletamount)){
				$scope.paid();
				return ;
			}
            //预付款支付
			var params = {};
			params.supplierid = $scope.paramsData.supplierid;
			params.supplierstationid = $scope.paramsData.supplierstationid;
			params.orderid = $scope.paramsData.orderid;
			params.ordernum = $scope.paramsData.ordernum;
			params.walletid = $scope.paramsData.prepayWallet.walletid;
			params.walletno = $scope.paramsData.prepayWallet.walletno;
			//支付金额
			params.amount = $scope.paramsData.prepaywalletamount;
			OrdersBaseService.httpPost(OrdersBaseService.payPrepaywallet(),{data:angular.toJson(params)},function(resp){
				if(resp.ret == 0){
					$.jBox.tip("支付成功,将跳转到订单详情页", 'warning');
					$state.go("check",{ordernum:$scope.paramsData.ordernum});
				}else if(resp.ret == 10){
					$.jBox.tip("请重新登录", 'warning');
				}else{
					$.jBox.tip("支付失败"+resp.message, 'warning');
				}
				$scope.paid();
			});
		}
	};
	//验证预付款金额是否合法
	$scope.regularPrepay = function(num){
		//var reg = new RegExp("^\\d+(\\.\\d+)?$");
		/*if(!reg.test(num)){
			$.jBox.tip("支付金额必须为数字,且只能有两位小数", 'warning');
		    return false;
		}else */
		if(parseFloat(num) > parseFloat($scope.paramsData.prepayWallet.usablebalance)){
			$.jBox.tip("支付金额不能大于账户余额!", 'warning');
		    return false;
		}else if(num < 0){
			$.jBox.tip("支付金额不能小于0!", 'warning');
			return false;
		}else{
			return true;
		}
	};
	//订单号生成条形码
	$("#bcTarget").empty().barcode($scope.paramsData.ordernum, "code128",{barWidth:1, barHeight:30,showHRI:false});
}]).controller('OrdersAddressManageController',['OrdersBaseService','$state','$scope','$rootScope','$http','$alert','$timeout',
function(OrdersBaseService,$state,$scope,$rootScope,$http,$alert,$timeout){
	
	//获取省份信息
	$scope.getProvince = function(){
		OrdersBaseService.httpGet(OrdersBaseService.getDistrictUrl(),function(resp){
			var newObject = {
					provinceid:0,
					provincename:'--请选择省份--'
			};
	        $scope.provinceList = resp.data.rows;
	        $scope.provinceList.push(newObject);
	    });
	};
	//获取城市信息
	$scope.getArea = function(){
		OrdersBaseService.httpGet(OrdersBaseService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {
					cityid:0,
					cityname:'--请选择城市--'
			};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
			//
			$scope.receiveData.cityid = 0;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = OrdersBaseService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		          "&cityid="+$scope.receiveData.cityid;
		OrdersBaseService.httpGet(url,function(resp){
			var newObject = {
					areaid:0,
					areaname:'--请选择区县--'
			};
	        $scope.districtList = resp.data.rows;
	        $scope.districtList.push(newObject);
	        $scope.receiveData.areaid = 0;
	    });
	};
	$scope.getProvince();
	$scope.getArea();
	$scope.getDistrict();
	//验证收货人信息输入是否合法
    $scope.testPurchaseOrders = function(){
    	if(!OrdersBaseService.testPhoneNum($scope.receiveData.mobile)){
    		$.jBox.tip("手机号码输入不合法", 'warning');
    	    return false;
    	}else if ($scope.receiveData.contactname == "" || $scope.receiveData.contactname == null){
    		$.jBox.tip("收货人不能为空", 'warning');
    		return false;
    	}else if($scope.receiveData.provinceid == undefined || $scope.receiveData.provinceid == 0){
    		$.jBox.tip("请选择省份", 'warning');
    		return false;
    	}else if($scope.receiveData.cityid == undefined || $scope.receiveData.cityid == 0){
    		$.jBox.tip("请选择城市", 'warning');
    		return false;
    	}else if($scope.receiveData.areaid == undefined || $scope.receiveData.areaid == 0){
    		$.jBox.tip("请选择区县", 'warning');
    		return false;
    	}else if($scope.receiveData.address == null || $scope.receiveData.address == ""){
    		$.jBox.tip("地址不能为空", 'warning');
    		return false;
    	}else{
    		return true;
    	}
    };
	//保存收-发货地址
	$scope.saveAddressManage = function(){
		if(!$scope.testPurchaseOrders()){
			return ;
		};
		if($scope.addressModifyAddFlag == 'add'){
			var params = {}; 
			params.addresstype = 1;  //1为收货地址
			params.contactname = $scope.receiveData.contactname;
			params.mobile = $scope.receiveData.mobile;
			params.phonepostcode = $scope.receiveData.phonepostcode;
			params.phone = $scope.receiveData.phone;
			params.phonesubcode = $scope.receiveData.phonesubcode;
			params.provinceid = $scope.receiveData.provinceid;
			params.cityid = $scope.receiveData.cityid;
			params.areaid = $scope.receiveData.areaid;
			params.address = $scope.receiveData.address;
			params.postcode = $scope.receiveData.postcode;
			params.remark = $scope.receiveData.remark;
			console.log(params);
			OrdersBaseService.httpPost(OrdersBaseService.addAddressManage(),params,function(resp){
				console.info(resp);
				$scope.getAddressmanage();
			});
		}else if($scope.addressModifyAddFlag == 'modify'){
			var params = {}; 
			params.addressmanageid = $scope.receiveData.addressmanageid;
			params.contactname = $scope.receiveData.contactname;
			params.mobile = $scope.receiveData.mobile;
			params.phonepostcode = $scope.receiveData.phonepostcode;
			params.phone = $scope.receiveData.phone;
			params.phonesubcode = $scope.receiveData.phonesubcode;
			params.provinceid = $scope.receiveData.provinceid;
			params.cityid = $scope.receiveData.cityid;
			params.areaid = $scope.receiveData.areaid;
			params.address = $scope.receiveData.address;
			params.postcode = $scope.receiveData.postcode;
			params.remark = $scope.receiveData.remark;
			console.log(params);
			OrdersBaseService.httpPost(OrdersBaseService.modifyAddressManage(),params,function(resp){
				console.info(resp);
				$scope.getAddressmanage();
			});
		}


	};
	//查询收发货地址
	$scope.getAddressmanage = function(){
		var params = {};
		params.pagesize = 20;
		params.pagenum = 1;
		params.addresstype = 1;
		OrdersBaseService.httpPost(OrdersBaseService.getAddressManage(),params,function(resp){
			if(resp.ret == 0){
				$scope.receiveData.dataList = resp.data.rows;
				//不显示编辑修改功能
				angular.forEach($scope.receiveData.dataList,function(data,index,array){
					data.editDeleteShow = false;
				});
				//默认选中第一个
				if($scope.receiveData.dataList.length != 0){
					$scope.addressClick($scope.receiveData.dataList[0]);
					$scope.receiveData.dataList[0].receiveData = true;
				}
			}else if(resp.ret == 10){
				$.jBox.tip("请重新登录", 'warning');
			}else{
				$.jBox.tip("查询收发货地址失败"+resp.message, 'warning');
			}
			console.log($scope.receiveData);
		});
	};
	$scope.getAddressmanage();
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
		$scope.receiveData.addressItem = receiveItem;
		console.log($scope.receiveData.addressItem);
	};
	$scope.newAddressClick = function(){
		//不显示编辑修改功能
		angular.forEach($scope.receiveData.dataList,function(data,index,array){
			data.editDeleteShow = false;
		});
		//添加新地址标志
		$scope.addressModifyAddFlag = 'add';
		//显示地址管理模态界面
		$scope.receiveData.modalShow = true;
		//清空所选地址
		$scope.receiveData.addressItem = {};
		$scope.receiveData.addressItemShow = false;
		console.log($scope.receiveData.newReceiveItem);
	};
	//弹出地址管理模态窗口
	$scope.chooseAddress = function(){
		if($scope.receiveData.addressItem.addressmanageid != undefined){
			$("#addressManager").modal("hide");
		}else{
			$.jBox.tip("请选择地址", 'warning');
		}
	};
	//删除地址
	$scope.deleteAddress = function(receiveItem){
		console.info(receiveItem);	
		var params = {};
		params.addressmanageid = receiveItem.addressmanageid;
		OrdersBaseService.httpPost(OrdersBaseService.deleteAddressManage(),params,function(resp){
			if(resp.ret == 0){
				$.jBox.tip("地址删除成功", 'warning');
				$scope.getAddressmanage();
			}else if(resp.ret == 10){
				$.jBox.tip("请重新登录", 'warning');
			}else{
				$.jBox.tip("删除异常"+resp.message, 'warning');
			}
		});
	};
	//修改地址
	$scope.modifyAddress = function(receiveItem){
		$scope.addressModifyAddFlag = 'modify';
		$scope.receiveData.addressmanageid = receiveItem.addressmanageid;
		$scope.receiveData.contactname = receiveItem.contactname;
		$scope.receiveData.mobile = receiveItem.mobile; 
		$scope.receiveData.phone = receiveItem.phone;
		$scope.receiveData.phonesubcode = receiveItem.phonesubcode;
		$scope.receiveData.postcode = receiveItem.postcode;
		$scope.receiveData.phonepostcode = receiveItem.phonepostcode;
		$scope.receiveData.provinceid = receiveItem.provinceid;
		$scope.receiveData.cityid = receiveItem.cityid;
		$scope.receiveData.areaid = receiveItem.areaid;
		$scope.receiveData.address = receiveItem.address;
		$scope.receiveData.remark = receiveItem.remark;
		$scope.receiveData.modalShow = true;
		console.log($scope.receiveData);
		OrdersBaseService.httpGet(OrdersBaseService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {cityid:0,cityname:'--请选择城市--'};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
	    });
		var url = OrdersBaseService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		        "&cityid="+$scope.receiveData.cityid;
		OrdersBaseService.httpGet(url,function(resp){
			var newObject = {areaid:0,areaname:'--请选择区县--'};
		    $scope.districtList = resp.data.rows;
		    $scope.districtList.push(newObject);
		});
	};
}]);

