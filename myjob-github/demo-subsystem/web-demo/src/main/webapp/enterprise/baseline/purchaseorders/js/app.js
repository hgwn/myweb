//相当于整个应用程序的入口
var purchaseOrdersApp = angular.module('masgetWebAppPurchaseOrdersApp', [
    //下方增加依赖模块
    'masgetWebApp.utils.service',
    'ui.router',
    'util.comboxtable',
    'util.pagination',
    'purchaseOrders.Service',
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
    'ngMessages'
]);
purchaseOrdersApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
purchaseOrdersApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            //$urlRouterProvider.otherwise('/purchaseOrdersAdd');
            $stateProvider.state("purchaseOrdersAdd",{
                url:"/purchaseOrdersAdd",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/purchaseorders.query.html',
                        controller : 'purchaseOrdersAddController'
                    }, 
                    'goodsList@purchaseOrdersAdd' : {
                        templateUrl : 'template/purchaseorders.goods.list.html',
                        controller : 'goodsListController'                    	
                    },
                    'viewPurchaseGoods@purchaseOrdersAdd':{
                        templateUrl : 'template/purchasegoods.goodscart.html',
                        controller : 'purchaseGoodsModalController'                      	
                    }
                }
            })
            .state("purchaseOrdersbilling",{
                url:"/purchaseOrdersbilling",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/purchaseorders.billing.list.html',
                        controller : 'purchaseOrdersBillingController'
                    },
                    'addressManageModal@purchaseOrdersbilling' : {
                        templateUrl : 'template/purchaseorders.addressmanage.html',
                        controller : 'purchaseOrdersAddressManageController'
                    }
                }
            })
            .state("getPurchaseorders",{
            	url:"/getPurchaseorders",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/purchaseorders.list.html',
                        controller : 'purchaseOrdersListController'           		
                	},
            		'purchaseOrdersViewModal@getPurchaseorders' : {
                		templateUrl : 'template/purchaseorders.view.html',
                        controller : 'purchaseOrdersViewController' 	
                	}
            	}
            })
            .state("editPurchaseorders",{
            	url:"/editPurchaseorders",
            	views : {
            		'mainContent' : {
                		templateUrl : 'template/purchaseorders.edit.html',
                        controller : 'purchaseOrdersEditController' 	           		
                	}
            	}
            })
            .state("auditExternalPurchaseorders",{
            	url:"/auditExternalPurchaseorders",
            	views : {
            		'mainContent' : {
                		templateUrl : 'template/externalPurchaseorders.list.html',
                        controller : 'externalPurchaseOrdersListController' 	           		
                	},
            		'purchaseOrdersViewModal@auditExternalPurchaseorders' : {
                		templateUrl : 'template/purchaseorders.view.html'
                	},
                	'purchaseOrdersAuditModal@auditExternalPurchaseorders' : {
                		templateUrl : 'template/externalPurchaseorders.audit.html'
                	},
                	'warehouseSelectModal@auditExternalPurchaseorders' : {
                		templateUrl : 'template/externalPurchaseorders.accept.html',
                		controller : 'externalPurchaseOrdersAcceptController'
                	}
            	}
            })
            .state("purchaseordersPayment",{
            	url:"/purchaseordersPayment",
            	views : {
            		'mainContent' : {
                		templateUrl : 'template/purchaseorders.payment.html',
                        controller : 'purchaseordersPaymentController' 	           		
                	}
            	}
            });
        }
    ]
);
