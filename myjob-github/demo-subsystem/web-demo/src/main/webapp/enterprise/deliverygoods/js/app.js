var entDeliverygoodsModule= angular.module('masgetWebApp.enterprise.deliverygoods',[
       "ui.router",
       "ngMessages",
       "util.pagination",
       "util.comboxtable",
       "util.selectAddress",
       "mgcrea.ngStrap",
       "util.decimal",
       'ui.grid',
       'ui.grid.resizeColumns'
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
entDeliverygoodsModule.run(["$rootScope","$state","$stateParams",function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entDeliverygoodsModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/add');
    $stateProvider
        .state('list', {
            url: '/list',
            views: {
                'main': {
                    templateUrl: 'tpls/deliverygoods.list.html'
                },
                "query@list":{
                	 templateUrl: 'tpls/deliverygoods.list.query.html'
                },
                "grid@list":{
               	 	templateUrl: 'tpls/deliverygoods.list.ui-grid.html'
                }
            }
        })
        .state('add', {
            url: '/add',
            views: {
                'main': {
                    templateUrl: 'tpls/deliverygoods.add.html'
                },
                "commodityList@add":{
                	templateUrl: 'tpls/deliverygoods.add.commodity.grid.html',
                },
                "datasourceModal@add":{
                	templateUrl: 'tpls/deliverygoods.add.modal.datasource.query.html',
                },
                "contractorModal@add":{
                	templateUrl: 'tpls/deliverygoods.add.modal.contractor.add.html',
                }
            }
        })
        .state('edit', {
            url: '/edit',
            views: {
                'main': {
                    templateUrl: 'tpls/deliverygoods.add.html'
                },
                "commodityList@edit":{
                	templateUrl: 'tpls/deliverygoods.add.commodity.grid.html',
                },
                "datasourceModal@add":{
                	templateUrl: 'tpls/deliverygoods.add.modal.datasource.query.html',
                },
                "contractorModal@edit":{
                	templateUrl: 'tpls/deliverygoods.add.modal.contractor.add.html',
                }
            }
        })
}]);
