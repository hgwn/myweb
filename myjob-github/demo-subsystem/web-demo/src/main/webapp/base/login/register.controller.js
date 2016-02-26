angular.module('masgetWebApp.login').controller('registerCtr',['$scope', '$state','utils', 'pca', 'industries',
    function ($scope, $state,utils, pca, industries) {

        $scope.formInvalid = true;
        $scope.selectedCompanyType = "";
        $scope.companytype = utils.companytype;
        $scope.registerModel = {validationnum:""};


        $scope.industries = industries;
        $scope.companytypes = [];

        $scope.$watch(function () {
            return $scope.registerModel.industryid
        }, function (newValue, oldValue) {
            if (newValue != oldValue)
                utils.httpGet("/jsbweb/commonUtils.do?type=companytype&industryid=" + newValue, function (resp) {
                    $scope.companytypes = resp.data.rows;
                })
        });

        $scope.$watch(function(){
            return $scope.registerModel.validationnum;
        },function(newValue,oldValue){
            if(typeof newValue == "string"&&newValue.length == 4){
            }
        });

        //注册
        $scope.register = function () {
            var username_json = {};
            username_json.loginname = $scope.registerModel.username;
            var data = {};
            data.data = JSON.stringify(username_json);
            utils.query('base/findLoginName.do', {
                method: "POST",
                data: data,
                dataType: 'jsonp'
            }).then(function (result) {
                var data = result.data;
                if (result.ret == 0 && !data.isExist) {
                    registerUser();
                } else {
                    //已存在用户
                    $alert('该手机号码已经注册过了');
                }
            });
        }
//注册
        function registerUser() {
            if ($scope.registerModel.validationnum == "") {
                $alert('请输入验证码!');
                return;
            }

            var pcaIds = $scope.registerModel.addressids.split("&");
            var pcaNames = $scope.registerModel.pca.split(" ");
            if(pcaIds.length == 3){
                $scope.registerModel.provinceid = pcaIds[0];
                $scope.registerModel.cityid = pcaIds[1];
                $scope.registerModel.areaid = pcaIds[2]
            }

            if(pcaNames.length == 3){
                $scope.registerModel.provincename = pcaNames[0];
                $scope.registerModel.cityname = pcaNames[1];
                $scope.registerModel.areaname = pcaNames[2]
            }

            var json = {};
            json.companytypeid = $scope.registerModel.companytype;
            json.companyname = $scope.registerModel.companyname;
            json.industryid = $scope.registerModel.industryid;
            json.faxnumber = $scope.registerModel.faxnumber;
            json.phone = $scope.registerModel.phone;
            json.provinceid = $scope.registerModel.provinceid;
            json.cityid = $scope.registerModel.cityid;
            json.areaid = $scope.registerModel.areaid;
            json.address = $scope.registerModel.address;
            json.introduction = $scope.registerModel.introduction;

            json.mobilephone = $scope.registerModel.username;
            json.loginpwd = $.md5($scope.registerModel.password);
            json.validationnum = $scope.registerModel.validationnum;

            var data = {};
            data.data = JSON.stringify(json);

            utils.query("base/register.do", {
                type: "POST",
                data: data,
                dataType: "jsonp"
            }).then(function (result) {
                if (result.ret == 0) {
                    $state.go("login");
                    $alert('注册成功！');
                } else {
                    $alert('注册失败！');
                }
            });


        }

        var timer;//timer变量，控制时间
        var count_time = 60; //间隔函数，1秒执行
        var cur_time;//当前剩余秒数
        //发短信
        $scope.send_SMS = function(){
            if($scope.formInvalid){
                $alert('注册信息填写不正确，请核实！');
                return;
            }
            cur_time = count_time;
            //手机验证是否已存在
            var username_json = {};
            username_json.loginname = $scope.registerModel.username;
            var data = {};
            data.data = JSON.stringify(username_json);
            $.ajax({
                type: "POST",
                url: 'base/findLoginName.do',
                data: data,
                dataType: 'jsonp',
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("验证接口出错")
                },
                success: function (result) {
                    var data = result.data;
                    if (!data.isExist) {
                        to_sms();
                    } else {
                        $alert('该手机号码已经注册过了');
                    }
                }
            });
        }
        //发短信
        function to_sms(username) {
            // 向后台发送处理数据
            var json = {};
            json.mobilephone = $scope.registerModel.username;//手机号码
            json.loginname = $scope.registerModel.username;//手机号码
            var data = {};
            data.data = JSON.stringify(json);
            $.ajax({
                type: "POST",
                url: "base/sendSMS.do",
                data: data,
                dataType: "jsonp",
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log("接口查询失败！")
                },
                success: function (result) {
                    if (result.ret == 10 || result.ret == 12) {
                        $alert('短信发送失败！');
                    } else {
                        $alert('短信已经发送成功，请查收!');
                        // 设置button效果，开始计时
                        $("#send_sms").attr("disabled", "true");
                        $("#send_sms").val("请在" + cur_time + "秒内输入验证码");
                        startTimes(); // 启动计时器，1秒执行一次
                    }
                }
            });
        }
        //启动跳转的定时器
        function startTimes() {
            timer = window.setInterval(showSecondes, 1000);
        }
        function showSecondes() {
            if (cur_time > 0) {
                cur_time--;
                $("#send_sms").text("请在" + cur_time + "秒内输入验证码");//"请在" + i + "秒内输入验证码"
                $("#send_sms").attr("disabled", "true");
            } else {
                $("#send_sms").text("获取验证码");
                $("#send_sms").removeAttr("disabled");
                window.clearInterval(timer);
            }
        }
    }])