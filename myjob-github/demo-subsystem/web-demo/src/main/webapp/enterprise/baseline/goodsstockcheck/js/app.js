//相当于整个应用程序的入口
var goodsstockcheckApp = angular.module('masgetWebAppGoodsStockCheckApp', [
    //下方增加依赖模块
    'ui.router',
    'util.comboxtable',
    'util.pagination',
    'goodsstockcheck.Service',
    'mgcrea.ngStrap',
    'ngAnimate',
    'ngTouch',
    'ui.grid', 
    'ui.grid.pinning',
    'ui.grid.treeView',
    'ui.grid.pagination',
    'ui.grid.autoResize',
    'ngMessages',
    'ui.grid.edit',
    'ui.nested.combobox',
    'category.Service',
    'masgetweb.util.Service'
]);
goodsstockcheckApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
goodsstockcheckApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('goodsstockcheckGet');
            $stateProvider .state("goodsstockcheckGet",{
                url:"/goodsstockcheckGet",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodsstockcheck.list.html',
                        controller : 'goodsstockcheckListController'
                    },
                    'viewGoodsStockCheckDetail@goodsstockcheckGet':{
                    	 templateUrl : 'template/goodsstockcheck.detail.html',
                         controller : 'goodsstockcheckDetailController'  
                    }
                }
            }).state("goodsstockcheckAdd",{
                url:"/goodsstockcheckAdd",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodsstockcheck.add.html',
                        controller : 'goodsstockListController'
                    }/**, 
                    'goodsStockViewModal@goodsstockcheckAdd' : {
                        templateUrl : 'template/goodsstock.view.html',
                        controller : 'goodsStockListController'                    	
                    },
                    'viewPurchaseGoods@goodsstockcheckAdd':{
                        templateUrl : 'template/purchasegoods.goodscart.html',
                        controller : 'purchaseGoodsModalController'                      	
                    }*/
                }
            })
            ;
        }
    ]
);
