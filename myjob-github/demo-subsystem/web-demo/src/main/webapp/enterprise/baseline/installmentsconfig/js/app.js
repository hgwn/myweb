//相当于整个应用程序的入口
var installmentsconfigApp = angular.module('masgetWebInstallmentsconfigApp', [
    //下方增加依赖模块
    'installmentsconfig.Service',
    'ui.router',
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
installmentsconfigApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
installmentsconfigApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/getInstallmentsconfig');
            $stateProvider.state("getInstallmentsconfig",{
            	url:"/getInstallmentsconfig",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/installmentsconfig.list.html',
                        controller : 'installmentsconfigListController'           		
                	},
                    'installmentsconfigViewModal@getInstallmentsconfig' : {
                        templateUrl : 'template/installmentsconfig.detail.html',
                        controller : 'installmentsconfigDetailController' 
                    }
            	}
            });
        }
    ]
);
