//相当于整个应用程序的入口
var stockListApp = angular.module('masgetWebAppStockList', [
    //下方增加依赖模块
    'ui.router',
    'util.comboxtable',
    'stockList.Service',
    'mgcrea.ngStrap',
    'ngAnimate',
    'masgetWebApp.utils.service',
    'ngTouch',
    'ui.grid', 
    'ui.grid.pinning',
    'ui.grid.treeView',
    'ui.grid.pagination',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ngMessages',
    'angularBootstrapNavTree'
]);
stockListApp.run(
    [          '$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

        }
    ]
);
stockListApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/stockList');
            $stateProvider.state("stockList",{
                url:"/stockList",
                views : {
                    'mainContent' : {
                        templateUrl : 'template/stockList.list.html',
                        controller : 'stockListController'
                    } ,
                    'stationAdbTreeContent@stockList':{
                        templateUrl : 'template/stationAdbTree.list.html',
                        controller : 'stationAdbTreeController'
                    },
                    'stockListModal@stockList':{
                        templateUrl : 'template/stockList.Modal.html',
                        controller : 'stockListModalController'
                    }
                }
            });
        }
    ]
);
