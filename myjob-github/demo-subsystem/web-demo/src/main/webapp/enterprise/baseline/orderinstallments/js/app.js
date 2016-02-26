//相当于整个应用程序的入口
var orderinstallmentsApp = angular.module('masgetWebOrderinstallmentsApp', [
    //下方增加依赖模块
    'orderinstallments.Service',
    'ui.router',
    'util.comboxtable',
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
    'ui.grid.expandable'
]);
orderinstallmentsApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
orderinstallmentsApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/getOrderinstallments');
            $stateProvider.state("getOrderinstallments",{
            	url:"/getOrderinstallments",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/orderinstallments.list.html',
                        controller : 'orderinstallmentsListController'           		
                	}
            	}
            }).state("orderinstallmentsView",{
            	url:"/orderinstallmentsView",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/orderinstallments.detail.html',
                        controller : 'orderinstallmentsDetailController'           		
                	}
            	}
            });
        }
    ]
);
