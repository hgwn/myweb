angular.module('masgetWebApp.workflow',[
    "ui.router"
])
    .run(['$rootScope','$state','$stateParams','$http','$timeout','$window','i18nService',
        function($rootScope, $state, $stateParams,$http,$timeout,$window,i18nService){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            i18nService.setCurrentLang("zh-cn");
        }])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home.workflow', {
                url: '/:path',
                resolve: resolveDep({
                    files: [
                        'workflow/workflow.list.controller'
                    ]}, '', 'workflowListDep'),
                views: {
                    'contentPanel_my': {
                        templateProvider: ['$stateParams',
                            function ($stateParams) {
                                return '<div style="width:100%;padding:0;height:100%;"ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"><div  class="slide" ui-view="workflowContent" ></div></div></div>';
                            }]
                    }
                }
            })

            .state('home.workflow.list',{
                url:'',
                resolve: resolveDep({
                    files: [
                        'workflow/workflow.list.controller'
                    ]}, '', 'workflowListDep'),
                views:{
                    'workflowContent':{
                        resolve: {
                            businessTypes: ['resolveService',
                                function (resolveService) {
                                    return resolveService.businessTypes();
                                }],
                            session:['resolveService',
                                function (resolveService) {
                                    return resolveService.getSession();
                                }]
                        },
                        templateUrl: 'base/workflow/tpls/list.tpl.html',
                        controller:'workflowListCtr'
                    }
                }
            })

            .state('home.workflow.edit',{
                url:'',
                resolve: resolveDep({
                    files: [
                        'workflow/workflow.edit.controller'
                    ]}, '', 'workflowEditDep'),
                views:{
                    'workflowContent':{
                        resolve:{
                            businessTypes: ['resolveService',
                                function (resolveService) {
                                    return resolveService.businessTypes();
                                }]
                        },
                        templateUrl:'base/workflow/tpls/edit.tpl.html',
                        controller:'workflowEditCtr'
                    }
                }
            })
    }).factory('resolveService',['utils',function(utils){
        return {
            businessTypes:function(){
                return utils.query("/jsbweb/commonUtils.do?type=businessTypes").then(function(resp){
                    return resp.data.rows;
                });
            },
            getSession:function(){
                return utils.query("/jsbweb/base/getSession.do").then(function (resp) {
                    return resp;
                });
            }
        }
    }]).directive('repeatTimes', ['$timeout', 'utils', function ($timeout, utils) {
        return {
            restrict: 'A',
            link: function ($scope, element, attr) {
                var times = parseInt(attr.repeatTimes);
                for (var i = 0; i < times; i++) {
                    element.parent().prepend(element.clone(true));
                }
                element.remove();
            }
        }
    }]);

