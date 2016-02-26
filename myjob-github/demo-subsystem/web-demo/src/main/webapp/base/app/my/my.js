angular.module('masgetWebApp.my', [
    'ui.router'
])
    .config(
    ['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home.my_detail', {
                url: '/:path',
                views: {
                    'contentPanel_my': {
                        templateUrl: 'base/app/my/my.detail.html',
                        controller: ['$scope', '$state', 'utils','$ocLazyLoad',
                            function ($scope, $state, utils,$ocLazyLoad) {
                                $scope.packageStatus = true;
                                if ($state.broadCast && angular.isArray($state.broadCast.item))
                                    $scope.items = $state.broadCast.item;
                                else
                                    $scope.items = [];
                                $scope.toggle = function (osresourceid) {
                                    //设置'折叠'、'展开'显示操作状态
                                    $.each($scope.items, function (key, item) {
                                        if (item.o_osresourceid == osresourceid)
                                            item.isfold = !item.isfold;
                                    })
                                };
                                //针对第三级页面按钮的方法定义
                                $scope.packageClick = function (item) {
                                    if(!item.o_weburl){
                                        $alert('该功能模块尚处于研发阶段');
                                        return;
                                    }

                                    $scope.$parent.isLoading = true;

                                    if(item.o_resourcename == '工作流配置'){
                                            $ocLazyLoad.load({
                                            name: 'masgetWebApp.workflow',
                                            cache: true,
                                            reconfig: false,
                                            rerun: false,
                                            serie: true,
                                            files: [
                                                'angularUiGrid/ui-grid',
                                                'static/js/plugins/angular.plugins/angular-ui-grid/ui-grid.min.css',
                                                'workflow/app',
                                                'static/css/base/workflow.css'
                                            ]}).then(function (data) {
                                            $scope.pushTab(this, "html", item, function () {
                                                $state.go('home.workflow.list', {path: utils.uuid(4, 16)});
                                            });
                                        });
                                        /*$ocLazyLoad.load({
                                            name: 'masgetWebApp.scheduleManage',
                                            cache: true,
                                            reconfig: false,
                                            rerun: false,
                                            serie: true,
                                            files: [
                                                'angularUiGrid/ui-grid',
                                                'static/js/plugins/angular.plugins/angular-ui-grid/ui-grid.min.css',
                                                'scheduleManage/app',
                                                'static/css/base/scheduleManage.css'
                                            ]}).then(function (data) {
                                            $scope.pushTab(this, "html", item, function () {
                                                $state.go('home.scheduleManage.list', {path: utils.uuid(4, 16)});
                                            });
                                        });*/
/*
                                        $ocLazyLoad.load({
                                            name: 'masgetWebApp.accountCheck',
                                            cache: true,
                                            reconfig: false,
                                            rerun: false,
                                            serie: true,
                                            files: [
                                                'accountCheck/app'
                                            ]}).then(function (data) {
                                            $scope.pushTab(this, "html", item, function () {
                                                var path = utils.uuid(4, 16);
                                                console.log(path);
                                                $state.go('home.accountCheck.check', {path: path});
                                            });
                                        },function(err){
                                            console.log(err);
                                            $scope.$parent.isLoading = false;
                                       });
*/
                                    }else if(item.modulename){
                                        $ocLazyLoad.load({
                                            name: item.modulename,
                                            cache: true,
                                            reconfig: false,
                                            rerun: false,
                                            serie: true,
                                            files: item.filedeps.split(',')
                                        }).then(function (data) {
                                            $scope.pushTab(this, "html", item, function () {
                                                $state.go(item.initstate, {path: utils.uuid(4, 16)});
                                            });
                                        },function(err){
                                            console.log(err);
                                            $scope.$parent.isLoading = false;
                                        });
                                    }else{
                                        $scope.pushTab(this, "html", item, function () {
                                            $state.go('home.my_view', {path: utils.uuid(4, 16)});
                                            $state.broadCast = {src: item.o_weburl}
                                        });
                                    }

                                };
                                //迭代给第三级页面的每个模块增加折叠、展开状态控制标志
                                angular.forEach($scope.items, function (data, index, array) {
                                    $scope.items[index].isfold = false;
                                    $scope.items[index].children = data.nodes;
                                });

                            }]
                    }
                }
            })
            .state('home.my_view', {
                url: '/:path',
                views: {
                    'contentPanel_my': {
                        templateProvider: ['$stateParams',
                            function ($stateParams) {
                                return '<iframe src="{{pathUrl}}" width="100%" height="100%" frameborder="0" on-finish-render-filters="contentPanel_my_iframe"></iframe>';
                            }],
                        controller: ['$scope', '$stateParams', '$state', '$sce', 'utils',
                            function ($scope, $stateParams, $state, $sce, utils) {
                                $scope.pathUrl = $state.broadCast ? $sce.trustAsResourceUrl($state.broadCast.src) : "";
                                $scope.$on("$viewContentLoaded", function (event, element) {
                                	
                                    if (utils.getBrowser() == "Firefox")
                                      //  element.children(":first").css("height", element[0].offsetHeight-navHeight + "px");
                                      element.children(":first").css("height", $(window).height()-$(".masget-titleBar").height()-38+ "px");
	                                   $(window).resize(function(){
	                                       element.children(":first").css("height", $(window).height()-$(".masget-titleBar").height()-38+ "px");
	
	                                   })
                                })
                            }]
                    }
                }
            });
    }]);