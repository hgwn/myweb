//相当于整个应用程序的入口
angular.module('masgetWebAppGoodsClassify', [
    //下方增加依赖模块
    'masgetWebApp.goodsClassify',
    'ui.router',
    'goodsClassify.Service',
    'mgcrea.ngStrap',
    'ngAnimate',
    'masgetWebApp.utils.service',
    'ngTouch',
    'ui.grid', 
    'ui.grid.treeView',
    'ngMessages'
]).run(
    [          '$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

        }
    ]
).config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                //路由的重定向
                // .when('/c?id', '/contacts/:id')
                // .when('/user/:id', '/contacts/:id')
                //默认路由
                .otherwise('/goodsClassifyList');
        }
    ]
);
