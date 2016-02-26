angular.module('masgetWebApp.utils.service', [
    'chieffancypants.loadingBar','mgcrea.ngStrap'
])
    .factory('utils', ['$http', '$q','$timeout', '$state', '$rootScope','cfpLoadingBar','$alert','$modal', function ($http, $q, $timeout, $state, $rootScope,cfpLoadingBar,$alert,$modal) {

        window.$alert = function (content, options) {
            var defaultVal= {
                title: '提示：',
                placement: 'alert-position',
                container:'.alert-container',
                animation: 'am-fade-and-slide-bottom',
                duration:1,
                type: 'info',
                show: true
            };
            options = $.extend(defaultVal,options);
            options.content = content;
            return $alert(options);
        };

        window.$alertError = function (content, options) {
            var defaultVal= {
                title: '提示：',
                placement: 'alert-position',
                container:'.alert-container',
                animation: 'am-fade-and-slide-bottom',
                dismissable:true,
                backdrop:true,
                type: 'info',
                show: true
            };
            options = $.extend(defaultVal,options);
            options.content = content;
            return $alert(options);
        };

        window.$confirm = function(content,callback,options){
            var defaultVal = {
                template: 'modal/modal.confirm.tpl.html',
                animation: 'am-fade',
                html: true,
                placement: 'center',
                title: "提示"
            };
            options = $.extend(defaultVal,options);
            options.content = content;
            options.callback = callback;
            return $modal(options);
        };

        window.$modal = $modal;

        var cacheMode = $rootScope.cacheMode = false; //缓存数据模式,此模式用来获得源数据
        var cachedOnOff = $rootScope.cachedOnOff = false;//是否使用缓存数据
        var cachedData = []; //缓存所有接口数据，动态添加和删除
        var forbidCache = true; //是否允许浏览器使用接口缓存

        var pca = {}; //省市区接口数据
        var companytype = {}; //公司类型接口数据
        var buzCircleType = {}; //商圈类型接口数据
        var userResource = {};
        var session = {};
        var chatServerInfo = {};
        var ajaxCount = 0

        var uuid = function (len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
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
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }

            return uuid.join('');
        };

        var query = function (url, options,objAlert) {
            var thisAlert;
            if(ajaxCount == 0){
                cfpLoadingBar.start();
            }
            ajaxCount++;
            if (forbidCache) {
                if (url.indexOf("?") != -1) {
                    url = url + "&forbidCache=" + uuid(4, 16);
                } else {
                    url = url + "?forbidCache=" + uuid(4, 16);
                }
            }
            options = $.extend({}, options);
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            var ajaxParams = {
                async:angular.isUndefined(options.async)?true:options.async,
                type:options.type?options.type:"get",
                method: options.method ? options.method : "get",
                data: options.data,
                url: url
            };
            if (options.dataType) ajaxParams.dataType = options.dataType;
            $.ajax(ajaxParams).success(function (data, status, headers, config) {
                if(--ajaxCount == 0)
                cfpLoadingBar.complete();
                var result = null;
                if (typeof data == "string") {
                    try {
                        result = eval("(" + data + ")");
                    } catch (e) {
                        if(!thisAlert||!thisAlert.isShown)
                        thisAlert = window.$alertError("服务器错误");
                        return;
                    }
                } else {
                    result = data;
                }
                if (result.ret == 1000||result.ret == 10) {
                    $timeout(function () {
                        if(!$rootScope.isLogin){
                            if((!thisAlert||!thisAlert.isShown)&&!objAlert)
                            thisAlert = window.$alertError(result.message?result.message:'登录失败');
                        }else{
                            $state.go('login');
                        }
                        deferred.reject(result);
                    }, 2000);
                } else if (result.ret) {
                    if(result.ret !=0) {
                        if (!!objAlert) {
                            deferred.reject(result) //查询失败
                        }else{
                            if(!thisAlert||!thisAlert.isShown)
                            thisAlert = window.$alertError(result.message?result.message:'请求失败');
                            deferred.reject(result) //查询失败
                        }
                    }
                } else if (result.ret == 0) {
                    if (cacheMode) {
                        var isMocked = false;
                        $.each(cachedData, function (key, item) {
                            if (item.url == url) {
                                item.data = data;
                                isMocked = true;
                                console.log(item.url + "更新接口缓存数据");
                            }
                        });

                        if (!isMocked) {
                            var cachedItem = {url: url, data: data};
                            if(typeof data !="string") cachedItem.data = JSON.stringify(data);
                            var index = $.mockjax({
                                url: url,
                                responseText: cachedItem.data
                            });
                            console.log(url + "新增接口缓存数据");
                            cachedItem.index = index;
                            cachedData.push(cachedItem);
                        }
                    }
                    deferred.resolve(result);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }
            }).error(function (data, status, headers, config) {
                    ajaxCount =0;
                    deferred.reject(data);   // 声明执行失败，即服务器返回错误
                });
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        } // end query

        if (cachedOnOff) {
            $.ajax({
                url: "/jsbweb/base/assets/cachedData.json",
                async: false,
                success: function (data) {
                    if (angular.isArray(data)) {
                        cachedData = data;
                        $.each(cachedData, function (key, item) {
                            item.index = $.mockjax({
                                url: item.url,
                                responseText: item.data
                            });
                        })
                    }

                }
            })
        }

        query("/jsbweb/commonUtils.do?type=district_NOS").then(function (data) {  // 调用承诺API获取数据 .resolve
            pca.data = [{provincename:'未选择'}].concat(data.data.rows);
        }, function (data) {  // 处理错误 .reject
            pca.message = {error: '接口错误'};
        });

        query("/jsbweb/commonUtils.do?type=companytype").then(function (data) {  // 调用承诺API获取数据 .resolve
            companytype.data = [{companytypename:'未选择'}].concat(data.data.rows);
        }, function (data) {  // 处理错误 .reject
            companytype.message = {error: '接口错误'};
        });

        query("/jsbweb/commonUtils.do?type=chatServerInfo").then(function (data) {  // 调用承诺API获取数据 .resolve
            chatServerInfo.data = data.data;
        }, function (data) {  // 处理错误 .reject
            chatServerInfo.message = {error: '接口错误'};
        });

        var factory = {
            url: 'http://localhost:8080/logistics-server-webprj/test.do',
            myUrl: '/jsbweb/UserResource/my.do',
            baseUrl: "/masgetweb",
            cachedData: cachedData,
            companytype: companytype,
            userResource: userResource,
            pca:pca,
            chatServerInfo:chatServerInfo,
            getSession: function () {
                return query("/jsbweb/base/getSession.do").then(function (resp) {
                    $rootScope.session = factory.session = resp;
                    return resp;
                })
            },

            getIndustries:function(){
                return query("/jsbweb/commonUtils.do?type=industries").then(function (resp) {
                    return resp.data.rows;
                })
            },

            getPca:function(){
                return query("/jsbweb/commonUtils.do?type=district_NOS").then(function (resp) {
                    return resp.data.rows;
                })
            },

            getCircleType:function(){
                return query("/jsbweb/buzCircle.do?type=circleType").then(function (resp) {
                    return resp.data.rows;
                })
            },

            getMyUrl: function () {
                return this.myUrl;
            },
            getUrl: function () {
                return this.url;
            },

            //promise方式获取数据
            query: query,

            //回调方式通过get方法获取数据
            httpGet: function (url, callback) {
                query(url).then(function (resp) {
                    callback(resp);
                });

            },

            //回调方式通过post方法获取数据
            httpPost: function (url, data, callback) {
                $http.post(url, data).then(function (resp) {
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

            addPropertybyexsits: function (list, keysfrom, keysto) {

                if (!angular.isArray(list)) return [];
                var keysfromarray = keysfrom.split(",");
                var keystoarray = keysto.split(",");
                for (var i = 0; i < list.length; i++) {
                    for (var j = 0; j < keysfromarray.length; j++) {
                        if (list[i].hasOwnProperty(keysfromarray[j]))
                            list[i][keystoarray[j]] = list[i][keysfromarray[j]];
                    }
                }
                return list;

            },

            joinProperty: function (list, property) {
                var result = [];
                if (!angular.isArray(list) || typeof property != "string") return "";
                for (var i = 0; i < list.length; i++) {
                    if (list[i].hasOwnProperty(property))
                        result[i] = list[i][property];
                    else
                        result[i] = "";
                }
                return result.join(",");

            },

            adaptSize: function adaptSize() {
                var clientHeight = document.documentElement.clientHeight - 56;
                var clientHeight = document.documentElement.clientHeight - 56;
                var scrollWidth = document.body.scrollWidth;
                var leftBarWidth = $("#leftbar").is(":visible")?60:0;
                var contactsPanel = document.getElementById("contactsPanel_" + currentActiceModuleName);
                if (contactsPanel && contactsPanel.length != 0) {
                    if (currentActiceModuleName == "my")
                        contactsPanel.style.height = clientHeight + "px";
                    else if (currentActiceModuleName == "mgchat" || currentActiceModuleName == "buzcircle" || currentActiceModuleName == "contacts") {
                        contactsPanel.style.height = (clientHeight - 55) + "px";
                        if ($(".chat01_content").length != 0)
                            $(".chat01_content").css("height", (document.documentElement.clientHeight - 231) + "px");
                    }
                    else
                        contactsPanel.style.height = (clientHeight - 90) + "px";
                }
                var contentPanel = document.getElementById("contentPanelInner_" + currentActiceModuleName);
                if (contentPanel) {
                    if (toggleStates[currentActiceModuleName]) {
                        $("#contentPanelInner_" + currentActiceModuleName).animate({marginLeft: '0px'}, "fast", function () {
                            contentPanel.style.width = (scrollWidth - leftBarWidth) + "px";
                        });

                    } else {
                        contentPanel.style.width = ((currentActiceModuleName == "contacts" ? (scrollWidth - 260 - leftBarWidth) : (scrollWidth - 180 - leftBarWidth)) + "px");
                    }
                    contentPanel.style.height = clientHeight + "px";
                }
                if (currentActiceModuleName == "my") {
                    document.getElementById("contentPanelWrapper_my").style.height = (clientHeight - $("#contentPanelBar_my")[0].offsetHeight) + "px";
                }
                $("#find_list").css("height", (document.documentElement.clientHeight - 64) + "px");
            },

            getResourceUrl:function(resourceid){
                for(var i=0;i<$rootScope.resources.length;i++){
                    if($rootScope.resources[i].o_resourceid === resourceid)
                        return  $rootScope.resources[i];
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

            parseTreeData: function (treeData, childrenAttr, level, result) {
                var isLastGroup = false;
                if (level == 0) {
                    result = [];
                }

                if (treeData.length == 0) isLastGroup = true;

                for (var i = 0; i < treeData.length; i++) {
                    if (treeData[i].hasOwnProperty(childrenAttr) && angular.isArray(treeData[i][childrenAttr]) && treeData[i][childrenAttr].length > 0) {
                        if (level == 0) {
                            result.push(treeData[i]);
                        }

                        treeData[i].isLastGroup = arguments.callee(treeData[i][childrenAttr], childrenAttr, level + 1);
                    }
                    else if (level > 0) {
                        if (!isLastGroup)
                            isLastGroup = true;
                        treeData[i].isLeaf = true;
                    } else if (level == 0) {
                        result.push(treeData[i])
                    }

                }
                if (level == 0)
                    return result;
                return isLastGroup;
            },

            clipOrgs: function (treeData, childrenAttr, level, result) {

                if (level == 0) {
                    result = $.extend(true, [], treeData);
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].hasOwnProperty(childrenAttr))
                            arguments.callee(null, childrenAttr, level + 1, result[i][childrenAttr]);
                    }
                }

                if (level > 0) {
                    if (!angular.isArray(result)) return;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].isLastGroup) {
                            delete result[i][childrenAttr];
                        } else {
                            arguments.callee(null, childrenAttr, level + 1, result[i][childrenAttr]);
                        }
                    }
                }

                if (level == 0)
                    return result;
            },

            calTreeLevel:function(treeData,level){
                for(var i =0;i<treeData.length;i++){
                    treeData[i].level = level;
                    if($.isArray(treeData[i].children)&&treeData[i].children.length>0)
                    arguments.callee(treeData[i].children,level+1);
                }
            },

            addSession:function(treeData,childrenAttr,level,item,result){
                if(level == 0){
                    result = [];
                }

                for(var i = 0;i<treeData.length;i++){
                    if(treeData[i].hasOwnProperty(childrenAttr)&&angular.isArray(treeData[i][childrenAttr])){
                        if(level == 0){
                            result.push(treeData[i]);
                        }

                        treeData[i].sessionid = item;
                        arguments.callee(treeData[i][childrenAttr],childrenAttr,level+1,item);
                    }else{
                        treeData[i].sessionid = item;
                        if(level == 0){
                            result.push(treeData[i]);
                        }
                    }

                }
                if(level == 0)
                    return result;
            },

            addStation:function(treeData,childrenAttr,level,item,result){
                if(level == 0){
                    result = [];
                }

                for(var i = 0;i<treeData.length;i++){
                    if(treeData[i].hasOwnProperty(childrenAttr)&&angular.isArray(treeData[i][childrenAttr])){
                        if(level == 0){
                            result.push(treeData[i]);
                        }

                        treeData[i].sessionStation = item;
                        arguments.callee(treeData[i][childrenAttr],childrenAttr,level+1,item);
                    }else{
                        treeData[i].sessionStation = item;
                        if(level == 0){
                            result.push(treeData[i]);
                        }
                    }

                }
                if(level == 0)
                    return result;
            },

            arrayDataToTree: function (arrayData, propertyId, propertyPid, pId, level, parentNode) {
                if (arrayData&&angular.isArray(arrayData) && arrayData.length == 0) return [];
                var filterData = [];
                if (!angular.isDefined(parentNode)) parentNode = {};
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i][propertyPid] != pId) {
                        filterData.push(arrayData[i]);
                    }
                }
                parentNode["nodes"] = [];
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i][propertyPid] == pId) {
                        var node = jQuery.extend({}, arrayData[i]);
                        arguments.callee(filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                        parentNode["nodes"].push(node);
                        node.level = level;
                    }
                }

                if (level == 0)
                    return parentNode["nodes"];
            },

            arrayDataToTreeSmarter:function(arrayData,propertyId, propertyPid,result,level){
                if(level == 0){
                    result.rootNodes = [];
                    result.restNodes = [];
                }
                if(arrayData.length>0){
                    var isRootNode = true;
                    for(var i = 1;i<arrayData.length;i++){
                        if(arrayData[0][propertyPid] == arrayData[i][propertyId]){
                            isRootNode = false;
                        }
                    }

                    for(var i = 0;i<result.rootNodes.length;i++){
                        if(arrayData[0][propertyPid] == result.rootNodes[i][propertyId]){
                            isRootNode = false;
                        }
                    }
                    if(isRootNode){
                        result.rootNodes.push(arrayData[0]);
                    } else{
                        result.restNodes.push(arrayData[0]);
                    };
                    arguments.callee.call(this,arrayData.slice(1,arrayData.length),propertyId, propertyPid,result,level+1);
                }
                if(level == 0){
                    var rootNodes = result.rootNodes;
                    for(var i= 0;i<rootNodes.length;i++){
                        this.arrayDataToTree(result.restNodes,propertyId, propertyPid,rootNodes[i][propertyId],1,rootNodes[i]);
                    }
                    return result;
                }
            },

            OsroleresourceToTree: function (arrayData, propertyId, propertyPid, pId, level, parentNode,clearId) {
                if (arrayData&&angular.isArray(arrayData) && arrayData.length == 0) return [];
                var filterData = [];
                var clearIdFlag = true;
                if (!angular.isDefined(parentNode)) parentNode = {};
                for (var i = 0; i < arrayData.length; i++) {
                    if(arrayData[i][propertyId] == clearId&&clearId != null){continue ;}
                    if (arrayData[i][propertyPid] != pId) {
                        arrayData[i].id = arrayData[i][propertyId];
                        arrayData[i].text = arrayData[i].resourcename;
                        arrayData[i].type = 'folder';
                        arrayData[i].isDelete = true;
                        arrayData[i].isOperation = true;
                        arrayData[i].isAdd = true;
                        filterData.push(arrayData[i]);
                    }
                }
                parentNode["children"] = [];
                for (var i = 0; i < arrayData.length; i++) {
                    if(arrayData[i][propertyId] == clearId&&clearId != null){continue ;}
                    if (arrayData[i][propertyPid] == pId) {
                        arrayData[i].id = arrayData[i][propertyId];
                        arrayData[i].text = arrayData[i].resourcename;
                        arrayData[i].type = 'folder';
                        arrayData[i].isDelete = true;
                        arrayData[i].isOperation = true;
                        arrayData[i].isAdd = true;
                        var node = jQuery.extend({}, arrayData[i]);
                        arguments.callee(filterData, propertyId, propertyPid, node[propertyId], level + 1, node);
                        parentNode["children"].push(node);
                        node.level = level;
                    }
                }

                if (level == 0)
                    return parentNode["children"];
            },

            OsroleresourceToTreeParent: function (arrayData, propertyId, propertyPid, pId,parent) {
                if (arrayData&&angular.isArray(arrayData) && arrayData.length == 0) return [];
                for (var i = 0; i < arrayData.length; i++) {
                    if (arrayData[i][propertyPid] == pId) {
                        arrayData[i].parent = parent ;
                        var node = jQuery.extend({}, arrayData[i]);
                        if(node.children == undefined){continue;}
                        arguments.callee(arrayData[i].children, propertyId, propertyPid, node[propertyId],node);
                    }
                }
                return arrayData;
            },

            uuid: uuid,

            getBrowser: function () {

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

            parseRequestData: function (data) {
                var result = ""
                for (var key in data) {
                    if (data[key] === "" || typeof data[key] === "undefined") continue;
                    result += "&" + key + "=" + data[key];
                }
                return result;
            },

            removeFromArrayByProperty: function (array, item, property) {
                var result = [];
                if (!angular.isArray(array)) return result;
                for (var i = 0; i < array.length; i++) {
                    if (array[i].hasOwnProperty(property) && array[i][property] != item[property]) {
                        result.push(array[i])
                    }
                }
                return result;
            },
            stringToBytes: function (str) {
                var ch, st, re = [];
                for (var i = 0; i < str.length; i++) {
                    ch = str.charCodeAt(i);  // get char
                    st = [];                 // set up "stack"
                    do {
                        st.push(ch & 0xFF);  // push byte to stack
                        ch = ch >> 8;          // shift value down by 1 byte
                    }
                    while (ch);
                    // add stack contents to result
                    // done because chars have "wrong" endianness
                    re = re.concat(st.reverse());
                }
                // return an array of bytes
                return re;
            },
            parseUrl: function (attrs) {
                var path = window.location.href.split("?");
                return path[1].split("#")[0].split("=");
            },
            enter:function(element){
                element.addClass("ng-enter");
                element.addClass("ng-enter-active");
                element.css({display: "block"});
                setTimeout(function () {
                    element.removeClass("ng-enter ng-enter-active");
                    element.removeClass("ng-enter ng-enter-active");
                }, 300);
            },
            leave:function( element){
                element.addClass("ng-leave");
                element.addClass("ng-leave-active");
                setTimeout(function () {
                    element.css({display: "none"});
                    element.removeClass("ng-leave ng-leave-active");
                }, 300);
            }
        }

        return factory;
    }]);

