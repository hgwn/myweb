angular.module('masgetWebApp.mgchat', [
    'ui.router'
]).run(['$templateCache', function ($templateCache) {

}]).config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                .state('home.mgchat', {
                    resolve: resolveDep({
                        files: [
                            'emojify/emojify',
                            'static/js/plugins/jquery.plugins/emojify/emojify-emoticons.css',
                            'mgchat/mgchat.controller'
                        ]},'','mgchatDep'),
                    url: '/mgchat/:path',
                    views: {
                        'contentPanel_buzcircle': {
                            templateUrl: 'base/app/mgchat/mgchat.html',
                            controller:'mgchatCtr'
                        }
                    }
                })

                .state('home.mgchat.group',{
                    url: '',
                    resolve: resolveDep({
                        files: [
                            'buzcircle/buzCircle.group.controller'
                        ]},'','mgchatGroupDep'),
                    views: {
                        'mgchat_content@home.mgchat':{
                            templateUrl:'base/app/mgchat/mgchat.member.html',
                            controller:'buzCircleGroupCtr'
                        }
                    }
                })

                .state('home.mgchat.toResourse',{
                    url: '/:resourcePath',
                    // view 用在该状态下有多个 ui-view 的情况，可以对不同的 ui-view 使用特定的 template, controller, resolve data
                    // 绝对 view 使用 '@' 符号来区别，比如 'foo@bar' 表明名为 'foo' 的 ui-view 使用了 'bar' 状态的模板(template)，相对 view 则无
                    views: {
                        'mgchat_content': {
                            templateProvider: ['$stateParams',
                                function ($stateParams) {
                                    return '<iframe src="{{pathUrl}}" width="100%" height="100%" frameborder="0" on-finish-render-filters="contentPanel_my_iframe"></iframe>';
                                }],
                            controller: ['$scope', '$stateParams', '$state', '$sce', 'utils',
                                function ($scope, $stateParams, $state, $sce, utils) {
                                    $scope.pathUrl = $state.broadCast ? $sce.trustAsResourceUrl($state.broadCast.src) : "";
                                    $scope.$on("$viewContentLoaded",function(event,element){
                                        if(utils.getBrowser() == "Firefox")
                                            element.children(":first").css("height",element[0].offsetHeight+"px");
                                    })
                                }]
                        }
                    }
                })
        }
    ]
);
