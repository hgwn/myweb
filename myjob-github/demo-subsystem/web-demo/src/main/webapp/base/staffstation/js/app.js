var staffstationModule= angular.module('masgetWebApp.base.staffstation',[
       "ui.router",
       "ngMessages",
       "util.pagination",
       "selectAddress",
       "util.comboxtable",
       "mgcrea.ngStrap",
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
staffstationModule.run(["$rootScope","$state","$stateParams",function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
staffstationModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: '/list',
            views: {
                'main': {
                    templateUrl: 'tpls/staffstation.add.html'
                }

            }
        })
}]);
