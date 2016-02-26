angular.module('masgetWebApp.notice',[
    'ui.router'])
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("home.notice",{
                url:"",
                resolve: resolveDep({
                    files: [
                        'notice/notice.controller'
                    ]},'','noticeControllerDep'),
                views:{
                    'contentPanel_buzcircle':{
                        templateUrl:'base/app/notice/notice.html',
                        controller:'noticeCtr'
                    }
                }
            })
    }])