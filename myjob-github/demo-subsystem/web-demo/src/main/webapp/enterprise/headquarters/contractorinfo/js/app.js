//相当于整个应用程序的入口
var contractorInfoApp = angular.module('masgetWebContractorInfoApp', [
    //下方增加依赖模块
    'contractorInfo.Service',
    'ui.router',
    'util.comboxtable',
    'util.pagination',
    'masgetWebApp.utils.service',
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
contractorInfoApp.run(
    ['$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
);
contractorInfoApp.config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/getContractorInfo');
            $stateProvider.state("getContractorInfo",{
            	url:"/getContractorInfo",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/contractorinfo.list.html',
                        controller : 'contractorInfoListController'           		
                	}
            	}
            })
            .state("addContractorInfo",{
            	url:"/addContractorInfo",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/contractorinfo.add.html',
                        controller : 'contractorInfoAddController'           		
                	},
                	'addressGroupConfigViewModal@addContractorInfo' : {
                		templateUrl : 'template/addressgroupconfig.add.html'
            		}
            	}
            })
            .state("viewContractorInfo",{
            	url:"/viewContractorInfo",
            	views : {
            		'mainContent' : {
                        templateUrl : 'template/contractorinfo.detail.html',
                        controller : 'contractorInfoDetailController'           		
                	}
            	}
            });
        }
    ]
);
