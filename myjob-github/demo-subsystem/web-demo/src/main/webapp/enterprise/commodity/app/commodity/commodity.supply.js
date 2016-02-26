angular.module('masgetWebApp.commodity').
controller('supplyController',['$scope','$rootScope','$cacheFactory','$http','$cookieStore','commodityService','$alert','$timeout','$state',
function($scope,$rootScope,$cacheFactory,$http,$cookieStore,commodityService,$alert,$timeout,$state){
    $scope.suppliers = [];
    $scope.userLoginInfo = {
    		pagesize:15,
    		pagenum:1,
    		scenetypeid : 2,
      	    busy:false
    };
    //查询供应商列表
    $scope.supliersSearch = function(flag){
    	
    	if(flag == true)
   		{
   	   		$scope.userLoginInfo.busy = false;
   	   		$scope.userLoginInfo.pagenum = 1;
   		}
    	if ($scope.userLoginInfo.busy) return;
    	$scope.userLoginInfo.busy = true;
   	   	
        $http({
            method : 'POST',
            url : commodityService.getSuppliersGetAllUrl(),
            data : $.param($scope.userLoginInfo),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
        	if(data.ret==0){
        		$scope.userLoginInfo.busy = false;
        		if(data.data.rows.length >= 15){
        			$scope.userLoginInfo.pagenum++;
        		}else{
        			$scope.userLoginInfo.busy = true;
        		}
        		
        		if(flag){
        			$scope.suppliers = data.data.rows;
        		}else{
        			var item =  data.data.rows;
   	   	            for (var i = 0; i < item.length; i++) {
   	   	                $scope.suppliers.push(item[i]);
   	   	            }
        		}
        	}else{
        		$scope.userLoginInfo.busy = false;
        	}
        }).error(function(){
            
        });    	
    };
    //进入供应商的电子店铺
    $scope.toGoCommodityList = function(companyid){
        $rootScope.rootCompanyid = companyid;
    	$state.go("list",{path:'companyid='+companyid});
    };
}]);