angular.module('masgetWebApp.buzcircle', [
    'ui.router'
]).config(
    [          '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                .state('home.buzcircle_detail', {

                    url: '/:path',
                    views: {

                        'contentPanel_buzcircle': {
                            templateProvider: ['$stateParams',
                                function ($stateParams) {
                                    return '<iframe src="{{path}}" width="100%" height="100%" iframeScroll="auto" on-finish-render-filters="contentPanel" ng-scrollbar scrollbar-x="false" scrollbar-y="true" scrollbar-config="{autoResize:true,show:true}"></iframe>';
                                }],
                            controller: ['$scope', '$stateParams', '$state', '$sce', 'utils',
                                function ($scope, $stateParams, $state, $sce, utils) {
                                    $scope.path = $state.broadCast ? $sce.trustAsResourceUrl($state.broadCast.src) : "";
                                }]
                        }
                    }
                })
                .state('home.buzcircle_group', {

                    url: '/group/:path',
                    resolve: resolveDep({
                        files: [
                            'buzcircle/buzCircle.group.controller'
                        ]},'','buzcircleGroupDeps'),
                    views: {
                        'contentPanel_buzcircle': {
                            templateUrl: 'base/app/buzCircle/buzCircle.group.html',
                            controller: 'buzCircleGroupCtr'
                        }
                    }

                })
                .state('home.buzcircle_find', {
                    url: '/:path',
                    views: {
                        'contentPanel_buzcircle': {
                            templateUrl: "base/app/buzCircle/buzCircle.find.html",
                            controller: ['$scope', '$stateParams', '$state', '$sce', 'utils',
                                function ($scope, $stateParams, $state, $sce, utils) {
                                    $scope.searchBuzCircle = function () {
                                        utils.httpGet("/jsbweb/buzCircle.do?type=find&commercialcirclename=adv&pagenum=" + pageIndex, function (resp) {
//                                          $scope.items = resp.data.rows;
                                        });
                                    }

                                    $scope.$on("renderFinished", function ($event, data) {
                                        $(".pagination").pagination($scope.buzcircle.length, {callback: function (pageIndex, context) {
                                            $scope.$apply(function () {
                                                $scope.items = $scope.buzcircle.slice(pageIndex * 6, pageIndex * 6 + 6);
                                            });
                                        }});
                                    });
                                }]
                        }
                    }
                })
                .state('home.buzcircle_edit', {

                    url: '/:path',
                    resolve: resolveDep({
                        files: [
                            'buzcircle/buzCircle.edit.controller'
                        ]},'','buzcircleEditDeps'),
                    views: {
                        'contentPanel_buzcircle': {
                            resolve: {
                                groupData: ['contacts',
                                    function (contacts) {
                                        return contacts.getGroup();
                                    }],
                                buzcircleType: ['utils', function (utils) {
                                    return utils.getCircleType();
                                }]
                            },
                            templateUrl: "base/app/buzCircle/buzCircle.edit.html",
                            controller: 'buzCircleEditCtr'
                        }
                    }
                }
            )

        }
    ]
);
