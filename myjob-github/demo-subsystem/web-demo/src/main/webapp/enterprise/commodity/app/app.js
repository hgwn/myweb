//相当于整个应用程序的入口
angular.module('masgetWebAppCom', [
    //下方增加依赖模块
    'masgetWebApp.commodity',
    'ui.router',
    'ngCookies',
    'infinite-scroll',
    'commodity.Service',
    'mgcrea.ngStrap',
    'ngAnimate'
]).run(
    [          '$rootScope', '$state', '$stateParams', '$sce',  '$modal',
        function ($rootScope, $state, $stateParams, $sce,  $modal) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            function getLocationParams(){
                var fullPath = window.location.href;
                var paramsString = fullPath.substring(fullPath.lastIndexOf("?")+1);
                var paramsArray = paramsString.split("&");
                var params = {};
                $.each(paramsArray,function(key,item){
                    var tmp = item.split("=");
                    params[tmp[0]] = tmp[1];
                });
                return params;
            }

            console.log(getLocationParams());

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
                .otherwise('/supplyList');
        }
    ]
);