/*!
 * angular-loading-bar v0.8.0
 * https://chieffancypants.github.io/angular-loading-bar
 * Copyright (c) 2015 Wes Cruver
 * License: MIT
 */
/*
 * angular-loading-bar
 *
 * intercepts XHR requests and creates a loading bar.
 * Based on the excellent nprogress work by rstacruz (more info in readme)
 *
 * (c) 2013 Wes Cruver
 * License: MIT
 */


(function() {

    'use strict';

// Alias the loading bar for various backwards compatibilities since the project has matured:
    angular.module('angular-loading-bar', ['cfp.loadingBarInterceptor']);
    angular.module('chieffancypants.loadingBar', ['cfp.loadingBarInterceptor']);


    /**
     * loadingBarInterceptor service
     *
     * Registers itself as an Angular interceptor and listens for XHR requests.
     */
    angular.module('cfp.loadingBarInterceptor', ['cfp.loadingBar'])
        .config(['$httpProvider', function ($httpProvider) {

            var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log', 'cfpLoadingBar', function ($q, $cacheFactory, $timeout, $rootScope, $log, cfpLoadingBar) {

                /**
                 * The total number of requests made
                 */
                var reqsTotal = 0;

                /**
                 * The number of requests completed (either successfully or not)
                 */
                var reqsCompleted = 0;

                /**
                 * The amount of time spent fetching before showing the loading bar
                 */
                var latencyThreshold = cfpLoadingBar.latencyThreshold;

                /**
                 * $timeout handle for latencyThreshold
                 */
                var startTimeout;


                /**
                 * calls cfpLoadingBar.complete() which removes the
                 * loading bar from the DOM.
                 */
                function setComplete() {
                    $timeout.cancel(startTimeout);
                    cfpLoadingBar.complete();
                    reqsCompleted = 0;
                    reqsTotal = 0;
                }

                /**
                 * Determine if the response has already been cached
                 * @param  {Object}  config the config option from the request
                 * @return {Boolean} retrns true if cached, otherwise false
                 */
                function isCached(config) {
                    var cache;
                    var defaultCache = $cacheFactory.get('$http');
                    var defaults = $httpProvider.defaults;

                    // Choose the proper cache source. Borrowed from angular: $http service
                    if ((config.cache || defaults.cache) && config.cache !== false &&
                        (config.method === 'GET' || config.method === 'JSONP')) {
                        cache = angular.isObject(config.cache) ? config.cache
                            : angular.isObject(defaults.cache) ? defaults.cache
                            : defaultCache;
                    }

                    var cached = cache !== undefined ?
                        cache.get(config.url) !== undefined : false;

                    if (config.cached !== undefined && cached !== config.cached) {
                        return config.cached;
                    }
                    config.cached = cached;
                    return cached;
                }


                return {
                    'request': function(config) {
                        // Check to make sure this request hasn't already been cached and that
                        // the requester didn't explicitly ask us to ignore this request:
                        if (!config.ignoreLoadingBar && !isCached(config)) {
                            $rootScope.$broadcast('cfpLoadingBar:loading', {url: config.url});
                            if (reqsTotal === 0) {
                                startTimeout = $timeout(function() {
                                    cfpLoadingBar.start();
                                }, latencyThreshold);
                            }
                            reqsTotal++;
                            cfpLoadingBar.set(reqsCompleted / reqsTotal);
                        }
                        return config;
                    },

                    'response': function(response) {
                        if (!response || !response.config) {
                            $log.error('Broken interceptor detected: Config object not supplied in response:\n https://github.com/chieffancypants/angular-loading-bar/pull/50');
                            return response;
                        }

                        if (!response.config.ignoreLoadingBar && !isCached(response.config)) {
                            reqsCompleted++;
                            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: response.config.url, result: response});
                            if (reqsCompleted >= reqsTotal) {
                                setComplete();
                            } else {
                                cfpLoadingBar.set(reqsCompleted / reqsTotal);
                            }
                        }
                        return response;
                    },

                    'responseError': function(rejection) {
                        if (!rejection || !rejection.config) {
                            $log.error('Broken interceptor detected: Config object not supplied in rejection:\n https://github.com/chieffancypants/angular-loading-bar/pull/50');
                            return $q.reject(rejection);
                        }

                        if (!rejection.config.ignoreLoadingBar && !isCached(rejection.config)) {
                            reqsCompleted++;
                            $rootScope.$broadcast('cfpLoadingBar:loaded', {url: rejection.config.url, result: rejection});
                            if (reqsCompleted >= reqsTotal) {
                                setComplete();
                            } else {
                                cfpLoadingBar.set(reqsCompleted / reqsTotal);
                            }
                        }
                        return $q.reject(rejection);
                    }
                };
            }];

            $httpProvider.interceptors.push(interceptor);
        }]);


    /**
     * Loading Bar
     *
     * This service handles adding and removing the actual element in the DOM.
     * Generally, best practices for DOM manipulation is to take place in a
     * directive, but because the element itself is injected in the DOM only upon
     * XHR requests, and it's likely needed on every view, the best option is to
     * use a service.
     */
    angular.module('cfp.loadingBar', [])
        .provider('cfpLoadingBar', function() {

            this.autoIncrement = true;
            this.includeSpinner = true;
            this.includeBar = true;
            this.latencyThreshold = 100;
            this.startSize = 0.02;
            this.parentSelector = 'body';
            this.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>';
            this.loadingBarTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div>';

            this.$get = ['$injector', '$document', '$timeout', '$rootScope', function ($injector, $document, $timeout, $rootScope) {
                var $animate;
                var $parentSelector = this.parentSelector,
                    loadingBarContainer = angular.element(this.loadingBarTemplate),
                    loadingBar = loadingBarContainer.find('div').eq(0),
                    spinner = angular.element(this.spinnerTemplate);

                var incTimeout,
                    completeTimeout,
                    started = false,
                    status = 0;

                var autoIncrement = this.autoIncrement;
                var includeSpinner = this.includeSpinner;
                var includeBar = this.includeBar;
                var startSize = this.startSize;

                /**
                 * Inserts the loading bar element into the dom, and sets it to 2%
                 */
                function _start() {
                    if (!$animate) {
                        $animate = $injector.get('$animate');
                    }

                    var $parent = $document.find($parentSelector).eq(0);
                    $timeout.cancel(completeTimeout);

                    // do not continually broadcast the started event:
                    if (started) {
                        return;
                    }

                    $rootScope.$broadcast('cfpLoadingBar:started');
                    started = true;

                    if (includeBar) {
                        $animate.enter(loadingBarContainer, $parent, angular.element($parent[0].lastChild));
                    }

                    if (includeSpinner) {
                        $animate.enter(spinner, $parent, angular.element($parent[0].lastChild));
                    }

                    _set(startSize);
                }

                /**
                 * Set the loading bar's width to a certain percent.
                 *
                 * @param n any value between 0 and 1
                 */
                function _set(n) {
                    if (!started) {
                        return;
                    }
                    var pct = (n * 100) + '%';
                    loadingBar.css('width', pct);
                    status = n;

                    // increment loadingbar to give the illusion that there is always
                    // progress but make sure to cancel the previous timeouts so we don't
                    // have multiple incs running at the same time.
                    if (autoIncrement) {
                        $timeout.cancel(incTimeout);
                        incTimeout = $timeout(function() {
                            _inc();
                        }, 250);
                    }
                }

                /**
                 * Increments the loading bar by a random amount
                 * but slows down as it progresses
                 */
                function _inc() {
                    if (_status() >= 1) {
                        return;
                    }

                    var rnd = 0;
                    var stat = _status();
                    if (stat >= 0 && stat < 0.25) {
                        // Start out between 3 - 6% increments
                        rnd = (Math.random() * (5 - 3 + 1) + 3) / 100;
                    } else if (stat >= 0.25 && stat < 0.65) {
                        // increment between 0 - 3%
                        rnd = (Math.random() * 3) / 100;
                    } else if (stat >= 0.65 && stat < 0.9) {
                        // increment between 0 - 2%
                        rnd = (Math.random() * 2) / 100;
                    } else if (stat >= 0.9 && stat < 0.99) {
                        // finally, increment it .5 %
                        rnd = 0.005;
                    } else {
                        // after 99%, don't increment:
                        rnd = 0;
                    }

                    var pct = _status() + rnd;
                    _set(pct);
                }

                function _status() {
                    return status;
                }

                function _completeAnimation() {
                    status = 0;
                    started = false;
                }

                function _complete() {
                    if (!$animate) {
                        $animate = $injector.get('$animate');
                    }

                    $rootScope.$broadcast('cfpLoadingBar:completed');
                    _set(1);

                    $timeout.cancel(completeTimeout);

                    // Attempt to aggregate any start/complete calls within 500ms:
                    completeTimeout = $timeout(function() {
                        var promise = $animate.leave(loadingBarContainer, _completeAnimation);
                        if (promise && promise.then) {
                            promise.then(_completeAnimation);
                        }
                        $animate.leave(spinner);
                    }, 500);
                }

                return {
                    start            : _start,
                    set              : _set,
                    status           : _status,
                    inc              : _inc,
                    complete         : _complete,
                    autoIncrement    : this.autoIncrement,
                    includeSpinner   : this.includeSpinner,
                    latencyThreshold : this.latencyThreshold,
                    parentSelector   : this.parentSelector,
                    startSize        : this.startSize
                };


            }];     //
        });       // wtf javascript. srsly
})();       //
