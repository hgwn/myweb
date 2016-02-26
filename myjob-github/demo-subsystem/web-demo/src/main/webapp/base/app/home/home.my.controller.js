angular.module('masgetWebApp.home').controller('myCtr', ['$scope', '$state', 'utils', '$timeout', '$dropdown', '$sce', '$ocLazyLoad','$q',
    function ($scope, $state, utils, $timeout, $dropdown, $sce, $ocLazyLoad,$q) {
        //根据是否点击'钱包'这个功能来是否显示package Div,用packageStatus来作为标志
        $scope.packageStatus = true;
        $scope.multiRes = [];
        $scope.myRes = [];

        $scope.activeStyle = {
            backgroundColor: "#428bca",
            color: "#ffffff"
        }

        $scope.tabClick = function (tab) {
            $timeout(function () {
            });
        }

        $.each($scope.resources, function (key, item) {
            if (item.hasOwnProperty("o_resourceid") && item["o_resourceid"] == 10004) {
                $scope.myResources = item.nodes;
                return false;
            }
        });

        $.each($scope.myResources, function (key, item) {
            item.hover = false;
            switch (item.o_childnodetype) {
                case 101:
                case 201:
                    $scope.multiRes.push(item);
                    break;
                case 100:
                case 102:
                case 202:
                    $scope.myRes.push(item);
                    break;
            }
        });

        //tab导航
        $scope.tabs = [];

        $scope.isLoading = false;

        $scope.switchPanel = function (index) {
            $("#contentPanelWrapper_my").children().each(function () {
                var $this = $(this)
                if (index == $this.data("index")) {
                    $this.siblings().each(function () {
                        var $that = $(this);
                        if ($that.is(":visible")) {
                            $that.addClass("ng-leave");
                            $that.addClass("ng-leave-active");
                            $timeout(function () {
                                $that.css({display: "none"});
                                $that.removeClass("ng-leave ng-leave-active");
                                $this.addClass("ng-enter");
                                $this.addClass("ng-enter-active");
                                $this.css({display: "block"});
                                $timeout(function () {
                                    $this.removeClass("ng-enter ng-enter-active");
                                }, 300);
                            }, 300);
                        }
                    });
                }
            });
        };

        var removeTagHandler = function () {
            var index = $(this).prev().data("index");
            if ($(this).parent().hasClass("active")) {
                if ($(this).parent().prev().length > 0) {
                    $(this).parent().prev().children(":first").click();
                } else {
                    $(this).parent().next().children(":first").click();
                }
            }

            $.each($scope.tabs, function (key, item) {
                if (item.index == index)
                    $scope.$apply(function () {
                        $scope.tabs = $scope.tabs.slice(0, key).concat($scope.tabs.slice(key + 1, $scope.tabs.length));
                    })
            });

            $("#contentPanelWrapper_my").children().each(function () {
                if (index == $(this).data("index")) {
                    $(this).remove();
                }
            });

            $("#contactsPanel_my .target").each(function () {
                if (index == $(this).data("index")) {
                    $(this).data("isloaded", false);
                    $(this).data("index", -1);
                }
            })
        }

        $scope.$on('$viewContentLoaded',function(event,element){
            if(element.attr("ui-view") == "contentPanel_my")
                defer.resolve();
        });

        $scope.$on('$stateChangeError',function(event,to, toParams, from, fromParams, error){
           throw(error);
        });

        var defer;

        $scope.pushTab = function (target, type, item, render) {
           if (type == "html") {
               var isExists = false;
               $.each($scope.tabs,function(key,tab) {
                   if (tab.o_resourceid == item.o_resourceid) {
                       isExists =true;
                       $("#contentPanelInner_my ul a").each(function () {
                           if ($(this).data("index") == item.index) {
                               $scope.switchTab(item);
                               $scope.switchPanel(item.index);

                               return false;
                           }
                       });
                       return false;
                   }
               });
               if(isExists){
                   $scope.isLoading = false;
                   return;
               }

                $scope.tabs.push(item);
                render && render();

                defer = $q.defer();
                defer.promise.then(function(){
                    $timeout(function(){
                        //第一次渲染会延迟执行

                        var currentTab = $("#contentPanelInner_my ul a:last");
                        var removeTag = $("#contentPanelInner_my ul span:last");
                        var index = 0;
                        var currentTabPane = null;
                        var firstTime = true;
                        if (currentTab.parent().parent().children().length > 1) {
                            index = currentTab.parent().prev().children(":first").data("index")
                            currentTab.data("index", ++index);
                            currentTab.attr("id", index);
                        } else {
                            currentTab.data("index", 0);
                            currentTab.attr("id", 0);
                        }
                        $scope.tabs[$scope.tabs.length - 1].index = index;
                        //声明该菜单已经被打开,并绑定索引值
                        $(target).data({"isloaded": true, "index": index});
                        $(target).attr("id", index);

                        currentTab.click(function (e) {
                            $scope.switchTab(item);
                            if (e.isTrigger) {
                                if (firstTime) {
                                    firstTime = false;
                                    return;
                                }
                                $scope.switchPanel(index);
                            } else {
                                var isFromLeftBar = false;
                                $("#contactsPanel_my .list-group-item a").each(function () {
                                    if ($(this).data("index") == index) {
                                        $(this).trigger("click");
                                        $scope.$broadcast("autoScroll", {element: $(this)});
                                        isFromLeftBar = true;
                                    }
                                });
                                !isFromLeftBar && $scope.switchPanel(index);
                            }
                        });

                        if ($scope.isLoading) {
                            $timeout(function () {
                                removeTag.click(removeTagHandler);
                                currentTabPane = $("#contentPanelWrapper_my").children(":first");
                                currentTabPane.siblings().css({display: "none"});
                                currentTabPane.data("index", index);
                                currentTabPane.attr("id", index);
                                $scope.isLoading = false;
                                currentTab.trigger("click");
                            }, 50);
                        }
                    })
                });
            }
        };

        $scope.switchTab = function(item){
            $.each($scope.tabs,function(key,tab){
                tab.tabActive = false;
            });
            item.tabActive = true;
        }

        $scope.group = function (event, item, index) {
            if ($scope.isLoading) return;

            //二级导航通过id定位到具体的某一项
            var $target = $(event.currentTarget);
            //如果childnodetype为0,则直接显示地址为o_weburl的网页
            if (item.o_childnodetype % 100 == 0 && !$target.data("isloaded")) {
                $scope.pushTab($target, "html", item, function () {
                    $state.go('home.my_view', {path: utils.uuid(4, 16)});
                    $state.broadCast = {src: item.o_weburl}
                });
                $scope.isLoading = true;
            } else if (item.o_childnodetype % 100 == 2 && !$target.data("isloaded")) {
                $scope.pushTab($target, "html", item, function () {
                    $state.go('home.my_detail', {path: utils.uuid(4, 16)});
                    $state.broadCast = {item: item.nodes};
                });
                $scope.isLoading = true;
            } else {
                $("#contentPanelInner_my ul a").each(function () {
                    if ($(this).data("index") == $target.data("index")) {
                        $(this).trigger("click");
                        return false;
                    }
                });
            }

            $.each($scope.myRes, function (key, _item) {
                _item.isActive = false;
            });

            $.each($scope.multiRes, function (key, _item) {
                $.each(_item.nodes, function (key, __item) {
                    __item.isActive = false;
                })
            });

            item.isActive = true;

            $timeout(function () {
                $scope.$digest();
            })
        };
        //package折叠状态开关
        $scope.packageToggleState = "折叠";
        $scope.packageFlag = false;

        $scope.packageToggle = function () {
            $scope.packageFlag = !$scope.packageFlag;
            $scope.packageToggleState = $scope.packageFlag ? "展开" : "折叠";
        };

        var currentDropDown = null;
        $scope.showRightMenu = function (event) {
            if (currentDropDown) currentDropDown.destroy();
            currentDropDown = $dropdown($(event.currentTarget), {
                trigger: "manual",
                template: "tabs/contextMenu.tpl.html",
                container: "body",
                show: true,
                html: true,
                scope: $scope
            });
        }

        $scope.removeTab = function (scope) {
            $timeout(function () {
                scope.$element.element.children(":last").click();
            })
        }

        $scope.removeOtherTabs = function (scope) {
            $timeout(function () {
                scope.$element.element.siblings().each(function () {
                    $(this).children(":last").click();
                })
            });
        }
        $scope.removeAllTabs = function (scope) {
            $timeout(function () {
                scope.$element.element.parent().children().each(function () {
                    $(this).children(":last").click();
                })
            });
        }

        $scope.content = [
            {
                "text": $sce.trustAsHtml("关闭此标签页"),
                "click": "removeTab(this);"
            },
            {
                "divider": true
            },
            {
                "text": $sce.trustAsHtml("关闭其他标签页"),
                "click": "removeOtherTabs(this);"
            },
            {
                "divider": true
            },
            {
                "text": $sce.trustAsHtml("关闭全部标签页"),
                "click": "removeAllTabs(this);"
            }
        ];

        $scope.$on("pushNewTab", function (event, data) {
            $scope.pushTab(this, "html", {o_resourceid:utils.uuid(10,16),o_resourcename: data.resourcename}, function () {
                $scope.changeTo({target: $("#leftbar ul li a:last")}, 'my');
                $state.go('home.my_view', {path: utils.uuid(4, 16)});
                $state.broadCast = {src: data.weburl};
            })
        });

        window.pushTab = function (title, url) {
            $scope.pushTab(this, "html", {o_resourceid:utils.uuid(10,16),o_resourcename: title}, function () {
                $state.go('home.my_view', {path: utils.uuid(4, 16)});
                $state.broadCast = {src: url};
            })
            $scope.isLoading = true;
        };

        $scope.state = false;

        $scope.hideMenu = function () {
            $timeout(function () {
                $("#toggleLeftBarBtn_" + currentActiceModuleName).click();
                $scope.state = toggleStates['my'];
                $scope.$digest();
            });
        }
        
        //我的默认导航页面
           //我的默认导航页面
         $scope.flowconfig = {
        		dwzz: {"name": "对外中转", "url": ""},
	    		fc: {"name": "发车管理", "url": "logistic/stowageLoading/stowage.index.html#/list"},
	    		ffsk: {"name": "货款管理", "url": "logistic/paymentmanagement/payment.html#/list"},
	    		flzc: {"name": "分炼装车", "url": ""},
	    		dhk: {"name": "到货库", "url": ""},
	    		sh: {"name": "送货", "url": ""},
	    		fhd: {"name": "返回单", "url": ""},
	    		jc: {"name": "接车管理", "url": "logistic/arrivalConfirmation/arrival.index.html#/list"},
	    		sjk: {"name": "上门提货", "url": "logistic/fetchorder/fetchorder.index.html#/list"},
	    		sjkd: {"name": "收件开单", "url": "logistic/std_consignnote/consignnote.html#/add"},
	    		wsjd: {"name": "网上接单", "url": "logistic/std_consignnote/consignnote.html#/selectData"},
	    		ydjs: {"name": "还款管理", "url": "logistic/orderchargetypeRepay/orderchargetypeRepay.html#/list"},
	    		xjls: {"name": "支付流水", "url": "logistic/paymentjournal/paymentjournal.html#/list"},
	    		 zzdd: {"name": "中转订单", "url": "logistic/epilobybill/epilobybill.html#/list"},
	    		 zzk: {"name": "中转库", "url": "logistic/epilobybill/epilobybill.html#/list"}
	    }
	    $scope.goUrl=function(state) {
	        top.pushTab( $scope.flowconfig[state].name,  $scope.flowconfig[state].url)
	    }
    }])