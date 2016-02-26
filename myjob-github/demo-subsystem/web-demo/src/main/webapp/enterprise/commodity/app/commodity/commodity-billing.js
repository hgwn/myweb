angular.module('masgetWebApp.commodity').
controller('commodityBillingController',['$scope','$rootScope','$http','$cookieStore','commodityService','$alert','$timeout','$state',
function($scope,$rootScope,$http,$cookieStore,commodityService,$alert,$timeout,$state){
//    var myDate = new Date();
    $scope.dataTime = curentTime();
    console.info($scope.dataTime);
    $scope.goodscart = $rootScope.rootGoodscartArr;
    $scope.countPrice = $rootScope.rootCountCartsPrice;
    //供应商id
    $scope.supplierid = $rootScope.rootCompanyid;
    //获取采购订单号
	commodityService.httpGet(commodityService.getOrderNumUrl(),function(resp){
        $scope.ordernum = resp.ordernum;
    });
	//获取省份信息
	commodityService.httpGet(commodityService.getDistrictUrl(),function(resp){
        $scope.provinceList = resp.data.rows;
        
    });
	//获取城市信息
	$scope.getArea = function(){
		commodityService.httpGet(commodityService.getDistrictUrl()+"?provinceid="+$scope.buyerprovinceid,function(resp){
	        $scope.areaList = resp.data.rows;
	    });
	};
	//获取区、县信息
	$scope.getDistrict = function(){
		var url = commodityService.getDistrictUrl()+"?provinceid="+$scope.buyerprovinceid+
		          "&cityid="+$scope.buyercityid;
		commodityService.httpGet(url,function(resp){
	        $scope.districtList = resp.data.rows;
	        
	    });
	};
	//默认不显示支付方式,预付款为零,默认结算方式为到付、月结
	$scope.paymenttypeShowFlag = false;
	
	$scope.goodsdeposit = 0;
	$scope.settlementTypeList = [{id:2,name:"到付"},{id:4,name:"月结"}];
	var cacheGoodsDeposit = 0 ;
	$scope.$watch('goodsdeposit',function(){
        if($scope.goodsdeposit==$scope.countPrice){
            $scope.settlementTypeList = [{id:1,name:"现付"}];
            $scope.paymenttypeShowFlag = true;
        }else if($scope.goodsdeposit>0&&$scope.goodsdeposit<$scope.countPrice){
        	$scope.settlementTypeList = [{id:2,name:"到付"},{id:4,name:"月结"}];
        	$scope.paymenttypeShowFlag = true;
        }else if($scope.goodsdeposit==0||$scope.goodsdeposit==null){
        	$scope.paymenttypeShowFlag = false;
        }

        if(!($scope.goodsdeposit<0||$scope.goodsdeposit==null||$scope.goodsdeposit>$scope.countPrice)){
        	$scope.balancePayment = parseFloat($scope.countPrice)-parseFloat($scope.goodsdeposit);
        }
    });
	//处理小于零或大于尾款的情况
	$scope.depositBlur = function(){
        if(!($scope.goodsdeposit>0||$scope.goodsdeposit==0)){
        	$scope.goodsdeposit = 0;
			$alert({title: '提示：', content: '预付款不能小于零!', placement: 'masget-top',type: 'info', duration:1, show: true});       	
        }else if($scope.goodsdeposit<$scope.countPrice){
        	cacheGoodsDeposit = $scope.goodsdeposit;
        }else if($scope.goodsdeposit>$scope.countPrice){
        	$scope.goodsdeposit = cacheGoodsDeposit;
        	$alert({title: '提示：', content: '预付款不能大于尾款!', placement: 'masget-top',type: 'info', duration:1, show: true});
        }
        $scope.balancePayment = parseFloat($scope.countPrice)-parseFloat($scope.goodsdeposit);
	};
    //提交订单
	$scope.submitOrders = function(){
        $scope.ordersParams={};
        $scope.ordersParams.ordernum = $scope.ordernum;
        $scope.ordersParams.supplierid = $scope.supplierid;
        $scope.ordersParams.supplierstationid = 0;
        $scope.ordersParams.buyername = $scope.buyername;
        $scope.ordersParams.buyerprovinceid = $scope.buyerprovinceid;
        $scope.ordersParams.buyercityid = $scope.buyercityid;
        $scope.ordersParams.buyerareaid = $scope.buyerareaid;
        $scope.ordersParams.buyeraddress = $scope.buyeraddress;
        $scope.ordersParams.buyerphone = $scope.buyerphone;
        $scope.ordersParams.goodsdeposit = $scope.goodsdeposit;
        $scope.ordersParams.deliveryflag = $scope.deliveryflag;
        $scope.ordersParams.settlementtypeid = $scope.settlementtypeid;
        $scope.ordersParams.paymenttype = $scope.paymenttype;
        $scope.ordersParams.goodscart = angular.toJson($scope.goodscart);
        $scope.ordersParams.remark = $scope.remark;
        
        $http({
            method : 'POST',
            url : commodityService.getAddpurchaseorderbycart(),
            data : $.param($scope.ordersParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data) {
        	if(data.ret==0){
        		$alert({title: '提示：', content: '生成订单成功!', placement: 'masget-top',type: 'info', duration:1, show: true});
        	    $timeout(function(){
        	    	window.history.go(-2);
        	    },1000);
        	}else{
        		$alert({title: '提示：', content: '添加订单失败!', placement: 'masget-top',type: 'info', duration:1, show: true});
        	}
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