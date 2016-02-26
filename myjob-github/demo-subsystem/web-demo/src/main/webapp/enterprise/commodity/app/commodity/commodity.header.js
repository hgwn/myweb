angular.module('masgetWebApp.commodity')
.controller('commodityHeadController',['$scope','$rootScope','$cacheFactory','$http','$cookieStore','commodityService','$alert','$timeout','$state',
   function($scope,$rootScope,$cacheFactory,$http,$cookieStore,commodityService,$alert,$timeout,$state){
  	    $rootScope.queryFormData = {
            pageSize:10,
      	    pageNum:1,
      	    busy:false
        };
        var companyid;
        if(typeof($rootScope.rootCompanyid)=='undefined'){
   	   	    companyid = window.location.href.split("=")[1];
   	   	    $rootScope.rootCompanyid = companyid;
   	    }else{
   	    	companyid = $rootScope.rootCompanyid;
   	    }
   	
   	    //返回店铺列表
   	    $rootScope.toSuppliersList = function (){
   	     	$state.go("supplyList");
   	    };
   	    //用于head跟list通信专用的商品list
   	    $rootScope.commodities = [];
   	    //获取商家信息
   	    commodityService.httpGet(commodityService.getMerchantUrl()+"?companyId="+companyid,function(resp){
   	        $scope.merchants = resp.data;
   	    });
   	    //上市时间标志位，默认为升序
   	    $scope.timeToMarket = "timetomarket";
   	    $scope.timeToMarketSortFlag = "asc";
   	    //价格标志位，默认为升序
   	    $scope.shopPrice = "shopprice";
   	    $scope.shopPriceSortFlag = "asc";
   	    //搜索
   	    $scope.commoditiesSearch = function(){
   	    	$rootScope.commoditiesSearch('','',true);
   	    };
   	    $rootScope.commoditiesSearch = function(oders,orderKey,flag){
   	    	$state.go("list",{path:'companyid='+companyid});
   	    	
	   	   	if(flag == true)
	   		{
	   	   		$rootScope.queryFormData.busy = false;
	   	        //提供给commodityHeadController与commodityController 分页 通信用的方法
	   	   		$rootScope.infoQueryDataFlag();
	   	   		$rootScope.queryFormData.pageNum = 1;
	   		}
	   	   	if ($rootScope.queryFormData.busy) return;
	   	   	$rootScope.queryFormData.busy = true;
	   	    $rootScope.infoQueryDataFlag();
   	   	
   	        var searchUrl = commodityService.getCommoditySearchListUrl()+
   	           "?goodsName="+encodeURIComponent($scope.commodityName)+
   	           "&companyId="+companyid+
   	           "&orders="+oders+
   	           "&orderKey="+orderKey+
   	           "&pageSize="+$rootScope.queryFormData.pageSize+
   	           "&pageNum="+$rootScope.queryFormData.pageNum;
   	        commodityService.httpGet(searchUrl,function(resp){
   	       	
   	       	if(resp.ret==0){
   	       		$rootScope.queryFormData.busy = false;
   	       	    $rootScope.infoQueryDataFlag();
   	            if(resp.data.rows.length >= 10){
   	               	$rootScope.queryFormData.pageNum++;
   	            }else{
   	               	$rootScope.queryFormData.busy = true;
   	                $rootScope.infoQueryDataFlag();
   	            }
   	            //flag为true则为点击查询或者排序按钮
   	            if(flag){
   	            	$rootScope.commodities = resp.data.rows;
   	            }else{
   	            	//判断是否刚从访问商品详细页面回来,如果是防重复添加数据
   	            	if($rootScope.commoditiesInDetailFlag == true){
   	            		$rootScope.commoditiesInDetailFlag ==false;
   	    	    		return;
   	    	    	}
   	   	            var item =  resp.data.rows;
   	   	            for (var i = 0; i < item.length; i++) {
   	   	            	$rootScope.commodities.push(item[i]);
   	   	            }
   	            }
   	       	 }else{
   	       		$rootScope.queryFormData.busy = false;
   	       	    $rootScope.infoQueryDataFlag();
   	       	 }
	       });
	       //没触发排序按钮时则清除排序箭头样式
	       if(orderKey==null){
	           $scope.removeSortClass();
	       }
   	   };
   	   //根据上市时间排序
   	   $scope.timeToMarketToggleSort = function(){
   	       if($scope.timeToMarketSortFlag=="asc"){
   	           $scope.removeSortClass();
   	           $("#timeToMarketSortClassId").addClass("glyphicon glyphicon-arrow-down");
   	           $scope.timeToMarketSortFlag="desc";
   	       }else{
   	           $scope.removeSortClass();
   	           $("#timeToMarketSortClassId").addClass("glyphicon glyphicon-arrow-up");
   	           $scope.timeToMarketSortFlag="asc";
   	       }
   	       $rootScope.commoditiesSearch($scope.timeToMarket,$scope.timeToMarketSortFlag,true);
   	   };
   	   //根据商品价格排序
   	   $scope.shopPriceToggleSort = function(){
   	       if($scope.shopPriceSortFlag=="asc"){
   	           $scope.removeSortClass();
   	           $("#shopPriceSortClassId").addClass("glyphicon glyphicon-arrow-down");
   	           $scope.shopPriceSortFlag="desc";
   	       }else{
   	           $scope.removeSortClass();
   	           $("#shopPriceSortClassId").addClass("glyphicon glyphicon-arrow-up");
   	           $scope.shopPriceSortFlag="asc";
   	       }
   	       $rootScope.commoditiesSearch($scope.shopPrice,$scope.shopPriceSortFlag,true);
   	   };
   	   //清除排序按钮的箭头图标
   	   $scope.removeSortClass = function(){
   	       $("#timeToMarketSortClassId").removeClass();
   	       $("#shopPriceSortClassId").removeClass();
   	   }; 
}]);

