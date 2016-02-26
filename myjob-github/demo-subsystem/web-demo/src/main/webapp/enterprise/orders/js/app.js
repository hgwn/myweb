/**
 * 
 */
var entOrdersModule = angular.module('masgetWebApp.enterprise.orders',[
    "ui.router",
    "ngMessages",
    "util.pagination",
    "util.comboxtable",
    "masgetWebApp.enterprise.orders.service",
    'mgcrea.ngStrap','ngTouch', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.expandable','ngAnimate', 'ui.grid.pagination'
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
entOrdersModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entOrdersModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/add');
    $stateProvider
        .state('add', {
            url: '/add',
            views: {
                'main': {
                    templateUrl: 'tpls/orders_add_salesorders.html'
                },
                "orders@add": {
                    templateUrl: 'tpls/orders_add_salesorder_orders.html'
                },
                "orderlist@add": {
                    templateUrl: 'tpls/orders_add_salesorder_orderlist.html'
                },
                "addContact@add":{
                    templateUrl: "tpls/orders_add_contact.html",
                    controller: "OrderAddContactController"
                },
                "addAddressgroup@add":{
                	templateUrl: "tpls/orders_add_addressgroup.html",
                	controller:"OrderAddAddressGroupController"
                },
                "printHtml":{
                	templateUrl: 'tpls/printHtml.html'
                }
            }
        })
        .state('list', {
            url: '/list',
            views: {
                'main': {
                    templateUrl: 'tpls/orders_salesorders.list.html'
                },
                "query@list": {
                    templateUrl: 'tpls/orders_salesorders.list.query.html'
                },
                "grid@list": {
                    templateUrl: 'tpls/orders_salesorders.list.grid.html'
                }
            }
        })
        .state('gridlist', {
            url: '/gridlist',
            views: {
                'main': {
                    templateUrl: 'tpls/orders_salesorders_ui_grid.list.html'
                },
                "query@gridlist": {
                    templateUrl: 'tpls/orders_salesorders_ui_grid.list.query.html'
                },
                "grid@gridlist": {
                    templateUrl: 'tpls/orders_salesorders_ui_grid.list.grid.html'
                }
            }
        })
})