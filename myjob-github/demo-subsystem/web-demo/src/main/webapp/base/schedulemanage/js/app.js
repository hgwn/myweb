angular.module('masgetWebApp.scheduleManage',[
    "ui.router"
])
    .run(['$rootScope','$state','$stateParams','$http','$timeout','$window',
        function($rootScope, $state, $stateParams,$http,$timeout,$window){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home.scheduleManage', {
                url: '/:path',
                resolve: resolveDep({
                    files: [
                        'scheduleManage/scheduleManage.list.controller'
                    ]}, '', 'scheduleManageListDep'),
                views: {
                    'contentPanel_my': {
                        templateProvider: ['$stateParams',
                            function ($stateParams) {
                                return '<div style="width:100%;padding:0;height:100%;"ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"><div  class="slide" ui-view="scheduleManageContent" ></div></div></div>';
                            }]
                    }
                }
            })

            .state('home.scheduleManage.list',{
                url:'',
                views:{
                    'scheduleManageContent':{
                        templateUrl: 'base/schedulemanage/tpls/list.tpl.html',
                        controller:'scheduleManageListCtr'
                    }
                }
            })
    });

