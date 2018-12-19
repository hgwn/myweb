
var user = {
    data: {},
    islogin: function() {
        user.load();
        return (user.data && user.data.id);
    },
    create: function(id, name, token, inviteCode,coverInviteCode, sex, photo, email, phone, account,
            lastLoginTime, payChannel, certificationStatus, keepdays) {
        user.data.id = id;
        user.data.name = name;
        user.data.token = token;
        user.data.inviteCode = inviteCode;
        user.data.coverInviteCode = coverInviteCode;
        user.data.sex = sex;
        user.data.photo = photo;
        user.data.email = email;
        user.data.phone = phone;
        user.data.account = account;
        user.data.lastLoginTime = lastLoginTime;
        user.data.payChannel = payChannel;
        user.data.certificationStatus = certificationStatus;
        user.save(keepdays);
    },
    save: function(keepdays) {

        DataProvider.localStore.save("userSession", user.data, keepdays);
    },
    load: function() {
        // 取出cookie中的json对象
        user.data = DataProvider.localStore.get("userSession") || {};
    },
    del: function() {
        DataProvider.localStore.remove("userSession");
        user.data = {};
    }

};

$.ajaxSetup({//ajax全局配置
    beforeSend: function(xhr) {
        if (user.data.token) {
            xhr.setRequestHeader('Token', user.data.token);
        }
    }
});
var dlService = {
    ajaxBaseUrl: '/api',
    host: window.location.protocol+'//'+window.location.host,
    getApiConf: function(name) {
        return dlService[apiName] || {};
    },
    getApiUrl: function(apiName, sname, path) {

        var apiconf = dlService[apiName];
        if (apiconf) {
            var fullpath = dlService.protocal + "//" + apiconfi.host + "/"
                    + apiName + "/" + sname + path;
            return fullpath;
        } else {
            return "";
        }
    },
    ajax: function(url, type, params,callbacksuccess,callbackerror) {
        var fullpath = dlService.host + url;
        //async = (async==null || async=="" || typeof(async)=="undefined")? "true" : async;
        $.ajax({
            type: type,
            url: fullpath,
            data: params,
            dataType: "json",
            async:false,  //如果需要发送同步请求，请将此选项设置为 false。
            cache: false,
            beforeSend: function(xhr) {
                dlService.ajaxbeforeSend(xhr);
            },
            success: function(data) {
                callbacksuccess(data);
            },
            error: function(xhr, status, err) {
                callbackerror(xhr, status, err);
               dlService.ajaxerror(xhr, status, err);
            }
        });
    },
    
    ajaxJosn: function(url, type, params,callbacksuccess,callbackerror) {
        var fullpath = dlService.host + dlService.ajaxBaseUrl + url;
        //async = (async==null || async=="" || typeof(async)=="undefined")? "true" : async;
        $.ajax({
            type: type,
            url: fullpath,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            dataType: "json",
            async:false,  //如果需要发送同步请求，请将此选项设置为 false。
            cache: false,
            beforeSend: function(xhr) {
                dlService.ajaxbeforeSend(xhr);
            },
            success: function(data) {
                callbacksuccess(data);
            },
            error: function(xhr, status, err) {
                callbackerror(xhr, status, err);
                
            }
        });
    },

    axse: function(url,type, params,callbacksuccess) {
        var fullpath = dlService.host + url;
        $.ajax({
            type: type,
            url: fullpath,
            data: params,
            dataType: "json",
            async:false,     //同步
            success: function(data) {
                callbacksuccess(data);
            }
        });
    },

    ajaxbeforeSend: function(xhr) {
    	if(user.data.token){
    		xhr.setRequestHeader('Token', user.data.token);
    	}
        
    },
    ajaxerror: function(xhr, textStatus, errorThrown) {
        var state = xhr.status;
        if (state == 401) {//Token过去
            user.del();
            Utils.gotoPage('index.html#page=login');
        } else if (state == 403) {//没有相应权限
            jAlert.warn('没有权限');
        } else if( state == 400 || state == 500){
            var errDate=JSON.parse(xhr.responseText);
            jAlert.warn(errDate.msg);
        }
        var codesrclen = $("#codesrc").length;//抛出错误时，验证码重新获取
        if(codesrclen>0){
            factory.getCode("#codesrc");
        }
    },
    //加时间戳前要对URL加个判断，如果有?号就加&_=new Date().getTime()，否则?_=new Date().getTime()
    get: function(url, params, callback) {
        if(url.indexOf("?") != -1){
            var fullpath = dlService.host + url+"&_"+new Date().getTime();
            
        }else{
            var fullpath = dlService.host + url+"?_"+new Date().getTime();
        }
        $.getJSON(fullpath, params, function(data) {
            callback(data);
        });
    },
    put: function(url, params, callback) {
        var fullpath = dlService.host + url;
        dlService.ajax(fullpath, "PUT", params, function(data) {
            callback(data);
        });
    },
    putjSON: function(url, params, callback) {
        var fullpath = dlService.host + url;
        $.ajax({
            url: fullpath,
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            success: function(data) {
                callback(data);
            }
        });
    },
    del: function(url, params, callback) {
        var fullpath = dlService.host + url;
        $.ajax({
            url: fullpath,
            type: 'DELETE',
            data: params,
            success: function(data) {
                callback(data);
            }
        });
    },
    //
    postjSON: function(url, params, callback) {
        var fullpath = dlService.host + url;
        $.ajax({
            url: fullpath,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(params),
            success: function(data) {
                callback(data);
            }
        });
    },
    post: function(url, params, callback) {
        var fullpath = dlService.host + url;
        $.ajax({
            url: fullpath,
            type: 'POST',
            data: params,
            success: function(data) {
                callback(data);
            }
        });
    }
};
dlService.dlapi = {
    host: "192.168.16.11",
    prefix: "dlapi"

};
dlService.dlsys = {
    host: "192.168.16.11",
    prefix: "dlapi",
    apipaths: [{name: "", path: ""}]

};
dlService.dlbiz = {
    host: "192.168.16.11",
    prefix: "dlapi"
};


dlService.CMSService = {
    opt: {
        id: "",
        fullPath: "",
        deepin: 2
    },
    //获取资源
    list: function(params, callback) {
        var CMS = dlService.CMSService;
        var url = "/dlapi/cms/directory/list/resourses";

        var opts = {};
        $.extend(opts, CMS.opt, params);

        dlService.get(url, opts, callback);


    },
    //获取当前目录
    dir: function(params, callback) {
        var CMS = dlService.CMSService;
        var url = "/dlapi/cms/directory/list";

        var opts = {};
        $.extend(opts, CMS.opt, params);
        dlService.get(url, opts, callback);
    }


};