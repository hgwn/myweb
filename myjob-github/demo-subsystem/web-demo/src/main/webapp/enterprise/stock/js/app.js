var comGoodstockModule = angular.module('masgetWebApp.com.goodsstock', [
    "ui.router",
    'ui.tree',                  //angular-ui-tree依赖注入
    "ngMessages",
    'mgcrea.ngStrap',           //$alert依赖注入
    "util.pagination",
    "util.comboxtable",
    "subgoodsstock",
    "warehousein",
	"warehouseout",
    "changewarehouse",
    "changewarehousein",
    "changewarehouseout",
    "goodsstockcheck",
    "util.comboxtable",
    "ui.grid",
    "ui.grid.edit",
    "ui.grid.cellNav",
    "ui.grid.selection",
    "masgetWebApp.enterprise.stock.service"
]);


comGoodstockModule.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
});

comGoodstockModule.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/goodstock');

    $stateProvider
        .state('goodstock', {
            url: '/goodstock',
            views: {
                'main': {
                    templateUrl: 'tpls/goodsstock.list.html'
                },
                "query@goodstock": {
                    templateUrl: 'tpls/goodsstock.list.query.html'
                },
                "grid@goodstock": {
                    templateUrl: 'tpls/goodsstock.list.grid.html'
                },
                "modal@goodstock": {
                    templateUrl: 'tpls/goodsstock.edit.html'
                }

            }
        })
        .state('warehousein', {
            url: '/warehousein',
            views: {
                'main': {
                    templateUrl: 'tpls/warehousein.list.html'
                },
                "query@warehousein": {
                    templateUrl: 'tpls/warehousein.list.query.html'
                },
                "grid@warehousein": {
                    templateUrl: 'tpls/warehousein.list.grid.html'
                },
                "printHtml@warehousein":{
                	templateUrl: 'tpls/printHtml.html'
                }
            }
        }).state('warehouseout', {
            url: '/warehouseout',
            views: {
                'main': {
                    templateUrl: 'tpls/warehouseout.html'
                },
                /*"add@warehouseout": {
                    templateUrl: 'tpls/warehouseout.add.html',
                },*/
                "view@warehouseout": {
                    templateUrl: 'tpls/warehouseout.view.html',
                }
            }
        })
        .state('changewarehouse', {
            url: '/changewarehouse',
            views: {
                'main': {
                    templateUrl: 'tpls/changewarehouse.list.html'
                },
                "query@changewarehouse": {
                    templateUrl: 'tpls/changewarehouse.list.query.html'
                },
                "grid@changewarehouse": {
                    templateUrl: 'tpls/changewarehouse.list.grid.html'
                },
                "modal@changewarehouse": {
                    templateUrl: 'tpls/changewarehouse.view.html'
                },
                "add@changewarehouse": {
                    templateUrl: 'tpls/changewarehouse.add.html'
                }
            }
        })
        .state('goodsstockcheck', {
            url: '/goodsstockcheck',
            views: {
                'main': {
                    templateUrl: 'tpls/goodsstockcheck.list.html'
                },
                "query@goodsstockcheck": {
                    templateUrl: 'tpls/goodsstockcheck.list.query.html'
                },
                "add@goodsstockcheck": {
                    templateUrl: 'tpls/goodsstockcheck.list.add.html'
                }
            }
        })
        .state('goodsstockcheckin',{
        	url:'/goodsstockcheckin',
        	views:{
        		'main':{
        			templateUrl:'tpls/goodsstockcheck.list.in.html'
        		}
        	}
        })
        .state('goodsstockcheckout',{
        	url:'/goodsstockcheckout',
        	views:{
        		'main':{
        			templateUrl:'tpls/goodsstockcheck.list.out.html'
        		}
        	}
        })
        .state('addwarehouseout', {
            url: '/addwarehouseout',
            views: {
                'main': {
                	 templateUrl: 'tpls/warehouseout.add.html',
                	 controller : 'warehouseoutListController'
                }
            }
        })
        .state('addwarehousein', {
            url: '/addwarehousein',
            views: {
                'main': {
                	 templateUrl: 'tpls/warehousein.list.add.html',
                	 controller : 'warehouseinListController'
                }
            }
        })
});
