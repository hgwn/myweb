purchaseOrdersApp.
controller('purchaseOrdersBillingController',['$state','$scope','$rootScope','$http','commodityService','regularValidationService','$alert','$timeout','purchaseOrdersService',
function($state,$scope,$rootScope,$http,commodityService,regularValidationService,$alert,$timeout,purchaseOrdersService){
    $scope.dataTime = curentTime();
    $scope.goodscart = $rootScope.rootGoodscartArr;
    $scope.countPrice = $rootScope.rootCountCartsPrice;
    $scope.countNumber = $rootScope.rootCountCartsNumber;
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
    //供应商
    $scope.supplier = $rootScope.rootSupplier;
    //获取采购订单号
	commodityService.httpGet(commodityService.getOrderNumUrl(),function(resp){
        $scope.ordernum = resp.ordernum;
    });
	
    //提交订单
	$scope.submitOrders = function(){
		if($scope.receiveData.addressItem.addressmanageid == undefined){
			$alert({title: '提示：', content: '请选择收货人信息!', placement: 'masget-top',type: 'info', duration:1, show: true});
			return ;
		}
        $scope.ordersParams={};
        $scope.ordersParams.purchaseordernum = $scope.ordernum;
        $scope.ordersParams.ordersource = 1;
        $scope.ordersParams.contactname = $scope.receiveData.addressItem.contactname;
        $scope.ordersParams.mobile = $scope.receiveData.addressItem.mobile;
        $scope.ordersParams.provinceid = $scope.receiveData.addressItem.provinceid;
        $scope.ordersParams.cityid = $scope.receiveData.addressItem.cityid;
        $scope.ordersParams.areaid = $scope.receiveData.addressItem.areaid;
        $scope.ordersParams.address = $scope.receiveData.addressItem.address;
        $scope.ordersParams.remark = $scope.receiveData.addressItem.remark;
        $scope.ordersParams.supplierid = $scope.supplier.companyid;
        $scope.ordersParams.supplierstationid = $scope.supplier.stationid;
        $scope.ordersParams.totgoodsqty = $scope.countNumber;
        $scope.ordersParams.totgoodsmoney = $scope.countPrice;
        $scope.ordersParams.discountrate = 0;
        $scope.ordersParams.discountmoney = 0;
        //订单来源 1-手工开单
        $scope.ordersParams.ordersource = 1;
        
        //地址
        var orderaddress = {};
        orderaddress = $scope.receiveData.addressItem;
        orderaddress.companyid = $scope.supplier.companyid;
        orderaddress.companyname = $scope.supplier.companyname;
        
        $scope.ordersParams.orderaddress = orderaddress;
        angular.forEach($scope.goodscart,function(data,index,array){
        	$scope.goodscart[index].goodsqty = $scope.goodscart[index].goodsnumber;
        	$scope.goodscart[index].dealingprice = $scope.goodscart[index].shopprice;
        	$scope.goodscart[index].goodsmoney = $scope.goodscart[index].dealingprice;
        });
        $scope.ordersParams.purchaseorderlist = $scope.goodscart;
        
        $http({
            method : 'POST',
            url : '/jsbweb/enterprise/purchaseorders/addPurchaseorders.do',
            data : $.param({data : angular.toJson($scope.ordersParams)}),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	if(data.ret == 0){
        		$alert({title: '提示：', content: '生成订单成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
        		purchaseOrdersService.setPayData($scope.ordersParams);
        		$timeout(function(){
        	    	$state.go("purchaseordersPayment");
        	    },1000);
        	}else{
        		$alert({title: '提示：', content: '添加订单失败,'+data.message+"!", placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
        });
	};	

}])
.controller('purchaseordersPaymentController',['$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','$timeout',
function($state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,$timeout){
	console.info(purchaseOrdersService.getPayData());
	console.info("1001");
	$scope.paramsData = {};
	$scope.paramsData = purchaseOrdersService.getPayData();
	$scope.paramsData.paymentType = true;
	
	$scope.returnPurchaseOrders = function(){
		$state.go("getPurchaseorders");
	};
    //支付
	$scope.payPurchaseOrders = function(){

		//请求mpost是所带参数
		var staData = {
			action : 4,
			relationnumber : $scope.paramsData.purchaseordernum,
			btname: "J-ME31-067282",
			money : $scope.paramsData.totgoodsmoney
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
					$alert({title: '提示：', content: '支付成功', placement: 'masget-top',duration:3, type: 'info', show: true});
					//支付成功后更新订单状态
					var params = {};
					params.orderid = $scope.paramsData.purchaseorderid;
					params.ordernum = $scope.paramsData.purchaseordernum;
					params.paystate = 3;
					purchaseOrdersService.httpPost(purchaseOrdersService.paidOrders(),params,function(resp){
						console.info(resp);
						if(resp.ret == 0){
							$alert({title: '提示：', content: '订单状态已更新为已支付!', placement: 'masget-top',duration:3, type: 'info', show: true});
						}else{
							$alert({title: '提示：', content: '订单状态更新异常，' + resp.message, placement: 'masget-top',duration:3, type: 'info', show: true});
						}
					});
				}else{
					$scope.iconFlag = "";
					$alert({title: '提示：', content: '支付失败，请稍后重试', placement: 'masget-top',duration:3, type: 'info', show: true});
				}
			},
			error:function(err){
				console.log(err);
				$scope.iconFlag = "";
				$alert({title: '提示：', content: '获取设备信息失败，请稍后重试', placement: 'masget-top',duration:3, type: 'info', show: true});
			},
			timeout:10000
		});		
	};
}]).
controller('purchaseOrdersAddressManageController',['utils','commodityService','$state','$scope','$rootScope','$http','purchaseOrdersService','regularValidationService','$alert','$timeout',
function(utils,commodityService,$state,$scope,$rootScope,$http,purchaseOrdersService,regularValidationService,$alert,$timeout){
	
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
	//验证收货人信息输入是否合法
    $scope.testPurchaseOrders = function(){
    	if(!regularValidationService.testPhoneNum($scope.receiveData.mobile)){
    		$alert({title: '提示：', content: '手机号码输入不合法!', placement: 'masget-top',type: 'info', duration:2, show: true});
    	    return false;
    	}else if ($scope.receiveData.contactname == "" || $scope.receiveData.contactname == null){
    		$alert({title: '提示：', content: '收货人不能为空!', placement: 'masget-top',type: 'info', duration:2, show: true});
    	    return false;
    	}else if($scope.receiveData.provinceid == undefined || $scope.receiveData.provinceid == 0){
    		$alert({title: '提示：', content: '请选择省份!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else if($scope.receiveData.cityid == undefined || $scope.receiveData.cityid == 0){
    		$alert({title: '提示：', content: '请选择城市!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else if($scope.receiveData.areaid == undefined || $scope.receiveData.areaid == 0){
    		$alert({title: '提示：', content: '请选择区县!', placement: 'masget-top',type: 'info', duration:2, show: true});
    		return false;
    	}else if($scope.receiveData.address == null || $scope.receiveData.address == ""){
    		$alert({title: '提示：', content: '地址不能为空!', placement: 'masget-top',type: 'info', duration:2, show: true});
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
			purchaseOrdersService.httpPost(purchaseOrdersService.addAddressManage(),params,function(resp){
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
			purchaseOrdersService.httpPost(purchaseOrdersService.modifyAddressManage(),params,function(resp){
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
		purchaseOrdersService.httpPost(purchaseOrdersService.getAddressManage(),params,function(resp){
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
				$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
			}else{
				$alert({title: '提示：', content: '查询收发货地址失败,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
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
			$alert({title: '提示：', content: '请选择地址!', placement: 'masget-top',type: 'info', duration:2, show: true});
		}
	};
	//删除地址
	$scope.deleteAddress = function(receiveItem){
		console.info(receiveItem);	
		var params = {};
		params.addressmanageid = receiveItem.addressmanageid;
		purchaseOrdersService.httpPost(purchaseOrdersService.deleteAddressManage(),params,function(resp){
			if(resp.ret == 0){
				$alert({title: '提示：', content: '地址删除成功!', placement: 'masget-top',type: 'info', duration:2, show: true});
				$scope.getAddressmanage();
			}else if(resp.ret == 10){
				$alert({title: '提示：', content: '请重新登录!', placement: 'masget-top',type: 'info', duration:2, show: true});
			}else{
				$alert({title: '提示：', content: '删除异常,'+resp.message, placement: 'masget-top',type: 'info', duration:2, show: true});
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
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid,function(resp){
			var newObject = {cityid:0,cityname:'--请选择城市--'};
			$scope.areaList = resp.data.rows;
			$scope.areaList.push(newObject);
	    });
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.receiveData.provinceid+
		        "&cityid="+$scope.receiveData.cityid;
		commodityService.httpGet(url,function(resp){
			var newObject = {areaid:0,areaname:'--请选择区县--'};
		    $scope.districtList = resp.data.rows;
		    $scope.districtList.push(newObject);
		});
	};
}]);
//获取系统时间
function curentTime(){
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒

    var clock = year + "-";

    if(month < 10)
        clock += "0";

    clock += month + "-";

    if(day < 10)
        clock += "0";

    clock += day + " ";
    //获取时分秒
//    if(hh < 10)
//        clock += "0";
//
//    clock += hh + ":";
//    if (mm < 10) clock += '0';
//    clock += mm + ":";
//
//    if (ss < 10) clock += '0';
//    clock += ss;
    return(clock);
}