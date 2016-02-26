angular.module('masgetWebApp.utils.service', [

])
    .factory('utils', ['$http','$q', function ($http,$q) {

        var cachedOnOff = false; //是否使用缓存数据
        var cacheMode = false; //缓存数据模式,此模式用来获得源数据
        var cachedData = []; //缓存所有接口数据，动态添加和删除

        var pca = {}; //省市区接口数据
        var companytype = {}; //公司类型接口数据
        var buzCircleType = {}; //商圈类型接口数据
        var userResource = {};
        var session = {};

        var query=function(url,options) {
            options = $.extend({},options);
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            $.ajax({method: options.method?options.method:"get", url: url}).
                success(function(data, status, headers, config) {
                    var result = null;
                    try{
                        result = eval("("+data+")");
                    }catch(e){
                        alert("服务器错误")
                    }
                    if(result.ret == 12) {
                        deferred.resolve(result) //查询失败
                    }else if(result.ret==1000){
                        window.location.href="/jsbweb/login.html";
                    }else if(result.ret == 0){
                        if(cacheMode){
                            var isMocked =false;
                            $.each(cachedData,function(key,item){
                                if(item.url == url){
                                    item.data=data;
                                    isMocked=true;
                                    console.log(item.url+"更新接口缓存数据");
                                }
                            });

                            if(!isMocked){
                                var cachedItem = {url:url,data:data};
                                var index = $.mockjax({
                                    url: url,
                                    responseText: cachedItem.data
                                });
                                console.log(url+"新增接口缓存数据");
                                cachedItem.index = index;
                                cachedData.push(cachedItem);
                            }
                        }
                        deferred.resolve(result);  // 声明执行成功，即http请求数据成功，可以返回数据了
                    }
                }).
                error(function(data, status, headers, config) {
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        } // end query

        if(cachedOnOff){
            $.ajax({
                url: "/jsbweb/com/assets/cachedData.json",
                async: false,
                success:function(data){
                    if(angular.isArray(data)){
                        cachedData = data;
                        $.each(cachedData,function(key,item){
                            item.index = $.mockjax({
                                url: item.url,
                                responseText: item.data
                            });
                        })
                    }

                }
            })
        }

        query("/jsbweb/commonUtils.do?type=district").then(function(data) {  // 调用承诺API获取数据 .resolve
            pca.data = data.data.rows;
        }, function(data) {  // 处理错误 .reject
            pca.message = {error: '接口错误'};
        });
        
        query("/jsbweb/buzCircle.do?type=circleType").then(function(data) {  // 调用承诺API获取数据 .resolve
            buzCircleType.data = data.data.rows;
        }, function(data) {  // 处理错误 .reject
            buzCircleType.message = {error: '接口错误'};
        });

        query("/jsbweb/base/getSession.do").then(function(resp) {  // 调用承诺API获取数据 .resolve
            session.data = resp;
        }, function(resp) {  // 处理错误 .reject
            session.message = {error: '接口错误'};
        });



        return {
            url: 'http://localhost:8080/logistics-server-webprj/test.do',
            myUrl: '/jsbweb/UserResource/my.do',
            baseUrl: "/masgetweb",
            cachedData:cachedData,
            pca: pca,
            companytype: companytype,
            buzCircleType:buzCircleType,
            userResource:userResource,
            session:session,

            getMyUrl: function () {
                return this.myUrl;
            },
            getUrl: function () {
                return this.url;
            },

            //promise方式获取数据
            query:query,

            //回调方式通过get方法获取数据
            httpGet: function (url, callback) {
                query(url).then(function (resp) {
                    callback(resp);
                });

            },

            //回调方式通过post方法获取数据
            httpPost: function (url, data, callback) {
                $http.post(url,data).then(function (resp) {
                    callback(resp.data);
                });

            },
            // Util for finding an object by its 'id' property among an array
            findByKeyValue: function (a, key, value) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i][key] == value) return a[i];
                }
                return null;
            },
            //Util for setting an object's key's value after finding an object by its 'id' 
            setKeyValueByKeyValue: function (list, key1, value1, key2, value2) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i][key1] == value1) {
                        list[i][key2] = value2;
                    }
                }
                return null;
            },
            // Util for returning a random key from a collection that also isn't the current key
            newRandomKey: function newRandomKey(coll, key, currentKey) {
                var randKey;
                do {
                    randKey = coll[Math.floor(coll.length * Math.random())][key];
                } while (randKey == currentKey);
                return randKey;
            },

            addPropertybyexsits:function(list,keysfrom,keysto){

                if(!angular.isArray(list)) return [];
                var keysfromarray = keysfrom.split(",");
                var keystoarray = keysto.split(",");
                for(var i = 0;i<list.length;i++){
                    for(var j =0;j<keysfromarray.length;j++){
                        if(list[i].hasOwnProperty(keysfromarray[j]))
                        list[i][keystoarray[j]] = list[i][keysfromarray[j]];
                    }
                }
                return list;

            },

            joinProperty:function(list,property){
                var result=[];
                if(!angular.isArray(list)||typeof property!="string" ) return "";
                for(var i=0;i<list.length;i++){
                    if(list[i].hasOwnProperty(property))
                    result[i] = list[i][property];
                    else
                    result[i]="";
                }
                return result.join(",");

            },
            
            adaptSize: function adaptSize() {
                var clientHeight = document.documentElement.clientHeight;
                var scrollWidth = document.body.scrollWidth;
                var contactsPanel = document.getElementById("contactsPanel_"+currentActiceModuleName);
                if(contactsPanel&&contactsPanel.length!=0){
                    if(currentActiceModuleName=="my")
                        contactsPanel.style.height = clientHeight+"px";
                    else if(currentActiceModuleName=="mgchat"||currentActiceModuleName=="buzcircle"||currentActiceModuleName=="contacts"){
                        contactsPanel.style.height =(clientHeight - 55) +"px";
                        if($(".chat01_content").length!=0)
                            $(".chat01_content").css("height",(document.documentElement.clientHeight-180)+"px");
                    }
                    else
                        contactsPanel.style.height =(clientHeight - 90) +"px";
                }
                var contentPanel = document.getElementById("contentPanelInner_"+currentActiceModuleName);
                if(contentPanel){
                    contentPanel.style.width = (scrollWidth - 340) + "px";
                    contentPanel.style.height = clientHeight + "px";
                }
                if(currentActiceModuleName == "my"){
                	document.getElementById("contentPanelWrapper_my").style.height = (clientHeight -42) +"px";
                }
            },

            removeFromArrayByKeyValue: function (array, key, value) {
                var tmp = [];
                var found = false;
                if (!angular.isArray(array)) return;
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] == value && !found) {
                        found = true;
                        continue;
                    }
                    tmp.push(array[i]);
                }
                return tmp;
            },

            formatDataForTreeView: function transformData(data, propertyName) {
                if (angular.isArray(data) && data.length == 0) return;
                $.each(data, function (key, node) {
                    if (node.children) {
                        var nodes = $.extend(true, [], node.children);
                        node.nodes = nodes;
                        transformData(nodes);
                        delete node.children;
                    }
                })
            },

            arrayDataToTree: function (arrayData, propertyId, propertyPid, pId, level, parentNode) {
                if (angular.isArray(arrayData) && arrayData.length == 0) return;
                var filterData = [];
                var result = {};
                if (!angular.isDefined(parentNode)) parentNode = {};
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i][propertyPid] != pId) {
                        filterData.push(arrayData[i]);
                    }
                }

                parentNode["nodes"] = [];
                result["nodes"] = [];
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i][propertyPid] == pId) {
                        var node = jQuery.extend({}, arrayData[i],{level:level});
                        arguments.callee(filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                        if (level == 0) {
                            result["nodes"].push(node);
                        } else {
                            parentNode["nodes"].push(node);
                        }
                    }
                }

                if (level == 0)
                    return result["nodes"];
            },

            uuid:function(len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random()*16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        },

            getBrowser:function(){

                var Sys = {};
                var ua = navigator.userAgent.toLowerCase();
                var s;
                (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua
                    .match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua
                    .match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua
                    .match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua
                    .match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1]
                    : 0;
                // ie
                if (Sys.ie) {
                    return "ie";
                }
                if ("ActiveXObject" in window) {
                    Sys.ie = "ie 11";
                    return "ie";
                }
                // firefox
                if (Sys.firefox) {
                    return "Firefox";
                }
                // Chrome
                if (Sys.chrome) {
                    return "Chrome";
                }
                // Opera
                if (Sys.opera) {
                    return "Opera";
                }
                // Safari
                if (Sys.safari) {
                    return "Safari";
                }
            },

            parseRequestData:function(data){
                var result=""
                for(var key in data){
                    if(data[key] == ""||data[key]==undefined) continue;
                    result+="&"+key+"="+data[key];
                }
                return result;
            },

            removeFromArrayByProperty:function(array,item,property){
                var result=[];
                if(!angular.isArray(array)) return result;
                for(var i=0;i<array.length;i++){
                    if(array[i].hasOwnProperty(property)&&array[i][property]  != item[property]){
                                            result.push(array[i])
                    }
                }
                return result;
            },
            stringToBytes:function(str) {
            var ch, st, re = [];
            for (var i = 0; i < str.length; i++ ) {
                ch = str.charCodeAt(i);  // get char
                st = [];                 // set up "stack"
                do {
                    st.push( ch & 0xFF );  // push byte to stack
                    ch = ch >> 8;          // shift value down by 1 byte
                }
                while ( ch );
                // add stack contents to result
                // done because chars have "wrong" endianness
                re = re.concat( st.reverse() );
            }
            // return an array of bytes
            return re;
        }
    };
    }]);
