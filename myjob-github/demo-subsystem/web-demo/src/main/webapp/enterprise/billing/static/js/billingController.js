var billingApp = angular.module('masgetWebApp.enterprise.billing');
billingApp.controller("baseBillingCtr", [ '$scope', '$http', "$stateParams",
		"$state", "$timeout",
		function($scope, $http, $stateParams, $state, $timeout) {
		
		//省市县联动
		$http
			.get("/jsbweb/enterprise/billing/commonUtils.do")
					.success(function(data) {
						$scope.addressData = data;
						console.log($scope.addressData);
					});
	
} ]);