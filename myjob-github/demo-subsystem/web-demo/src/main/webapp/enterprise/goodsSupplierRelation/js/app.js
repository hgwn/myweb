//相当于整个应用程序的入口
var goodsSupplierRelationApp = angular.module('masgetWebAppGoodsSupplierRelation', [
    //下方增加依赖模块
    'ui.router',
    'util.comboxtable',
    'goodsSuplierRelation.Service',
    'mgcrea.ngStrap',
    'ngAnimate',
    'masgetWebApp.utils.service',
    'ngTouch',
    'ui.grid', 
    'ui.grid.pinning',
    'ui.grid.treeView',
    'ui.grid.pagination',
    'ui.grid.selection',
    'ngMessages'

]);
goodsSupplierRelationApp.run(
    [          '$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

        }
    ]
);
goodsSupplierRelationApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/goodsSupplierRelationList');
            $stateProvider.state("goodsSupplierRelationList",{
                url:"/goodsSupplierRelationList",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/goodssupplierrelation.list.html',
                        controller : 'goodsSupplierRelationController'
                    },
                    'configContent' : {
                    }                    
                }
            }).state("configList",{
                url:"/configList",
                views : {
                    'mainContent' : {
                    },
                    'configContent' : {
                    	templateUrl : 'template/config.list.html',
                        controller : 'configListController'
                    }
                }
            });
        }
    ]
);
