//相当于整个应用程序的入口
var headQuartersOrdersApp = angular.module('masgetWebAppHeadQuartersOrdersApp', [
    //下方增加依赖模块
    'masgetWebApp.utils.service',
    'ui.router',
    'util.comboxtable',
    'util.pagination',
    'headQuartersOrders.Service',
    'orders.service',
    'commodity.Service',
    'regularValidation.Service',
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngTouch',
    'ui.grid', 
    'ui.grid.pinning',
    'ui.grid.treeView',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns',
    'ui.grid.moveColumns',
    'ui.grid.expandable',
    'ngMessages'
]);
headQuartersOrdersApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
headQuartersOrdersApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            //$urlRouterProvider.otherwise('/headQuartersOrdersAdd');
            $stateProvider.state("headQuartersOrdersAdd",{
                url:"/headQuartersOrdersAdd",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/headquartersorders.query.html',
                        controller : 'headQuartersOrdersAddController'
                    }, 
                    'goodsList@headQuartersOrdersAdd' : {
                        templateUrl : 'template/headquartersorders.goods.list.html',
                        controller : 'goodsListController'                    	
                    },
                    'viewPurchaseGoods@headQuartersOrdersAdd':{
                        templateUrl : 'template/headquartersorders.goodscart.html',
                        controller : 'purchaseGoodsModalController'                      	
                    }
                }
            })
            .state("headQuartersOrdersModify",{
                url:"/headQuartersOrdersModify",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/headquartersorders.modify.html',
                        controller : 'headQuartersOrdersMofifyController'
                    }, 
                    "grid@headQuartersOrdersModify": {
                        templateUrl: 'template/headquartersorders.modify.grid.html'
                    }
                }
            })
            .state("headQuartersOrdersBilling",{
                url:"/headQuartersOrdersBilling",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/headquartersorders.billing.list.html',
                        controller : 'headQuartersOrdersBillingController'
                    },
                    'addressManageModal@headQuartersOrdersBilling' : {
                        templateUrl : 'template/headquartersorders.addressmanage.html',
                        controller : 'headQuartersOrdersAddressManageController'
                    }
                }
            })
            .state("getHeadQuartersOrders",{
            	url:"/getHeadQuartersOrders",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/headquartersorders.list.html',
                        controller : 'getHeadQuartersOrdersListController'           		
                	}
            	}
            })
            .state("headQuartersOrdersDetail",{
            	url:"/headQuartersOrdersDetail/{ordernum}",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/headquartersorders.detail.html',
                        controller : 'headQuartersOrdersDetailController'           		
                	}
            	}
            })
            .state("headQuartersOrdersPayment",{
            	url:"/headQuartersOrdersPayment",
            	views : {
            		'mainContent' : {
                		templateUrl : 'template/headquartersorders.payment.html',
                        controller : 'headQuartersOrdersPaymentController' 	           		
                	}
            	}
            })
            .state('entry', {
	            url: '/entry',
	            views: {
	                'mainContent': {
	                    templateUrl: 'template/orders_entry_list.html'
	                },
	                "grid@entry": {
	                    templateUrl: 'template/orders_entry_grid.html'
	                },
	                "query@entry": {
	                    templateUrl: 'template/orders_entry_query.html'
	                }
	            }
	        })
	        .state('ordersDetail', {
	            url: '/ordersDetail/{ordernum}',
	            views: {
	                'mainContent': {
	                    templateUrl: 'template/orders_entry_list_detail.html',
	                    controller : 'ordersDetailController' 	 
	                }
	            }
	        });
        }
    ]
);
