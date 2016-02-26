//相当于整个应用程序的入口
var masgetWebApp = angular.module('masgetWebApp', [
    //下方增加依赖模块
    'masgetWebApp.utils.service',
    'masgetweb.util.Service',
    'ui.router',
    'masgetWebApp.warehouseinService',
    'util.comboxtable',
    'util.pagination',
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
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.expandable',
    'ui.grid.selection'
]);
masgetWebApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
masgetWebApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/warehousein');
            $stateProvider.state("warehousein",{
                url:"/warehousein",
                views : {
                    'main' : {
                        templateUrl : 'template/warehousein.query.html',
                        controller : 'warehouseinQueryController'
                    }
                }
            })
            .state("warehousein_import",{
                url:"/warehousein_import",
                views : {
                    'main' : {
                        templateUrl : 'template/warehousein.import.html',
                        controller : 'warehouseinImportController'
                    }
                }
            })
            .state("warehousein_add", {
                url:"/warehousein_add",
                views : {
                    'main' : {
                        templateUrl : 'template/warehousein.add.html',
                        controller : 'warehouseinAddController'
                    },
                    'select_goods@warehousein_add':{
                        templateUrl : 'template/select_goods_model.html',
                        controller : 'selectGoodsController'
                    }
                }
            })
            .state("warehousein_detail",{
            	url:"/warehousein_detail",
            	views : {
            		'main' : {
                        templateUrl : 'template/warehousein.detail.html',
                        controller : 'warehouseinDetailController'
            		}
            	}
            })
        }
    ]
);
