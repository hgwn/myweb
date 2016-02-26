var openApiModule= angular.module('masgetWebApp.openApi',[
       "ui.router",
       "ngMessages"
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
openApiModule.run(["$rootScope","$state","$stateParams",function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
openApiModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/test');
    $stateProvider
        .state('test', {
            url: '/test',
            views: {
                'main': {
                    templateUrl: 'tpls/openapi.test.html'
                },
                "call@test":{
                	 templateUrl: 'tpls/openapi.test.call.html'
                }
            }
        }) 
}]);
