/**
 * 添加采购订单主控制器
 */
entPurchaseOrdersModule.controller("addPurchaseorderMainController",
	['$scope', '$rootScope', '$http', "$stateParams", "$state", "$window", "$timeout",
	function($scope, $rootScope, $http, $stateParams, $state, $window, $timeout) {
		$scope.baseData = {
			addType:1
		};
	}
]);
/**
 * 添加采购订单头部
 */
entPurchaseOrdersModule.controller("addPurchaseorderHeadController",
	['$scope', '$rootScope', '$http', "$stateParams", "$state", "$window", "$timeout",
	function($scope, $rootScope, $http, $stateParams, $state, $window, $timeout) {

	}
]);
/**
 * 新增采购订单通过供应商店铺商品
 */
entPurchaseOrdersModule.controller("addPurchaseorderByGoodsController",
	['$scope', '$rootScope', '$http', "$stateParams", "$state", "$window", "$timeout",
	function($scope, $rootScope, $http, $stateParams, $state, $window, $timeout) {

	}
]);
/**
 * 新增采购订单通过历史采购记录
 */
entPurchaseOrdersModule.controller("addPurchaseorderByHistoryController",
	['$scope', '$rootScope', '$http', "$stateParams", "$state", "$window", "$timeout",
	function($scope, $rootScope, $http, $stateParams, $state, $window, $timeout) {

	}
]);
