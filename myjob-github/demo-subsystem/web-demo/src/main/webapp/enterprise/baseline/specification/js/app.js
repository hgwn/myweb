/**
 * 
 */
var entSpecificationModule = angular.module('masgetWebApp.com.specification',[
    "ui.router",
    'ui.grid',
    "ui.grid.pagination",
    "utils.service"
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
entSpecificationModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entSpecificationModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/specification');
    $stateProvider
        .state('specification', {
            url: '/specification',
            views: {
                'main': {
                    templateUrl: '../specification/tpls/specification_list.html'
                }
            }
        })
        .state('addSpecification', {
            url: '/addSpecification',
            views: {
                'main': {
                    templateUrl: '../specification/tpls/specification_add.html',
                    controller : 'SpecificationController'
                }
            }
        })
})