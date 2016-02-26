angular.module('masgetWebApp.mgchat').controller('mgchatCtr', ['$scope', '$state', 'mgchat', 'utils', '$templateCache', '$sce', '$popover','$timeout',
    function ($scope, $state, mgchat, utils, $templateCache, $sce, $popover,$timeout) {
        if(!$state.broadCast){
            $state.go("home",{},{reload:true});
            return;
        }
        var emojify = require('emojify/emojify');
        $scope.msg = '';
        $scope.msgContent = [];
        $scope.chatMembers = [];
        $scope.isGrouper = $state.broadCast.isGrouper;
        $scope.receiver = $state.broadCast.receiver;
        $scope.chatTitle = $scope.receiver.title;
        $scope.messageShow = true;
        $scope.roleSceneResources = [];

        $scope.toggleMsgPanel = function () {
            $scope.messageShow = !$scope.messageShow;
        }

        var buzCircleInfo = $state.broadCast.buzCircleInfo;
        var cache;
        var chatContent = $(".message_box.mes3")[0];
        var autoSend = false;

        var emojifyContent = function (contentHtml) {
            return emojify.replace(contentHtml, function (emoji, name) {
                return '<span contenteditable="false" ng-click="emojifyClick(\'' + emoji + '\');" class="emoji emoji-' + name + '" title=' + emoji + '></span>';
            });
        };

        var parseToMsg = function (html) {
            var result = [], parsedHtml = '', lastedMatch;
            var regSpan = new RegExp('<span.+?></span>', 'g');
            var regEmojify = new RegExp('emoji-.+?"')
            var match = regSpan.exec(html);
            if (match) {
                if (match.index > 0);
                match.lastIndex = regSpan.lastIndex;
                parsedHtml = html.substring(0, match.index);
            } else {
                return html;
            }

            while (match) {
                var emoji = regEmojify.exec(match[0])[0];
                var emojiname = emoji.substring(6, emoji.length - 1);
                parsedHtml = parsedHtml + ":" + emojiname + ":";
                result.push(match);
                lastedMatch = regSpan.exec(html);
                if (lastedMatch && lastedMatch.index > match.lastIndex) {
                    parsedHtml = parsedHtml + html.substring(match.lastIndex, lastedMatch.index);
                }
                if (lastedMatch)
                    lastedMatch.lastIndex = regSpan.lastIndex;

                if (lastedMatch == null && match.lastIndex > 0) {
                    parsedHtml = parsedHtml + html.substring(match.lastIndex, html.length);
                }
                match = lastedMatch;
            }

            return parsedHtml;
        }

        if (buzCircleInfo && $scope.isGrouper) {
            //是圈主
            cache = mgchat.getMessages(buzCircleInfo.commercialcircleid);
            $scope.messageShow = false;
            mgchat.chatInfo.inChatId = buzCircleInfo.commercialcircleid;
        } else{
            //普通聊天
            cache = mgchat.getMessages($scope.receiver.receiverid);
            mgchat.chatInfo.inChatId = $scope.receiver.receiverid;
        }

        if (cache && angular.isArray(cache)) {
            $scope.msgContent = $.extend(true,[],cache);
            $.each($scope.msgContent,function(key,item){
                item.sender = $scope.receiver.receiverName;
                item.content = $sce.trustAsHtml(emojifyContent(item.content));
            });
        }

        $scope.chatToSomeone = function (member) {
            $scope.chatTitle = member.title;
            $scope.receiver = member;
        }



        $scope.$on('messageArrived', function (event, data) {
            if (data.senderid != $scope.receiver.receiverid) return;

            var message = {
                sender: $scope.receiver.receiverName,
                content: data.msg,
                direction:1,
                dateTime: new Date().toLocaleString()
            };
            mgchat.pushMessage($scope.receiver.receiverid, message);
            $scope.$apply(function () {
                $scope.msgContent.push({
                    sender:$scope.receiver.receiverName,
                    content:$sce.trustAsHtml(emojifyContent(message.content)),
                    direction:1,
                    dataTime:message.dataTime
                });
                if (!$scope.messageShow)
                    $scope.messageShow = true;
            });
            $scope.$broadcast("scrollToBottom");
        });

        $scope.$on('messageDelivered', function (event, data) {
            var message = {
                sender: $scope.session.loginname,
                content: data.msg,
                direction:0,
                dateTime: new Date().toLocaleString()
            };
            if ($scope.isGrouper) {
                mgchat.pushMessage(buzCircleInfo.commercialcircleid, $.extend({},message));
            } else {
                mgchat.pushMessage($scope.receiver.receiverid, $.extend(true,{},message));
            }
            message.content = $sce.trustAsHtml(emojifyContent(message.content));
            $scope.$apply(function () {
                if(!autoSend)
                $scope.msg = '';
                $scope.msgContent.push(message);
                if (!$scope.messageShow)
                    $scope.messageShow = true;
            });
            if(!autoSend)
            $scope.$broadcast("scrollToBottom");

            $timeout(function(){
                $("#msgContent").html("");
            },50);
        });

        $scope.$on("renderFinished", function ($event, data) {

            chatShowed = true;
            //商圈模式下获取角色场景资源
            if (buzCircleInfo) {
                utils.query('/jsbweb/mgchat.do?type=getscenetresource' + utils.parseRequestData({
                    scenetypeid: buzCircleInfo.scenetypeid,
                    companytypeid: $scope.session.companytypeid,
                    roletypeid: $scope.session.roletypeid
                })).then(function (resp) {
                    var resources = resp.data.rows
                    $scope.roleSceneResources = [];
                    $scope.moreResources = [];
                    if (resp.ret == 0) {
                        if (resources.length > 5) {
                            $scope.roleSceneResources = resources.slice(0, 5);
                            $scope.moreResources = resources.slice(5, resources.length);
                        } else {
                            $scope.roleSceneResources = resources;
                        }
                        $popover($('.moreResourceBtn', data.element), {
                            contentTemplate: 'popover/resource.tpl.html',
                            html: true,
                            scope: $scope,
                            trigger: 'focus',
                            animation: "am-flip-x",
                            placement: 'top',
                            container: 'body'
                        })
                    }
                });
                $state.go("home.mgchat.group");
            }

            if ($state.broadCast.isSchedule) {
                $state.go("home.mgchat.toResourse", {resourcePath: utils.uuid(4, 16)});
                $state.broadCast = {src: $state.broadCast.src + "?xxxxxx=yyyyy"};
                $scope.messageShow = false;
            }

            $scope.toResource = function (item) {
//            $scope.$emit("pushNewTab.emit",item);
                if (!item.isLoaded) {
                    if (item.weburl == "") return;
                    $state.go("home.mgchat.toResourse", {resourcePath: utils.uuid(4, 16)});
                    $state.broadCast = {src: item.weburl + "?xxxxxx=yyyyy"};
                    $scope.messageShow = false;
                    item.isLoaded = true;
                    $scope.currentResource = item.resourceid;
                } else {
                    $('.mgchatContent', data.element).children().each(function () {
                        var $this = $(this)
                        if ($(this).data('resourceBind') == item.resourceid) {
                            $this.siblings().each(function(){
                                var $that = $(this);
                                if($that.is(":visible")){
                                    $that.addClass("ng-leave");
                                    $that.addClass("ng-leave-active");
                                    $timeout(function(){
                                        $that.css({display:"none"});
                                        $that.removeClass("ng-leave ng-leave-active");
                                        $this.addClass("ng-enter");
                                        $this.addClass("ng-enter-active");
                                        $this.css({display:"block"});
                                        $timeout(function(){
                                            $this.removeClass("ng-enter ng-enter-active");
                                        },300);
                                    },300);
                                }
                            });
                        }
                    });
                }

            }


            $scope.getMoreResource = function () {
                console.log(JSON.stringify(utils.cachedData));
            }

            $scope.$on('$viewContentLoaded', function (event, element) {
                if ($scope.currentResource != '')
                    element.data('resourceBind', $scope.currentResource);
            })

            /*$('#msgContent', data.element).wysiwyg({
                hotKeys: {
                    'ctrl+b meta+b': 'bold',
                    'ctrl+i meta+i': 'italic',
                    'ctrl+u meta+u': 'underline',
                    'ctrl+z meta+z': 'undo',
                    'ctrl+y meta+y meta+shift+z': 'redo'
                }
            });*/
            $scope.msgSending = false;

            /*页面部分*/
            $scope.sendMsg = function (event) {
                $timeout(function(){
                    $scope.msgSending = true;
                    $scope.$digest();
                    $timeout(function(){
                        $scope.msg = parseToMsg($("#msgContent")[0].innerHTML);
                        var g = $scope.msg

                        if (g.length == 0) {
                            $alert('输入不能为空！');
                        }else{
                            /*
                             * @param type {number}
                             * 1：两人消息
                             * 2：群消息
                             * 3：商圈消息
                             * 4：系统消息
                             * 5：讨论组消息
                             * */

                            if (mgchat.isConnected()) {
                                $scope.chatClient.send("$MSG", mgchat.getPayLoad(g, $scope.receiver, $scope.isGrouper ? 3 : 1), 1); //qos=1
                            }
                            else {
                                $("#msgContent", data.element).html("");
                                $alert('您已下线,');
                            }
                        }
                        $scope.msgSending = false;
                        $scope.$digest();
                    })
                })
            }

            var interval,autoSendFlag = false,count=0;
            $scope.autoSendMsg = function(event){
                if(autoSendFlag==false){
                    var innerHtml = $("#msgContent")[0].innerHTML;
                    autoSend  =true;
                    interval = setInterval(function(){
                        $("#msgContent")[0].innerHTML = '<span contenteditable="false" class="emoji emoji-weary" title=":weary:"></span>'+innerHtml+count++;
                        $scope.sendMsg(event);
                    },3000);
                }else{
                    clearInterval(interval);
                }
                autoSendFlag = true;
            }

            var emojifyPopover = $popover($("#emojifyShowBtn", data.element),{
                trigger: 'manual',
                placement: 'top',
                prefixEvent: 'emojify',
                container: 'body',
                scope: $scope,
                contentTemplate: 'base/app/mgchat/emojify.html',
                preProcessHtml: emojifyContent
            });

            $("#emojifyShowBtn", data.element).mouseenter(emojifyPopover.show).mouseleave(function(){
                var t = setTimeout(emojifyPopover.hide,200);
                emojifyPopover.$element.unbind().mouseenter(function(){
                    clearTimeout(t);
                }).mouseleave(emojifyPopover.hide);
            });

            $scope.emojifyClick = function (emoji) {
                $("#msgContent", data.element).html($("#msgContent", data.element).html() + emojifyContent(emoji));
            }

            $scope.$on('emojify.show', function (event, data) {
                $(".wl_faces_content .title ul li").hover(function(){
                    var index = $(this).attr("data-index");


                    $(".wl_faces_content .title ul li").each(function(){
                        if($(this).attr("data-index") == index){
                            $(this).addClass("active");
                        }else{
                            $(this).removeClass("active");
                        }
                    })
                    $(".wl_faces_main .faces_main_card").each(function(){
                        if($(this).attr("data-index") == index){
                            $(this).css("display","block");
                        }else{
                            $(this).css("display","none");
                        }
                    })
                });
            })

            chatShowed = true;

            $scope.emoClick = function (target) {

            }

            $(".close_btn", data.element).click(function () {
                $(".chatBox", data.element).hide()
            });
            $(".chat03_content li", data.element).mouseover(function () {
                $(this).addClass("hover").siblings().removeClass("hover")
            }).mouseout(function () {
                $(this).removeClass("hover").siblings().removeClass("hover")
            });
            $(".wl_faces_main img", data.element).click(function () {
                var imgPath = $(this).attr("src");
                $scope.$apply(function () {
                    $scope.msg = $scope.msg + ":" + imgPath.substr(imgPath.lastIndexOf("img/") + 4, 6) + ":";
                })
                $("#sendMsgBtn", data.element).focusEnd();
                $(".wl_faces_box", data.element).hide();
            });

            $("#msgContent", data.element).keydown(function (event) {
                var b = document.all ? window.event : event;
                return 13 == b.keyCode ? ($scope.sendMsg(), !1) : void 0
            })

            function setSelectionRange(input, selectionStart, selectionEnd) {
                if (input.setSelectionRange) {
                    input.focus();
                    input.setSelectionRange(selectionStart, selectionEnd);
                }
                else if (input.createTextRange) {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                }
            }

            function setCaretToPos (input, pos) {
                setSelectionRange(input, pos, pos);
            }
        });
    }])