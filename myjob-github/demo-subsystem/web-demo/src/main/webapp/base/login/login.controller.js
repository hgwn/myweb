angular.module('masgetWebApp.login').controller('loginCtr', ['$scope', '$state', 'utils', '$rootScope',
        function ($scope, $state, utils, $rootScope) {
            $scope.formValidated = false;
            $scope.codeValidation = false;
            $scope.showCode = false;
            $scope.loginModel = {};
            $scope.logining = false;

            $scope.$on("renderFinished", function (event, data) {

                if (data.type == "login") return;

                if (!CookieEnable()) {
                    //alert("开启Cookie之后才能登录！");
                    $("#login_error").html("开启Cookie之后才能登录！").css("color", "red");
                }

                var json = {};
                json.code = $scope.loginModel.code;

                var data = {};
                data.data = JSON.stringify(json);
                $.ajax({
                    type: "POST",
                    method: "POST",
                    url: "/jsbweb/base/appearImageCode.do",
                    data: data,
                    dataType: "jsonp",
                    error: function (jqXHR, textStatus, errorThrown) {
                    },
                    success: function (result) {
                        if (result.ret == 10) {//出现
                            document.getElementById("imgVcode").src = "base/findImageCode.do?dt="
                                + Math.random();
                            $scope.$apply(function () {
                                $scope.showCode = true;
                            })
                        }
                    }
                });

                function CookieEnable() {
                    var result = false;
                    if (navigator.cookiesEnabled) {
                        return true;
                    }
                    document.cookie = "testcookie=yes;";
                    var cookieSet = document.cookie;
                    if (cookieSet.indexOf("testcookie=yes") > -1) {
                        result = true;
                    }
                    document.cookie = "";
                    return result;
                }

            });

            $scope.$watch(function () {
                return $scope.loginModel.code;
            }, function (newValue, oldValue) {
                if (typeof newValue == "string" && newValue.length == 4)
                    utils.query("/jsbweb/base/codeValidation.do?code=" + $scope.loginModel.code).then(function (resp) {
                        if (resp.ret == 0) {
                            $scope.codeValidation = true;
                        }
                    })
                else {
                    $scope.codeValidation = false;
                }
            })

            function enterLogin() {
                document.onkeyup = function (e) {
                    if ($("#loginBtn").attr("disabled") == "disabled") return;
                    if (e.keyCode == 13 && $state.$current.name == "login") {
                        $scope.mylogin();
                    }
                };
            }

            enterLogin();
            $scope.mylogin = function (event) {
                if ($scope.showCode && !$scope.codeValidation) {
                    $alert('请输入正确的验证码！');
                    return;
                }
                document.onkeyup = null;
                $scope.logining = true;
                var json = {};
                json.loginname = $scope.loginModel.username;
                json.loginpwd = $.md5($scope.loginModel.password);
                json.devicename = "pc";
                json.devicetype = 1;
                json.code = $scope.loginModel.code;
                //json.JSESSIONID = "abc";

                var data = {};
                data.data = JSON.stringify(json);
                utils.query("/jsbweb/base/login.do", {
                    type: "POST",
                    method: "POST",
                    data: data,
                    dataType: "jsonp"
                }).then(function (result) {
                    $rootScope.session = result;
                    $scope.$emit('loginSuccess',$scope.loginModel);
                }, function (result) {
                    //登录错误
                    document.getElementById("imgVcode").src = "base/findImageCode.do?dt="
                        + Math.random();
                    $scope.codeValidation = false;
                    $scope.showCode = true;
                    $scope.logining = false;
                });

            };

            $scope.register = function () {

                $state.go("register");

            };

            $scope.resetPwd = function () {

                $state.go("reset");

            };
        }]
);