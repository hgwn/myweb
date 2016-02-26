var logComPaymentjournalModule= angular.module('masgetWebApp.headquarters.comPaymentjournal',[
       "ui.router",
       "ngMessages",
       "util.pagination",
       "util.comboxtable",
       "selectAddress",
       "mgcrea.ngStrap",
       "util.decimal",
	   "ngAnimate",
	   "ui.grid",
	   "ui.grid.resizeColumns",
	   "ui.grid.pagination",
        "goodsstock.Service"
       ]);
/**
 * 把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
logComPaymentjournalModule.run(["$rootScope","$state","$stateParams",function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

/**
 * 配置路由。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
logComPaymentjournalModule.config(["$stateProvider","$urlRouterProvider",function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/list');
    $stateProvider
        .state('list', {
            url: '/list',
            views: {
                'main': {
                    templateUrl: 'tpls/paymentjournal.list.html'
                },
                "query@list":{
                	 templateUrl: 'tpls/paymentjournal.list.query.html'
                },
                "grid@list":{
               	 	templateUrl: 'tpls/paymentjournal.list.ui-grid.html'
                }
            }
        }) 
}]);
logComPaymentjournalModule.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function ($scope, element, attr) {

            if (attr.onFinishRenderFilters == "check"){
                $(window).resize(function () {
                    $("#gridOptions", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                });
                $timeout(function(){
                    $("#gridOptions", element).css("height", (document.documentElement.clientHeight - 120) + "px");
                })
            }
        }
    };
})