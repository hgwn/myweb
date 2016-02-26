/**
 * 
 */
var entAttributeModule = angular.module('masgetWebApp.com.attribute',[
    "ui.router",
    'ui.grid',
    "ui.grid.pagination",
    "attribute.Service",
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
entAttributeModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entAttributeModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/attribute');
    $stateProvider
        .state('attribute', {
            url: '/attribute',
            views: {
                'main': {
                    templateUrl: '../attribute/tpls/attribute_list.html'
                }
            }
        })
        .state('addAttribute', {
            url: '/addAttribute',
            views: {
                'main': {
                    templateUrl: '../attribute/tpls/attribute_add.html',
                    controller : 'AttributeController'
                }
            }
        })
})