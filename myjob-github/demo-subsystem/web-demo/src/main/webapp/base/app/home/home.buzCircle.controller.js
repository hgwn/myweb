angular.module('masgetWebApp.home').controller('buzCircleCtr', ['$scope', '$state', '$popover', '$sce', '$timeout','listData', 'utils', '$modal', '$alert', 'Upload', 'mgchat',
    function ($scope, $state, $popover, $sce,$timeout, listData, utils, $modal, $alert, Upload, mgchat) {

        $scope.buzcircle = listData;

        $.each($scope.buzcircle, function (key, item) {
            item.msgNum = 0;
            if (item.staffid == $scope.session.staffid) {
                item.isGrouper = true;
            } else {
                item.isGrouper = false;
            }
        });

        $scope.upload = function (files, item) {
            $scope.openFile = true;
            if (item.staffid != $scope.session.staffid) {
                $alert({title: '提示：', content: '只有商圈群主才能替换图标', placement: 'masget-top', duration: 1, type: 'info', show: true});
                $scope.openFile = false;
                return;
            }
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    Upload.upload({
                        url: '/jsbweb/base/fileUpload.do',
                        fields: {'username': $scope.username},
                        file: file
                    }).progress(function (evt) {

                    }).success(function (data, status, headers, config) {
                        var formData = {
                            commercialcircleid: item.commercialcircleid,
                            commercialicon: data.data.file.substring(39)
                        }

                        utils.query("/jsbweb/buzCircle.do?type=modify&formData=" + JSON.stringify(formData)).then(function (resp) {
                            if (resp.ret == 0) {
                                $alert({title: '提示：', content: '商圈图标已经成功替换', placement: 'masget-top', duration: 1, type: 'info', show: true});
                            } else {
                                $alert({title: '提示：', content: '替换失败', placement: 'masget-top', duration: 1, type: 'info', show: true});
                            }
                        });

                    });
                }
            }
        };

        $scope.group = function (item, index) {

            item.isActive = true;
            item.msgNum = 0;

            if (item.isChat) {
                $.each($scope.buzcircle, function (key, _item) {
                    _item.isActive = false;
                });
                $.each($scope.chatItems, function (key, _item) {
                    if (key != index) {
                        _item.isActive = false;
                    }
                });
            } else {
                $.each($scope.buzcircle, function (key, _item) {
                    if (key != index) {
                        _item.isActive = false;
                    }
                });
                $.each($scope.chatItems, function (key, _item) {
                    _item.isActive = false;
                });
            }

            if (!item.isChat) {
                $state.go('home.mgchat', {path: item.commercialcircleid});
                $state.broadCast = {
                    receiver: {
                        title: item.isGrouper ? "所有成员" : item.staffname,
                        receiverid: item.isGrouper? item.commercialcircleid : item.staffid,
                        receiverName: item.staffname
                    },
                    buzCircleInfo: item,
                    isGrouper: item.isGrouper
                };
            } else {
                $state.go('home.mgchat', {path: item.contactid});

                if (item.isSchedule) {
                    $state.broadCast = {
                        receiver: {
                            title: item.contactname,
                            receiverid: item.contactid,
                            receiverName: item.contactname
                        },
                        isGrouper: false,
                        isSchedule: true,
                        src: item.src
                    };
                } else {
                    $state.broadCast = {
                        receiver: {
                            title: item.contactname,
                            receiverid: item.contactid,
                            receiverName: item.contactname
                        },
                        isGrouper: false
                    };
                }
            }
        };

        $scope.toggleState = "折叠";
        $scope.showAdd = false;
        $scope.toggle = function () {
            $scope.showAdd = !$scope.showAdd;
            $scope.toggleState = $scope.add ? "展开" : "折叠";
        };


        $scope.addBuzCircle = function () {
            $state.go("home.buzcircle_edit", {path: "add"}, {});
            $state.broadCast = {type: "add"};
        };

        $scope.findBuzCircle = function () {
            $state.go("home.buzcircle_find", {path: "find"}, {});
        };

        $scope.backToContacts = function () {
            $state.go("contacts");
        };

        $scope.buzcircleMenuButtonClick = function (target, type, item) {
            if (type == "modify") {
                $state.go('home.buzcircle_group', {path: item.commercialcircleid});
                $state.broadCast = {
                    buzCircleInfo: item
                };
            } else if (type == "detail") {

            } else if (type == "modifyName") {
                $scope.nickName = item.commercialcirclename;
                $modal({callback: function (element, msg) {
                    var params = {
                        commercialcircleid: item.commercialcircleid,
                        commercialcirclename: $("#modifyName").val()
                    };
                    utils.httpGet("/jsbweb/buzCircle.do?type=modify&formData=" + JSON.stringify(params), function (resp) {
                        if (resp.ret == 0) {
                            item.commercialcirclename = params.commercialcirclename;
                            $alert({title: '提示：', content: '修改成功', placement: 'masget-top', duration: 1, type: 'info', show: true});
                        } else if (resp.ret == 12) {
                            $alert({title: '提示：', content: '修改失败', placement: 'masget-top', duration: 1, type: 'info', show: true});
                        }
                    })
                },
                    scope: $scope,
                    html: true,
                    title: '修改商圈名',
                    template: 'modal/modal.confirm.tpl.html',
                    contentTemplate: 'buzCircle/modifyName.tpl.html'
                });
            } else if (type == "delete") {
                $modal({html: true, scope: $scope, title: "提示", content: "确定要删除商圈---" + item.commercialcirclename, template: 'modal/modal.confirm.tpl.html', animation: 'am-fade-and-scale', callback: function () {
                    utils.query("/jsbweb/buzCircle.do?type=delete&commercialcircleid=" + JSON.stringify([item.commercialcircleid])).then(function (resp) {
                        if (resp.ret == 0) {
                            $alert({title: '提示：', content: '删除成功', placement: 'masget-top', duration: 1, type: 'info', show: true});
                            $scope.$parent.buzcircle = utils.removeFromArrayByKeyValue($scope.buzcircle, 'commercialcircleid', item.commercialcircleid);
                            $state.go('home.schedule');
                        } else {
                            $alert({title: '提示：', content: '删除失败', placement: 'masget-top', duration: 1, type: 'info', show: true});
                        }
                    })
                }});
            }
        }

        $scope.selectedState = "";
        $scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

        $scope.menuEnum = {modify: "modify", detail: "detail", deleteBuzCircle: "delete", modifyName: "modifyName"};

        $scope.$on('pushToBuzCircle', function (event, data) {
            var isExist = false;
            $.each($scope.chatItems, function (key, item) {
                if (item.isChat && item.contactid == data.content.contactid) {
                    item.isActive = true;
                    isExist = true;
                } else {
                    item.isActive = false;
                }
            });
            $.each($scope.buzcircle, function (key, _item) {
                _item.isActive = false;
            });

            if (!isExist)
                $scope.chatItems.push($.extend(data.content, {isChat: true, isActive: true,msgNum:0}))
            $timeout(function(){
                $scope.$broadcast("scrollToBottom");
            },500);
        })

        $scope.removeChat = function (item) {
            $scope.$parent.chatItems = utils.removeFromArrayByKeyValue($scope.chatItems, 'contactid', item.contactid);
        }

        $scope.$on("renderFinished", function (event, data) {

            $scope.itemMouseOver = function(item){
                $.each($scope.searchResult,function(key,_item){
                    if(_item.isKeyOver){
                        _item.isKeyOver = false;
                    }
                });
            }
            $scope.searchInput="";
            var searchPopover = $popover($("#buzcircleSearchInput"),{contentTemplate:'popover/buzcircle.searchResult.tpl.html',scope:$scope,html:true,placement:"bottom",trigger:"manual",container:"body"});

            $("#buzcircleSearchInput").unbind('keyup');
            $("#buzcircleSearchInput").keyup(function(event){
                var b = document.all ? window.event : event;
                if(13 == b.keyCode){
                    if(!searchPopover.$isShown){
                        $scope.search();
                        return;
                    }
                    $.each($scope.searchResult,function(key,item){
                        if(item.isKeyOver == true){
                            $scope.searchResultSelected(item);
                        }
                    });
                }
                if(40 == b.keyCode&&$scope.searchResult.length > 0){
                    var isKeyExists = false;
                    var nextKeyToHightLight = false;
                    var index = 0;
                    $.each($scope.searchResult,function(key,item){
                        if(item.isKeyOver == true){
                            item.isKeyOver = false;
                            isKeyExists = true;
                            nextKeyToHightLight = true;
                            index = key;
                        }else if(nextKeyToHightLight){
                            nextKeyToHightLight = false;
                            item.isKeyOver = true;
                            return false;
                        }
                    });
                    if(!isKeyExists||index == ($scope.searchResult.length-1)) $scope.searchResult[0].isKeyOver = true;
                    $scope.$digest();
                }

                if(38 == b.keyCode&&$scope.searchResult.length > 0){
                    var isKeyExists = false;
                    var preKeyToHightLight = false;
                    var index = 0;
                    $.each($scope.searchResult,function(key,item){
                        if(item.isKeyOver == true){
                            item.isKeyOver = false;
                            isKeyExists = true;
                            nextKeyToHightLight = true;
                            index = key;
                        }
                    });

                    if(isKeyExists&&index>0)
                        $scope.searchResult[index-1].isKeyOver = true;

                    if(!isKeyExists||index == 0) $scope.searchResult[$scope.searchResult.length-1].isKeyOver = true;
                    $scope.$digest();
                }
            });

            $("#buzcircleSearchInput").blur(searchPopover.hide);
            $("#buzcircleSearchBtn").blur(searchPopover.hide);

            $scope.searchResult = [];
            $scope.search = function () {
                if($scope.searchInput == ''){
                    $scope.searchResult = [];
                    return;
                }

                var buzcircleSearchResult = $.grep($scope.buzcircle,function(item){
                    return item.commercialcirclename.indexOf($scope.searchInput)!=-1;
                });

                var chatItemsSearchResult = $.grep($scope.chatItems,function(item){
                    return item.contactname.indexOf($scope.searchInput)!=-1;
                });

                $scope.searchResult = buzcircleSearchResult.concat(chatItemsSearchResult);

                searchPopover.show();

                if($scope.searchResult.length == 0)
                    $timeout(function(){
                        searchPopover.hide();
                    },1000);
            };

            $scope.searchResultSelected = function(item){
                $timeout(function(){
                    searchPopover.hide();
                    $scope.$broadcast("autoScroll",{element:$(".list-group-item[ng-id='"+(item.commercialcircleid||item.contactid)+"']",data.element)});
                    $(".list-group-item[ng-id='"+(item.commercialcircleid||item.contactid)+"'] a",data.element).trigger("click");
                },200);
            };

            $scope.$watch("searchInput",function(newVal,oldVal){
                if(newVal!="")
                $scope.search();
            })
        });


        // 登陆后判断消息服务连接状态，如果已经连接需要重新连接新用户
        if(typeof mgchat === 'object'){
            if(mgchat.isConnected()){
                mgchat.disConnect(function(error){
                    console.log("聊天服务已断开")
                });
            }else{
                mgchat.connect(function(){
                    console.log("聊天服务连接成功");
                },function(){
                    console.log("聊天服务连接失败");
                });
            }
        }
        /*$scope.$on("chat.connectionLost",function(){
         $alert("与聊天服务器断开连接");
         $timeout(function(){
         mgchat.connect(function(){
         $alert("尝试重新连接聊天服务器成功");
         },function(){
         $alert("尝试重新连接聊天服务器失败");
         });
         },2000);
         })*/
        /*
         * @param type {number}
         * 1：两人消息
         * 2：群消息
         * 3：商圈消息
         * 4：系统消息
         * 5：讨论组消息
         * 6: 任务消息
         * */
        //有新的消息到达
        $scope.chatItems = [];
        $scope.SysMessages = [];
        $scope.Announcements = [];
        $scope.$parent.msgTotalNum = 0;
        $scope.senders = [];

        $scope.$on("msgTips", function (event, data) {
            mgchat.pushMessage(data.senderid, {
                sender: "未知",
                content: data.msg,
                dateTime: new Date().toLocaleString()
            });

            $scope.msgTotalNum++;

            var thisSenderExisted = false;
            $.each($scope.senders, function (key, item) {
                if (item.senderid == data.senderid) {
                    thisSenderExisted = true;
                    item.msgNum++;
                }
            });

            if (!thisSenderExisted) {
                $scope.senders.push({
                    msgNum: 1,
                    senderid: data.senderid,
                    name: "未知"
                })
            }

            $scope.$digest();
        });

        $scope.$on("messageArrived", function (event, data) {
            if (data.senderid == mgchat.chatInfo.inChatId) return;
            var isReceiverInBuzcircle = false;
            if (data.msgtype == 1) {
                $.each($scope.chatItems, function (key, item) {
                    if (data.senderid == item.contactid) {
                        mgchat.pushMessage(data.senderid, {
                            sender: "未知",
                            content: data.msg,
                            direction: 1,
                            dateTime: new Date().toLocaleString()
                        })
                        item.msgNum++;
                        isReceiverInBuzcircle = true;
                    }
                });

                $.each($scope.buzcircle, function (key, item) {
                    if (item.isGrouper == false && data.senderid == item.staffid) {
                        mgchat.pushMessage(data.senderid, {
                            sender: "未知",
                            content: data.msg,
                            direction: 1,
                            dateTime: new Date().toLocaleString()
                        })
                        item.msgNum++;
                        isReceiverInBuzcircle = true;
                    }
                });

            } else if (data.msgtype == 3) {
                $.each($scope.buzcircle, function (key, item) {
                    if (data.senderid == item.staffid) {
                        mgchat.pushMessage(data.senderid, {
                            sender: "未知",
                            content: data.msg,
                            direction: 1,
                            dateTime: new Date().toLocaleString()
                        })
                        item.msgNum++;
                        isReceiverInBuzcircle = true;
                    }
                });
            }else if (data.msgtype == 4) {
                $scope.SysMessages.push(eval("("+data.msg+")"));
                $scope.Announcements.push(eval("("+data.msg+")"));
            }

            if (!isReceiverInBuzcircle) {
                $scope.$emit('msgTips', data)
            } else {
                $scope.$digest();
            }
        });



        var messagePopup = $popover($("#messagePopup"), {
            animation: "am-fade-and-slide-bottom",
            unbindBodyClick:true,
            trigger: "manual",
            html: true,
            scope: $scope,
            template: "popover/message.tpl.html",
            placement: "bottom",
            container: "body"
        });

        $("#messagePopup").unbind().mouseenter(function(){
            if($scope.chatClient.isConnected()){
                messagePopup.show();
            }
        }).mouseleave(function () {
            var messagePopup_t = setTimeout(messagePopup.hide, 200);
            messagePopup.$element&&messagePopup.$element.unbind().mouseenter(function () {
                clearTimeout(messagePopup_t);
            }).mouseleave(messagePopup.hide);
        }).click(function(){
            if(!$scope.chatClient.isConnected()){
                $confirm("还未连接聊天服务器，您希望手动连接吗?",function(){
                    mgchat.connect(function(){
                        $alert("您已成功连接聊天服务器");
                    },function(){
                        $alertError("连接失败");
                    })
                });
            }
        });

    }])