/**
 * 
 */
var entOrdersModule = angular.module('masgetWebApp.com.orders',[
    "ui.grid",
    'ui.grid.pagination',
    'ui.router',
    "util.comboxtable",
    "orders.service",
    'mgcrea.ngStrap',
    'ui.grid.expandable',
    "ngMessages",
    "OrdersBase.Service",
    "commodity.Service",
    'masgetweb.util.Service',
    "purchaseOrders.Service",
	'ui.grid.selection',
    'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'ui.grid.moveColumns'
    
]);
//,
//'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav'
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
entOrdersModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
    $rootScope.threePayDate = {};
    $rootScope.threePay = function(orders){
    	$rootScope.threePayDate = orders;
    }
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entOrdersModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/add');
    $stateProvider
        .state('add', {
            url: '/add',
            views: {
                'main': {
                    templateUrl: '../orders/tpls/orders_add_list.html'
                },
                "grid@add": {
                    templateUrl: '../orders/tpls/orders_add_grid.html'
                },
                "address@add":{
                	templateUrl: '../orders/tpls/orders.addressmanage.html',
            		controller : 'OrdersAddressManageController'
                }
            }
        })
        .state('entry', {
            url: '/entry',
            views: {
                'main': {
                    templateUrl: '../orders/tpls/orders_entry_list.html'
                },
                "grid@entry": {
                    templateUrl: '../orders/tpls/orders_entry_grid.html'
                },
                "query@entry": {
                    templateUrl: '../orders/tpls/orders_entry_query.html'
                },
                "look@entry": {
                    templateUrl: '../orders/tpls/orders_printHtml.html'
                }
            }
        })
        .state('check', {
            url: '/check/{ordernum}/{pagesize}/{pagenum}',
            views: {
                'main': {
                    //templateUrl: '../orders/tpls/orders_check_list.html',
                	templateUrl : function($stateParams){
                        console.log($stateParams);
                        return '../orders/tpls/orders_check_list.html';
                    }
                },
                "address@check":{
                	templateUrl: '../orders/tpls/orders.addressmanage.html',
                	controller : 'OrdersAddressManageController'
                },
                "modal@check":{
                	templateUrl: '../orders/tpls/modal.html',
                }
            }
        })
        .state('warehouseout', {
            url: '/warehouseout/{ordernum}/{orderid}',
            views: {
		        'main': {
		            //templateUrl: '../orders/tpls/orders_check_list.html',
		        	templateUrl : function($stateParams){
		                console.log($stateParams);
		                return '../orders/tpls/orders_warehouseout_list.html';
		            }
		        },
                'select_batchcode@warehouseout':{
                    templateUrl : '../orders/tpls/select_batchcode.html',
                    controller : 'selectBatchcodeController'
                }
            }
        })
        .state('pay', {
            url: '/pay',
            views: {
                'main': {
                    templateUrl: '../orders/tpls/orders_pay_list.html',
                    controller : 'ordersPayController'
                }
            }
        })
        .state('instalment', {
            url: '/instalment',
            views: {
                'main': {
                    templateUrl: '../orders/tpls/orders_pay_instalment.html',
                    controller : 'ordersPayController'
                }
            }
        })
})