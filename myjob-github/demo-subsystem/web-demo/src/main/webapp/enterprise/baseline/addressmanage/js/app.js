/**
 * 
 */
var entAddressmanageModule = angular.module('masgetWebApp.com.addressmanage',[
    "ui.router",
    'ui.grid',
    "ui.grid.selection",
    "ui.grid.pagination",
    "service",
    "ngMessages",
    'ui.grid.cellNav'
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
entAddressmanageModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entAddressmanageModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/addressmanage');
    $stateProvider
        .state('addressmanage', {
            url: '/addressmanage',
            views: {
                'main': {
                    templateUrl: '../addressmanage/tpls/addressmanage_list.html'
                }
            }
        })
        .state('addAddressmanage', {
            url: '/addAddressmanage',
            views: {
                'main': {
                    templateUrl: '../addressmanage/tpls/addressmanage_add.html',
                    controller : 'AddressmanageController'
                }
            }
        })
})