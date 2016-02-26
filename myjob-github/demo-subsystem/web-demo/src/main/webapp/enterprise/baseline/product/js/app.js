/**
 * 
 */
var entProductsModule = angular.module('masgetWebApp.com.product',[
    "ui.grid",
    'ui.grid.pagination',
    'ui.router',
    'ngFileUpload',
    "utils.service",
    'ui.select',
    'ui.nested.combobox',
    'mgcrea.ngStrap',
    'ngFileUpload',
    
    'ui.grid.selection',
    'ui.grid.autoResize',
	'ui.grid.resizeColumns',
	'ui.grid.expandable',
]);
//,
//'ui.grid', 'ui.grid.edit', 'ui.grid.rowEdit', 'ui.grid.cellNav'
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
entProductsModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entProductsModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/entry');
    $stateProvider
        .state('entry', {
            url: '/entry',
            views: {
                'main': {
                    templateUrl: '../product/tpls/product_entry_list.html'
                },
				"selectFile@entry":{
					templateUrl: "../product/tpls/select_excel_file_modal.html"
				},
				"import@entry":{
					templateUrl: "../product/tpls/select_importsModal.html",
					//controller : 'importController'
				}
            }
        })
        .state('add', {
            url: '/add',
            views: {
                'main': {
                    templateUrl: '../product/tpls/product_add_list.html'
                },
                "addgoodsunit@add": {
                    templateUrl: '../product/tpls/product.addgoodsunit.html'
                },
                'addGoodsClassify@add':{
        			templateUrl:'../product/tpls/goodsclassify.add.html',
        		},
                'addGoodsSpec@add':{
        			templateUrl:'../product/tpls/product.addspec.html',
        		}
            }
        })
        .state('check', {
            url: '/check/{goodssn}/{pagesize}/{pagenum}',
            views: {
            	'main': {
                    //templateUrl: '../orders/tpls/orders_check_list.html',
                	templateUrl : function($stateParams){
                        console.log($stateParams);
                        return '../product/tpls/product_check_list.html';
                    }
                },
                "grid@check": {
                    templateUrl: '../product/tpls/product_add_grid.html'
                }
            }
        })
        .state('updata', {
            url: '/updata/{goodssn}/{pagesize}/{pagenum}',
            views: {
                'main': {
                    //templateUrl: '../orders/tpls/orders_check_list.html',
                	templateUrl : function($stateParams){
                        console.log($stateParams);
                        return '../product/tpls/product_add_list.html';
                    }
                },
                "addgoodsunit@updata": {
                    templateUrl: '../product/tpls/product.addgoodsunit.html'
                },
                'addGoodsClassify@updata':{
        			templateUrl:'../product/tpls/goodsclassify.add.html',
        		},
                'addGoodsSpec@updata':{
        			templateUrl:'../product/tpls/product.addspec.html',
        		}
            }
        })
})