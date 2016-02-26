//相当于整个应用程序的入口
var addressGroupConfigApp = angular.module('masgetWebAddressGroupConfigApp', [
    //下方增加依赖模块
    'addressgroupconfig.Service',
    'ui.router',
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
    'ui.grid.expandable',
    'ngMessages'
]);
addressGroupConfigApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
addressGroupConfigApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/getAddressGroupConfig');
            $stateProvider.state("getAddressGroupConfig",{
            	url:"/getAddressGroupConfig",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/addressgroupconfig.list.html',
                        controller : 'addressGroupConfigListController'           		
                	},
                    'addressGroupConfigViewModal@getAddressGroupConfig' : {
                        templateUrl : 'template/addressgroupconfig.detail.html',
                        controller : 'addressGroupConfigDetailController' 
                    }
            	}
            });
        }
    ]
);
