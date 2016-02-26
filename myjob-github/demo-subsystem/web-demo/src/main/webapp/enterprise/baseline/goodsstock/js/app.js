//相当于整个应用程序的入口
var goodsstockApp = angular.module('masgetWebAppGoodsStockApp', [
    //下方增加依赖模块
    'ui.router',
    'util.comboxtable',
    'util.pagination',
    'goodsstock.Service',
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
    'ngMessages',
    'ui.grid.edit',
    'ui.nested.combobox',
    'category.Service',
    'masgetweb.util.Service'
]);

goodsstockApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
goodsstockApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('goodsstockGet');
            $stateProvider .state("goodsstockGet",{
                url:"/goodsstockGet",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodsstock.list.html',
                        controller : 'goodsstockListController'
                    },
                    'viewGoodsStockBatchDetail@goodsstockGet':{
                    	 templateUrl : 'template/goodsstockbatch.detail.html'/*,
                         controller : 'goodsstockDetailController'  */
                    }
                }
            }).state("goodsstockInOutGet",{
                url:"/goodsstockInOutGet/{goodsid}",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodsstockinout.list.html',
                        controller : 'goodsstockInOutController'
                    } ,
		            'viewGoodsStockOutDetail@goodsstockInOutGet':{
		            	 templateUrl : 'template/goodsstockout.detail.html'
		                 /*controller : 'viewGoodsStockInOutDetailControl'  */
		            },
		            'viewGoodsStockInDetail@goodsstockInOutGet':{
		            	 templateUrl : 'template/goodsstockin.detail.html'
		                 /*controller : 'viewGoodsStockInOutDetailControl'  */
		            }
                }
            })
            ;
        }
    ]
);
