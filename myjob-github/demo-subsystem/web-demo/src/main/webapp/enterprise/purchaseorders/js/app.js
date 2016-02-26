/**
 * 
 */
var entPurchaseOrdersModule = angular.module('masgetWebApp.enterprise.purchaseorders',[
    "ui.router",
    "ngMessages",
    "util.pagination",
    "util.comboxtable",
    'mgcrea.ngStrap','ngTouch', 'ui.grid', 'ui.grid.resizeColumns',
    'ui.grid.expandable','ngAnimate', 'ui.grid.pagination'
]);

/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
entPurchaseOrdersModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entPurchaseOrdersModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/add');
    $stateProvider
        .state('add', {
            url: '/add',
            views: {
                'main': {
                    templateUrl: 'tpls/add_purchaseorders.html'
                },
                "head@add": {
                    templateUrl: 'tpls/add_purchaseorders_head.html'
                },
                "goods@add": {
                    templateUrl: 'tpls/add_purchaseorders_goods.html'
                },
                "history@add": {
                    templateUrl: 'tpls/add_purchaseorders_history.html'
                }
            }
        })
})