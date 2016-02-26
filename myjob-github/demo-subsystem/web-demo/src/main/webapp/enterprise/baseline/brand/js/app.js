/**
 * 
 */
var entBrandModule = angular.module('masgetWebApp.com.brand',[
    "ui.router",
    'ui.grid',
    "ui.grid.pagination",
    'ngFileUpload',
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
entBrandModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entBrandModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/brand');
    $stateProvider
        .state('brand', {
            url: '/brand',
            views: {
                'main': {
                    templateUrl: '../brand/tpls/brand_list.html'
                }
            }
        })
        .state('addBrand', {
            url: '/addBrand',
            views: {
                'main': {
                    templateUrl: '../brand/tpls/brand_add.html',
                    controller : 'BrandController'
                }
            }
        })
})