
openApiModule.controller("openApiController",
		['$scope','$http',"$stateParams","$state","$rootScope",function($scope, $http,$stateParams,$state,$rootScope) {
	//定义表单数据对象
	$scope.formData={};
	
	$scope.callApi=function(callForm){
		if(callForm.$invalid) return;
		
		$http({
			method : 'POST',
			url : "/masgetweb/openApi/call.do",
			data : $.param($scope.formData),
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).success(function(data) {
			$scope.formData.result=angular.toJson(data);
			if(data.ret==1000){
				$.jBox.tip("请先登录", 'warning');
			}
		});
		
	}
	
}]);


