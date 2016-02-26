angular.module('masgetWebApp.home').controller("mainCtr", ['$scope', '$state', '$rootScope', '$sce', '$timeout', '$popover', '$modal', '$dropdown','utils',
    function ($scope, $state, $rootScope, $sce, $timeout, $popover, $modal, $dropdown, utils) {
        $rootScope.isLogin = true;

        $scope.changeTo = function (event, moduleName) {
            var lastActiveModuleName = currentActiceModuleName;
            if (lastActiveModuleName == moduleName) {
                $timeout(function(){
                    $("#toggleLeftBarBtn_" + moduleName).click();
                })
            } else {
                $(event.currentTarget).parent().addClass("active");
                $(event.currentTarget).parent().siblings().removeClass("active");
                currentActiceModuleName = moduleName;
                currentActiceModulePanel = $(".masget-" + moduleName);
                currentActiceModulePanel.siblings().each(function () {
                    var $that = $(this);
                    if ($that.is(":visible")) {
                        $that.addClass("ng-leave");
                        $that.addClass("ng-leave-active");
                        $timeout(function () {
                            $that.css({display: "none"});
                            $that.removeClass("ng-leave ng-leave-active");
                            currentActiceModulePanel.addClass("ng-enter");
                            currentActiceModulePanel.addClass("ng-enter-active");
                            currentActiceModulePanel.css({display: "block"});
                            $timeout(function () {
                                currentActiceModulePanel.removeClass("ng-enter ng-enter-active");
                            }, 300);
                        }, 300);
                    }
                });
                utils.adaptSize();
                $rootScope.$broadcast("activeModuleChanged", {from: lastActiveModuleName, to: currentActiceModuleName});
            }
        }

        //中转站
        $scope.$on('chatWithSomebody', function (event, data) {
            $scope.$broadcast('pushToBuzCircle', data);
        })

        $scope.$on("pushNewTab.emit", function (event, data) {
            $scope.$broadcast("pushNewTab", data);
        })

        utils.query("/jsbweb/company.do?type=getswitchable").then(function (resp) {
            $scope.stationList = resp.data.rows;
            $scope.switchStation = $scope.stationTreeList = utils.arrayDataToTreeSmarter(resp.data.rows, 'stationid', 'pstationid', {}, 0).rootNodes;
        })

        $scope.$on("renderFinished", function (event, data) {

            var stationDropDown = $dropdown($("#switchStation"), {
                animation: "am-fade-and-slide-bottom",
                placement: "bottom",
                trigger: "manual",
                unbindBodyClick:true,
                html: "true",
                scope: $scope,
                container:"body",
                template: "switchStation.tpl.html",
                prefixevent: "stationDropDown"
            });

            var stationDropDown_t;

            $("#switchStation").unbind().mouseenter(stationDropDown.show).mouseleave(function () {
                stationDropDown_t = setTimeout(stationDropDown.hide, 200);
                stationDropDown.$element.unbind().mouseenter(function () {
                    clearTimeout(stationDropDown_t);
                }).mouseleave(stationDropDown.hide);
            });

            $scope.showAccount = false;
            var accountPopover = $popover($("#accountInfo"), {
                animation:"am-fade-and-slide-bottom",
                html: true,
                scope: $scope,
                placement: "bottom",
                template: "base/app/common/account/account.html",
                trigger: "manual",
                container: "body"
            });

            $("#accountInfo").mouseenter(function(){
                accountPopover.show();
                $scope.showAccount = true;
            }).mouseleave(function () {
                var t = setTimeout(function(){
                    accountPopover.hide();
                    $scope.showAccount = false;
                    $scope.$digest();
                }, 200);
                accountPopover.$element.unbind().mouseenter(function () {
                    clearTimeout(t);
                }).mouseleave(function(){
                    accountPopover.hide();
                    $scope.showAccount = false;
                    $scope.$digest();
                });
            });


            $scope.loginOut = function () {
                accountPopover.hide();
                $modal({html: true, title: "提示", content: "确定要退回登录页面？", template: 'modal/modal.confirm.tpl.html', animation: 'am-fade-and-scale', callback: function () {
                    utils.query("/jsbweb/base/loginOut.do").then(function (resp) {
                        try {
                            $rootScope.chatClient.disconnect();
                        } catch (e) {

                        }
                        $state.go('login');
                    });
                }});
            }

            $scope.resetPwdModel = {};

            var modifyPwdModal;
            $scope.modifyPwd = function () {
                accountPopover.hide();
                $scope.newPwd = "";
                modifyPwdModal = $modal({
                    scope: $scope,
                    html: true,
                    title: '修改密码',
                    contentTemplate: 'modal/modifyPwd.tpl.html'
                });
            }

            $scope.saveNewPwd = function () {
                utils.query("/jsbweb/company.do?type=passwordModify" + utils.parseRequestData({
                    originPwd: $.md5($scope.resetPwdModel.originPwd),
                    newPwd: $.md5($scope.resetPwdModel.newPwd)
                })).then(function (resp) {
                    utils.query("/jsbweb/base/loginOut.do").then(function (resp) {
                        $alert("修改成功");
                        modifyPwdModal.hide();
                        $timeout(function(){
                            $state.go("login");
                        },1000);

                        try {
                            $rootScope.chatClient.disconnect();
                        } catch (e) {

                        }
                        $state.go('login');
                    });
                })
            }


            $scope.toggleState = function ($event) {
                $($event.target).toggleClass("glyphicon-triangle-bottom");
            }

            $scope.searchStation = function (event) {
                event.stopPropagation();
            }

            $scope.stationSelected = function (item) {
                if (item.stationid == $scope.session.stationid) return;
                $modal({html: true, title: "提示", content: "确定要切换到站点--" + item.stationname, template: 'modal/modal.confirm.tpl.html', animation: 'am-fade-and-scale', callback: function () {
                    utils.query("/jsbweb/company.do?type=switch&newstationid=" + item.stationid + "&newstationname=" + item.stationname).then(function (resp) {
                        utils.query("/jsbweb/base/setSession.do", {method: "post", data: {session: JSON.stringify($.extend($scope.session, {stationname: resp.data.stationname, stationid: resp.data.stationid}))}}).then(function (resp) {
                            $state.go('home', {}, {reload: true});
                            $timeout(function () {
                                $alert("您已切换至站点 -- " + item.stationname);
                            })
                        });
                    });
                }});
            }

            $scope.$on('stationDropDown.show', function () {
                $scope.stationSearchInput = "";
                var searchPopover = $popover($("#stationSearchInput"), {contentTemplate: 'popover/station.searchResult.tpl.html', scope: $scope, html: true, placement: "bottom", trigger: "manual", container: "body"});

            });

            $scope.$watch('stationSearchInput', function (newVal, oldVal) {
                if(newVal){
                    $scope.switchStation = $.grep($scope.stationList,function(item){
                        if(item.stationname.indexOf(newVal)!=-1) return true;
                    })
                }else{
                    $scope.switchStation = $scope.stationTreeList;
                }
            });

             var fullScreen = function(){
                 var docElm = document.documentElement;
                 //W3C
                 if (docElm.requestFullscreen) {

                     docElm.requestFullscreen();

                 }
                 //FireFox
                 else if (docElm.mozRequestFullScreen) {

                     docElm.mozRequestFullScreen();

                 }
                 //Chrome等
                 else if (docElm.webkitRequestFullScreen) {

                     docElm.webkitRequestFullScreen();

                 }
                 //IE11
                 else if (elem.msRequestFullscreen) {

                     elem.msRequestFullscreen();

                 }
             }

            var exitFullScreen = function(){
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else if (document.msRequestExitFullscreen) {
                    document.msRequestExitFullscreen();
                }
            }

            var isFullScreen = false;

            $scope.fullScreen = function(){
                if(!isFullScreen){
                    fullScreen();
                    isFullScreen  = true;
                }else{
                    exitFullScreen();
                    isFullScreen  = false;
                }
            }

            $.each($scope.resources,function(key,item){
                item.icon = item.o_icon;
            })

            $scope.ngMouseover = function(resource){
                resource.icon = resource.o_icon;
            }

            $scope.ngMouseleave = function(resource){
                resource.icon = resource.o_icon;
            }

            $timeout(function(){
                if(currentActiceModuleName == 'my'){
                    initModuleSetup(currentActiceModuleName);
                }else{
                    $state.go("home.schedule");
                };
                adaptSize(["leftbar", "contentPanel"]);
            });

            function adaptSize(objIds) {
                //处理参数
                var idArrays = []
                if ($.isArray(objIds)) {
                    idArrays = objIds;
                } else {
                    idArrays.push(objIds);
                }

                //开始调整高度和宽度
                var sidebar;
                var contactsPanel;
                var contentPanel;
                var leftBarModule;
                var leftBarWidth = $("#leftbar").is(":visible")?60:0;

                $("#contentPanel").css("marginLeft",leftBarWidth+"px");
                function setHeight() {
                    var clientHeight = document.documentElement.clientHeight -56;
                    for (var i = 0; i < idArrays.length; i++) {
                        sidebar = document.getElementById(idArrays[i]);
                        if (sidebar && sidebar.length != 0)
                            sidebar.style.height = clientHeight + 'px';
                    }

                    contactsPanel = document.getElementById("contactsPanel_" + currentActiceModuleName);
                    contentPanel = document.getElementById("contentPanelInner_" + currentActiceModuleName);
                    if (contactsPanel && contactsPanel.length != 0) {
                        if (currentActiceModuleName == "my")
                            contactsPanel.style.height = clientHeight + "px";
                        else if (currentActiceModuleName == "mgchat" || currentActiceModuleName == "buzcircle" || currentActiceModuleName == "contacts")
                            contactsPanel.style.height = (clientHeight - 55) + "px";
                        else
                            contactsPanel.style.height = (clientHeight - 90) + "px";
                    }
                    if (contentPanel && contentPanel.length != 0) {
                        contentPanel.style.height = clientHeight + "px";
                    }
                    if (currentActiceModuleName == "my") {
                        var myContentPanelWrapper = document.getElementById("contentPanelWrapper_my");
                        myContentPanelWrapper&&(myContentPanelWrapper.style.height = (clientHeight - $("#contentPanelBar_my")[0].offsetHeight) + "px");
                    }
                }

                function setWidth() {
                    var clientWidth = document.body.clientWidth;
                    var count = $("#toggleLeftBarBtn_" + currentActiceModuleName).data("count");
                    contentPanel = document.getElementById("contentPanelInner_" + currentActiceModuleName);
                    leftBarModule =  $("#" + currentActiceModuleName + "LeftBar");
                    if (contentPanel)
                        if (count == undefined || count % 2 == 0) {
                            if (currentActiceModuleName == "contacts") {
                                contentPanel.style.width = (clientWidth - 260 - leftBarWidth) + "px";
                            } else {
                                contentPanel.style.width = (clientWidth - 180 - leftBarWidth) + "px";
                            }
                        }
                        else {
                            contentPanel.style.width = (clientWidth - leftBarWidth) + "px";
                        }
                }

                function setMesHeight() {
                    if ($(".chat01_content").length != 0)
                        $(".chat01_content").css("height", (document.documentElement.clientHeight - 231) + "px");
                }

                setHeight();

                window.onresize = function () {
                    setHeight();
                    setWidth();
                    $("#find_list").css("height", (document.documentElement.clientHeight - 64) + "px");
                    if (chatShowed)
                        setMesHeight();
                }
            }

        });

        function initModuleSetup(moduleName){
            currentActiceModulePanel = $(".masget-" + moduleName);
            currentActiceModulePanel.siblings().each(function () {
                var $that = $(this);
                if ($that.is(":visible")) {
                    $that.addClass("ng-leave");
                    $that.addClass("ng-leave-active");
                    $timeout(function () {
                        $that.css({display: "none"});
                        $that.removeClass("ng-leave ng-leave-active");
                        currentActiceModulePanel.addClass("ng-enter");
                        currentActiceModulePanel.addClass("ng-enter-active");
                        currentActiceModulePanel.css({display: "block"});
                        $timeout(function () {
                            currentActiceModulePanel.removeClass("ng-enter ng-enter-active");
                        }, 300);
                    }, 300);
                }
            });
            utils.adaptSize();
            $rootScope.$broadcast("activeModuleChanged", {from: moduleName, to: currentActiceModuleName});
        }

        if($scope.resources.length == 1&&$scope.resources[0].o_resourceid === 10004){
            currentActiceModuleName = 'my';
            $timeout(function(){
                initModuleSetup('my');
            })
        }
    }
]);