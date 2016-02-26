/**
 * 
 */
var entWarehouseoutModule = angular.module('masgetWebApp.enterprise.warehouseout',[
	//下方增加依赖模块
	'masgetweb.util.Service',
	'ui.router',
	'util.comboxtable',
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
	'ngMessages',
	'ui.grid.selection'
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
entWarehouseoutModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entWarehouseoutModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/warehouseout');
    $stateProvider
        .state('warehouseout', {
            url: '/warehouseout',
            views: {
                'main': {
                    templateUrl: '../warehouseout/tpls/warehouseout.list.html'
                },
                'viewWarehouseout@warehouseout': {
                    templateUrl: '../warehouseout/tpls/warehouseout.view.html'
                }
            }
        })
        .state('addWarehouseout', {
            url: '/addWarehouseout',
            views: {
                'main': {
                    templateUrl: '../warehouseout/tpls/warehouseout.add.html',
                    controller : 'warehouseoutAddController'
                },
                'select_goods@addWarehouseout':{
                    templateUrl : 'tpls/select_goods_model.html',
                    controller : 'selectGoodsController'
                },
                'select_orders@addWarehouseout':{
                    templateUrl : 'tpls/select_orders_model.html',
                    controller : 'selectOrdersController'
                }
            }
        })
})