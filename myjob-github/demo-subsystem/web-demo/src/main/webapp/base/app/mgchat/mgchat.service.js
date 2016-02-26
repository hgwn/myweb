angular.module('masgetWebApp.mgchat.service', [

])

    .factory('mgchat', ['$rootScope', '$cacheFactory', 'utils','$state',function ($rootScope, $cacheFactory, utils,$state) {

        if(utils.chatServerInfo.message || !utils.chatServerInfo.data.url){
            $alert('请检查聊天服务器配置！');
            return false;
        }
        var hostname = utils.chatServerInfo.data.url;
        var port = parseInt(utils.chatServerInfo.data.port);
        var path = utils.chatServerInfo.data.path;
        var initLogin = true;
        var messageCache = $cacheFactory('messageCache');
        var msgContentCache = $cacheFactory('msgContent');
        var chatInfo = {inChatId:0};

        var ProtoBuf = require('MQTT/ProtoBuf');
        var builder = ProtoBuf.loadProtoFile("static/js/plugins/jquery.plugins/mqtt/msg.proto");
        var Msg_body = builder.build("msg_body");
        var Msg_head = builder.build("msg_head");
        var Msg_id = builder.build("msg_id");
        var e_client_type = builder.build("e_client_type");
        var e_msg_type = builder.build("e_msg_type");
        var e_id_type = builder.build("e_id_type");
        var server_msg_id = builder.build("server_msg_id");
        var msg_voice_begin = builder.build("msg_voice_begin");
        var msg_voice_pack = builder.build("msg_voice_pack");
        var normal_ack = builder.build("normal_ack");
        var cancel_msg = builder.build("cancel_msg");
        var Long = ProtoBuf.Long;
        var longTOBytes = function(len){
            var f1 = (len & 0x000000ff);
            var f2 = (len & 0x0000ff00) >> 8;
            var f3 = (len & 0x00ff0000) >> 16;
            var f4 = (len & 0xff000000) >> 24;
            return [f1,f2,f3,f4];
        }

        //实例化聊天服务
        $rootScope.username = $rootScope.session.loginname;
        $rootScope.password = "1:" + $rootScope.session.session;

        $rootScope.chatClient = new Paho.MQTT.Client(hostname, port, path, utils.uuid());

        $rootScope.chatClient.onConnectionLost = function (message) {
            $rootScope.$broadcast("chat.connectionLost");
            console.log("聊天服务器失去连接");
        }

        $rootScope.chatClient.onMessageArrived = function (receivedMsg) {
            var decodeMsg = decodeMessage(receivedMsg.payloadBytes.buffer,receivedMsg.payloadBytes.byteOffset)
            if(decodeMsg.type == 1001){
                var msgBody = decodeMsg.content;
                var begin = msgBody.getMsg().offset;
                var end = msgBody.msg.limit;
                if (msgBody.msg.media_len) {
                    end = msgBody.getMediaLen().offset;
                }
                var msg = msgBody.msg.readUTF8String(end - msgBody.msg.offset, ProtoBuf.ByteBuffer.METRICS_BYTES);
                var senderid = msgBody.head.id.senderid;

                /*
                 * @param type {number}
                 * 1：两人消息
                 * 2：群消息
                 * 3：商圈消息
                 * 4：系统消息
                 * 5：讨论组消息
                 * 6: 任务消息
                 * */
                var msg_type = msgBody.head.id.type;
                $rootScope.$broadcast("messageArrived", {msg: msg,senderid:senderid.toNumber(),msgtype:msg_type});
            }else if(decodeMsg.type == 1006){
                $alertError("IP为"+decodeMsg.content.ack+"的pc已登录，您被强制下线！")
                utils.query("/jsbweb/base/loginOut.do").then(function (resp) {
                    $state.go('login');
                });
            }
        }

        $rootScope.chatClient.onMessageDelivered = function (pubAck,msg) {
            var serverMsgId = decodeMessage(pubAck.payloadBytes.buffer,pubAck.payloadBytes.byteOffset).content;
            var sentMessage = decodeMessage(msg.payloadBytes.buffer,msg.payloadBytes.byteOffset).content;
            var msg_id = serverMsgId.getMsgid().toString();

            var end = sentMessage.msg.limit;
            if (sentMessage.msg.media_len) {
                end = Msg_body.decode(msgBody).getMediaLen().offset;
            }
            var msg = sentMessage.msg.readUTF8String(end - sentMessage.msg.offset, ProtoBuf.ByteBuffer.METRICS_BYTES);
            var senderid = sentMessage.head.id.senderid;

            /*
             * @param type {number}
             * 1：两人消息
             * 2：群消息
             * 3：商圈消息
             * 4：系统消息
             * 5：讨论组消息
             * 6: 任务消息
             * */
            var msg_type = sentMessage.head.id.type;

            $rootScope.$broadcast("messageDelivered", {msg: msg,senderid:senderid.toNumber(),msgtype:msg_type});

        }

        var decodeMessage = function(buffer,begin){
            var b_ziped, crypt_type, ori_length, msg_type, msgBody;
            var resultBuffer = ProtoBuf.ByteBuffer.wrap(buffer)
            b_ziped = resultBuffer.readInt8(begin);
            crypt_type = resultBuffer.readInt8(begin+1);
            ori_length = resultBuffer.readInt32(begin+2);
            msg_type = resultBuffer.readInt16(begin+6);

            msgBody = resultBuffer.compact(begin+8);
            switch (msg_type){
                case 1001:
                    return {
                        type:1001,
                        content:Msg_body.decode(msgBody)
                    };
                case 1002:
                    return {
                        type:1002,
                        content:msg_voice_begin.decode(msgBody)
                    };
                case 1003:
                    return {
                        type:1003,
                        content:msg_voice_pack.decode(msgBody)
                    };
                case 1004:
                    return {
                        type:1004,
                        content:server_msg_id.decode(msgBody)
                    };
                case 1005:
                    return {
                        type:1005,
                        content:cancel_msg.decode(msgBody)
                    };
                case 1006:
                    return {
                        type:1006,
                        content:normal_ack.decode(msgBody)
                    };
            }

        }


        return {

             lastChatLoginId:0,
             chatInfo:chatInfo,

             getPayLoad: function (val, receiver,type) {
                var msg_id = new Msg_id();
                var msg_head = new Msg_head();
                var msg_body = new Msg_body();

                msg_id.setMsgid(new Long(0, true));
                msg_id.setType(type);
                msg_id.setReceiverid(new Long(receiver.receiverid, false));
                msg_id.setSenderid(new Long($rootScope.session.staffid, false));
                msg_id.setScenetypeid(0);
                msg_head.setId(msg_id);
                msg_head.setTime(0);
                msg_head.setClientType(e_client_type.ECT_PC);
                msg_head.setMsgType(e_msg_type.EMT_TEXT);
                msg_body.setHead(msg_head);
                msg_body.setMsg(val);
                var bodyBuffer = msg_body.toArrayBuffer();
                bodyArray = new Uint8Array(bodyBuffer);

                var msgHead = new ArrayBuffer(8);
                var bizb = new Uint8Array(msgHead);
                bizb[0] = 0;
                bizb[1] = 0;
                var bytes = longTOBytes(bodyBuffer.byteLength);
                bizb[2] = bytes[3];
                bizb[3] = bytes[2];
                bizb[4] = bytes[1];
                bizb[5] = bytes[0];
                bizb[6] = 0x3;
                bizb[7] = 0xE9;
                var arrayBuffer = new ArrayBuffer(8 + bodyBuffer.byteLength);
                var result = new Uint8Array(arrayBuffer);
                for (var i = 0; i < arrayBuffer.byteLength; i++) {
                    if (i < msgHead.byteLength)
                        result[i] = bizb[i];
                    else
                        result[i] = bodyArray[i - 8];
                }
                return result;
            },

            connect: function (successCallback,failCallback) {
                try{
                    $rootScope.chatClient.connect({
                        userName: $rootScope.username,
                        password: $rootScope.password,
                        onSuccess: function () {
                            $rootScope.chatOnline = true;
                            successCallback&&successCallback();
                        },
                        onFailure: function () {
                            $rootScope.chatOnline = false;
                            failCallback&&failCallback();
                        }
                    });
                }catch(e){
                    console.log("聊天服务器已经连接，请不要重复连接!");
                }

            },

            disConnect:function(errorCallback){
                try{
                    $rootScope.chatClient.disconnect();
                }catch(error){
                    errorCallback&&errorCallback(error);
                }
            },
            
            isConnected:function(){
            	return $rootScope.chatClient.isConnected();
            },

            getMessages: function (chatId) {
                    return messageCache.get(chatId);
            },

            pushMessage: function (chatId, content) {
                    var cache = messageCache.get(chatId);
                    if (!cache) {
                        messageCache.put(chatId,[content]);
                    }else if(angular.isArray(cache)) {
                        cache.push(content);
                    }
            }
        };
    }]);
