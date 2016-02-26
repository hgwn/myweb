/**
 * 
 */
var entParameterModule = angular.module('masgetWebApp.com.parameter',[
    "ui.router",
    'ui.grid',
    "ui.grid.pagination",
    'utils.service'
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
entParameterModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entParameterModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/parameter');
    $stateProvider
        .state('parameter', {
            url: '/parameter',
            views: {
                'main': {
                    templateUrl: '../parameter/tpls/parameter_list.html'
                }
            }
        })
        .state('addParameter', {
            url: '/addParameter',
            views: {
                'main': {
                    templateUrl: '../parameter/tpls/parameter_add.html',
                    controller : 'ParameterController'
                }
            }
        })
})