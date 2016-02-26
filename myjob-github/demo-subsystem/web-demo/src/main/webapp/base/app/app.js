define(['utils/utils-service'], function () {
    var app = angular.module('masgetWebApp', [
        'ui.router', 'oc.lazyLoad', 'masgetWebApp.utils.service','widget.scrollbar', 'ngMessages','ngAnimate'
    ])

        .run(
        [          '$rootScope', '$state', '$stateParams','$ocLazyLoad','utils','$templateCache',
            function ($rootScope, $state, $stateParams,$ocLazyLoad,utils,$templateCache) {

                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
                $rootScope.isLogin = false;

                $rootScope.modulesNamesEnum = {
                    10001: 'buzcircle',
                    10002: 'contacts',
                    10003: 'find',
                    10004: 'my'
                };

                $rootScope.$on('$stateChangeError',function(event,to, toParams, from, fromParams, error){
                    /*console.log({
                        to:to,
                        toParams:toParams,
                        from:from,
                        formParams:fromParams,
                        error:error
                    });*/
                });

                $rootScope.globalUrl = '';
                $rootScope.resourceIconPath = 'upload/images/resources/';
                $rootScope.baseIconPath = 'static/img/base/';
                var loginForm;
                $rootScope.$on('loginSuccess',function(event,data){
                    loginForm = data;
                    utils.query("/jsbweb/commonUtils.do?type=userResource&posresourceid=0&childnodetype=0").then(function(resp) {  // 调用承诺API获取数据 .resolve
                        function trim(s) {
                            return s.replace(/\s/g, '');
                        }

                        function trimWith(s) {
                            return s.replace(/\s/g, '&nbsp;');
                        }
                        $.each(resp.data.rows,function(key,item){
                            item.o_icon = item.o_icon&&trim(item.o_icon);
                            item.resourcename =  item.resourcename&&trimWith(item.o_resourcename);
                        })
                        window.resources = $rootScope.resources = utils.arrayDataToTree(resp.data.rows,'o_osresourceid','o_posresourceid',0,0,{});
                        if($ocLazyLoad.isLoaded('masgetWebApp.home')){
                            var module = angular.module('masgetWebApp.home');
                            $ocLazyLoad._invokeQueue(null, module._configBlocks, 'masgetWebApp.home',true);
                            $state.go('home',{},{reload:true});
                        }else{
                            $ocLazyLoad.load({
                                name: 'masgetWebApp.home',
                                cache: false,
                                reconfig: true,
                                rerun: true,
                                files: ['home/home']
                            }).then(function (data) {
                                if($state.$current.name.indexOf('resetPwd') !=-1||$state.$current.name.indexOf('register') !=-1||$state.$current.name.indexOf('fetchPwd') !=-1){
                                    return;
                                }
                                $state.go('home',{},{reload:true});
                            });
                        }
                    });


                });

                window.addEventListener('message', function(e) {
                    document.querySelector('#casLogin').contentWindow.postMessage($.extend(e.data,loginForm), '*');
                }, false);

                utils.query("/jsbweb/base/getSession.do?xxx=ttt"+utils.parseRequestData({
                    data:'wwww'
                }),{},true).then(function (result) {
                    $rootScope.session = result;
                    $rootScope.$emit('loginSuccess');
                },function(resp){
                    if($state.$current.name.indexOf('resetPwd') !=-1||$state.$current.name.indexOf('register') !=-1||$state.$current.name.indexOf('fetchPwd') !=-1){
                        return;
                    }
                    $state.go("login");
                });

                //alert
                $templateCache.put('alert/alert.tpl.html', '<div><div style="display: inline-block;" class="alert" ng-class="[type ? \'alert-\' + type : null]"><button type="button" class="close" ng-if="dismissable" ng-click="selfClose();" style="position: relative;top:-18px;right:-10px;">&times;</button><strong ng-bind="title"></strong>&nbsp;<span ng-bind-html="content"></span></div></div>');

                //时间格式化
                Date.prototype.Format = function (fmt) { //author: meizz
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
            }
        ]
    ).config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider',
            function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
                $ocLazyLoadProvider.config({
//                    debug:true,
                    loadedModules: ['masgetWebApp'],
                    jsLoader: requirejs //使用requirejs去加载文件

                });

                /**
                 *  路由切换时调用
                 *   @param param.file 懒加载文件数组
                 *   @param tpl 子模块view视图
                 *   @param module 子模块名
                 **/

                window.resolveDep = function (param, module, resolveName) {
                    var result = {};
                    result[resolveName] = ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: module,
                            cache: false,
                            reconfig: false,
                            rerun: false,
                            serie: true,
                            files: param.files
                        }).then(function (data) {
                            return data;
                        });
                    }]
                    return result;
                };

                //可以去掉login模块
                /*----------------开始----------------*/
                $stateProvider.state("login", {
                    url: "/login",
                    resolve: resolveDep({
                        files: [
                            'login/login',
                            'login/login.controller',
                            'login/register.controller',
                            'static/css/base/login-css/login.css'
                        ]}, 'masgetWebApp.login', 'loginModuleDeps'),
                    views: {
                        'main': {
                            templateUrl: 'base/login/login.html',
                            controller: ['$scope', '$state', 'utils', '$rootScope',
                                function ($scope, $state, utils, $rootScope) {
                                    $rootScope.isLogin = false;
                                    $scope.$on('renderFinished', function (event, data) {
                                        $(".login").css("height", document.documentElement.clientHeight);
                                        window.onresize = function () {
                                            $(".login").css("height", document.documentElement.clientHeight);
                                        }
                                    });
                                }]
                        },

                        'login@login': {
                            templateUrl: 'base/login/loginform.html',
                            controller: 'loginCtr'}
                    }
                }).state("login.register", {

                    url: "/register",

                    views: {

                        'login@login': {
                            templateUrl: 'base/login/register.html',
                            resolve: $.extend(resolveDep({
                                files: [
                                    'selectAddress/selectAddress'
                                ]}, '', 'registerControllerDeps'),{pca: ['utils',
                                function (utils) {
                                    return utils.getPca();
                                }],
                                industries: ['utils',
                                    function (utils) {
                                        return utils.getIndustries();
                                    }]}),
                            controller: 'registerCtr'
                        }
                    }
                })

                    .state("login.fetchPwd", {
                        url: "/fetchPwd",
                        views: {
                            'login@login': {

                                templateUrl: 'base/login/fetchPwd.html',
                                controller: ['$scope', '$state', 'utils', '$timeout',
                                    function ($scope, $state, utils, $timeout) {
                                        $scope.sendMail = function () {
                                            var key = $.md5(utils.uuid(32, 16)) + "_" + $scope.email;
                                            var link = window.location.href;
                                            link = link.substring(0, link.lastIndexOf("#") + 1) + "/login/resetPwd?key=" + key
                                            utils.query("/jsbweb/commonUtils.do?type=sendEmailForPwd", {method: "post", type: "post", data: {
                                                mailAddress: $scope.email,
                                                mailTitle: "找回密码通知邮件",
                                                mailContent: "请点击链接<a href=\"" + link + "\">" + link + "<\/a>重置密码",
                                                key: key
                                            }}).then(function (resp) {
                                                $alert('重置密码的邮件已发送！');
                                            });
                                        }
                                    }]
                            }
                        }
                    })

                    .state("login.resetPwd", {
                        url: "/resetPwd",
                        views: {
                            'login@login': {
                                templateUrl: 'base/login/resetPwd.html',
                                controller: ['$scope', '$state', 'utils', '$timeout',
                                    function ($scope, $state, utils, $timeout) {
                                        $scope.submit = function () {
                                            var hash = window.location.hash;
                                            utils.query("/jsbweb/commonUtils.do?type=resetPwd" + utils.parseRequestData({
                                                newpassword: $scope.newPassword,
                                                key: hash.substring(21, hash.length)
                                            })).then(function (resp) {
                                                $alert('密码已经修改,返回登录页面...');
                                                $timeout(function () {
                                                    $state.go("login");
                                                }, 1000)
                                            })
                                        }
                                    }]
                            }
                        }
                    });
                /*----------------结束----------------*/

//                $urlRouterProvider.otherwise('login');
            }]);

    app.bootstrap = function () {
        angular.bootstrap(document, ['masgetWebApp']);
    };
    return app;
})
;
