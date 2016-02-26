/**
 * 
 */
var entCatagoryModule = angular.module('masgetWebApp.com.category',[
    'ngAnimate', 
    'ngTouch',
    "ui.grid",
    'ui.grid.pagination',
    'ui.grid.treeView',
    'utils.service',
    'ui.router',
    "category.Service"
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
entCatagoryModule.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
entCatagoryModule.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/category');
    $stateProvider
        .state('category', {
            url: '/category',
            views: {
                'main': {
                    templateUrl: '../category/tpls/category_list.html'
                }, 
                "add@category": {
                    templateUrl: '../category/tpls/category_add.html'
                }
            }
        })
})