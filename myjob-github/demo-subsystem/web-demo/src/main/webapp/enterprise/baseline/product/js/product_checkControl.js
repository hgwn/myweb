/**
 * Created by Administrator on 2015-10-14.
 */
entProductsModule.controller("productCheckController",
    ['$scope','$rootScope','$http',"$stateParams","$state",
        function($scope, $rootScope, $http,$stateParams,$state) {
    	$scope.formData = {};
    	$scope.goods = [];
    	
    	//商品子表
    	var temp = {};
		temp.barcode="";
		temp.action = "add";
		$scope.goods.push(temp);
	 	
	 	//初始方法
        $scope.init = function(){
        	
	        if($stateParams.goodssn != null){
	        	
	        	//查看界面的查询
	    	 	$http({
	                method : 'POST',
	                url : "/jsbweb/enterprise/baseline/product/getgoods_list.do",
	                data : $.param($stateParams),
	                headers : {
	                    'Content-Type' : 'application/x-www-form-urlencoded'
	                }
	            }).success(function(data) {
	                if(data.ret==0){
	                	
	                	$scope.formData = data.data.rows[0];
	                	
	                	//$scope.formData.thumb = "http://192.168.87.141:8080/masgetfile/1441803628484.jpg";
	                	
	                	$scope.goods[0].goodsid = $scope.formData.goodsid;
	                	$scope.goods[0].barcode = $scope.formData.barcode;
	                	$scope.goods[0].goodssn = $scope.formData.goodssn;
	                	$scope.goods[0].shopprice = $scope.formData.shopprice;
	                	$scope.goods[0].goodsspec = $scope.formData.goodsspec;
	                	$scope.goods[0].thumb = $scope.formData.thumb;
	                	$scope.goods[0].goodsspecification = $scope.formData.goodsspecification;
	                	
	                	console.log($scope.formData);
	                }else if(data.ret==10){
	                    $.jBox.tip("请先登录", 'warning');
	                }else{ 
	                    $.jBox.tip("获取数据失败", 'warning');
	                }
	            }).error(function(rep){
	                $.jBox.tip("获取数据失败", 'warning');
	            });
	        }else{
	        	//新增界面
	        	$scope.formData.edit = "新增";
	        }	
	     }
	 	//初始方法
        $scope.init();
    	
    	
    }]);