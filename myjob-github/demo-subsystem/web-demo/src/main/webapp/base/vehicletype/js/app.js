//相当于整个应用程序的入口
angular.module('masgetWebApp', [
    //下方增加依赖模块
    //演示模块
    'masgetWebApp.vehicletype',
    'masgetWebApp.vehicletype.service',
    'masgetWebApp.utils.service',
    'mgcrea.ngStrap',
    'ui.router',
    'ngAnimate',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.resizeColumns',
    'ui.grid.pinning'
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
