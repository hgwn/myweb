angular.module('masgetWebApp.accountCheck',[
    "ui.router"
])
    .run(['$rootScope','$state','$stateParams','$window',
        function($rootScope, $state, $stateParams,$window){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

        }])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home.accountCheck', {
                url: '/:path',
                resolve: resolveDep({
                    files: [
                        'angularUiGrid/ui-grid',
                        'static/js/plugins/angular.plugins/angular-ui-grid/ui-grid.min.css',
                        'NgFileUpload/ng-file-upload',
                        'static/css/base/scheduleManage.css',
                        'accountCheck/controllers'

                    ]}, '', 'accountCheckListDep'),
                views: {
                    'contentPanel_my': {
                        templateProvider: ['$stateParams',
                            function ($stateParams) {
                                return '<div style="width:100%;padding:0;height:100%;"ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"><div  class="slide" ui-view="accountCheckContent" ></div></div></div>';
                            }]
                    }
                }
            })
            .state('home.accountCheck.check',{
                url:'',
                views:{
                    'accountCheckContent': {
                        templateUrl: 'rboperationsmanager/tpls/accountcheck/create.tpl.html',
                        controller:'accountCheckCtr'
                    }
                }
            })
            .state('home.accountCheck.result',{
                url:'',
                views:{
                    'accountCheckContent':{
                        templateUrl: 'rboperationsmanager/tpls/accountcheck/result.tpl.html',
                        controller:'accountCheckResultCtr'
                    }
                }
            })
    });

