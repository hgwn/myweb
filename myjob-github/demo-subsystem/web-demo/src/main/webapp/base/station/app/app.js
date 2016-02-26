//相当于整个应用程序的入口
angular.module('masgetWebApp', [
    //下方增加依赖模块
    //演示模块
    'masgetWebApp.datum',
    'masgetWebApp.datum.service',
    'masgetWebApp.utils.service',
    'mgcrea.ngStrap',
    'ui.router',
    'ngAnimate',
    'util.pagination',
    //'ui.grid', 'ui.grid.treeView'
])

    .run(
    [          '$rootScope', '$state', '$stateParams', '$sce', 'utils', '$modal',
        function ($rootScope, $state, $stateParams, $sce, utils, $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)

    .config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $urlRouterProvider

                //路由的重定向
                // .when('/c?id', '/contacts/:id')
                // .when('/user/:id', '/contacts/:id')

                //默认路由
                .otherwise('/list');

        }
    ]
);
