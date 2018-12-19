/**
 * 针对运营管理系统的公共函数
 * Created by lihongwen on 2016/4/1.
 */

//定义全局对象--用于封装基于jquery和easyui组件的一些常用方法 lihongwen 2016/4/14
var factory ={
    //messager消息提示框
    alert:function(info){
        $.messager.alert('提示', info, 'info');
    },
    confirm : function(info, callback, params) {
        $.messager.confirm('提示', info, function(r) {
            if (r && callback) {
                callback(params);
            }
        });
    },
    showProgress : function(info) {
        $.messager.progress({
            title : '请稍后...',
            msg : info
        });
    },
    hideProgress : function() {
        $.messager.progress('close');
    }
};
factory.httpGet = function(url,callback){
    $.get(url,function(data){
        callback(data);
    });
};
factory.getJSON =function(url,callback){
    $.getJSON(url,function(data){
        callback(data);
    });
};
//.done() 和 .fail()方法的功能，（从 jQuery 1.8 开始）允许底层被操纵
factory.httpPost = function(url,params,callback){
    $.ajax({
        type: "post",
        url: url,
        data: params,
        dataType: "json",
        cache:false   //不缓存
    }).done(function(data){
        callback(data);
    }).fail(function(data){
        callback(data);
    })
};
//对话框 dialog
factory.dialog = function(id,url,options){
    var defaultVal = {
            title: '详情',
            width: 600,
            height: 450,
            closed: true,
            cache: false,
            modal: true
        };
    options = $.extend(defaultVal,options);
    options.href = url;
    return $(id).dialog(options);
};


//mainTab选项卡
var mainTab={
    //打开tab选项卡
    addTab:function(title,url){
        if ($('#mainTab').tabs('exists', title)){
            $('#mainTab').tabs('select', title);
        } else {
            $('#mainTab').tabs('add',{
                title:title,
                href:url,
                closable:true
            });
        }
    }
};

//header及sidebaar 切换class
function changeClass(elem,className,num){
    $(elem).eq(num).addClass(className);
    $(elem).click(function(){
        $(elem).removeClass(className);
        $(this).addClass(className);
    });
}
//左侧导航--sidebar.html
var sidenavObj = {
    //加载主体功能页面
    action:{
        openTab:function(elem){
            //console.log(elem);
            var url = $(elem).attr("value");
            var title = $(elem).attr("title");
            //$("#main div.content").load(url);
            mainTab.addTab(title,url);
        }
    },
    //初始化数据并填充数据
    init:function(url){
        $.getJSON(url,function(data){
            Utils.bindList("#sidenav","#sidenavTxl",data,null,function(item,data){
                //debugger;
                Utils.bindList($(item).find(".sidebar-box"),".sidebar-list",data.list,sidenavObj.action)
            });
            //等待dom渲染完成之后调用
            sidenavObj.render();
        });
    },
    //打开二级菜单下第一个子链接
    openFirstLink:function(){
        if($("#sidenav >div.panel").length){
            var li = $("ul.sidebar-box > li").eq(1);
            var url = li.find("a").attr("value");
            $("#main div.content").load(url);
            li.find("a").addClass("active");
        }
    },
    //完成绑定之后操作
    render:function(){
        $('#sidenav').accordion({
            animate:false
        });
        changeClass("#sidebar .sidebar-list a","active");
        //sidenavObj.openFirstLink();
    }
};

/**
 * layout方法扩展
 * @param {Object} jq
 * @param {Object} region
 */
$.extend($.fn.layout.methods, {
    /**
     * 面板是否存在和可见
     * @param {Object} jq
     * @param {Object} params
     */
    isVisible: function(jq, params) {
        var panels = $.data(jq[0], 'layout').panels;
        var pp = panels[params];
        if(!pp) {
            return false;
        }
        if(pp.length) {
            return pp.panel('panel').is(':visible');
        } else {
            return false;
        }
    },
    /**
     * 隐藏除某个region，center除外。
     * @param {Object} jq
     * @param {Object} params
     */
    hidden: function(jq, params) {
        return jq.each(function() {
            var opts = $.data(this, 'layout').options;
            var panels = $.data(this, 'layout').panels;
            if(!opts.regionState){
                opts.regionState = {};
            }
            var region = params;
            function hide(dom,region,doResize){
                var first = region.substring(0,1);
                var others = region.substring(1);
                var expand = 'expand' + first.toUpperCase() + others;
                if(panels[expand]) {
                    if($(dom).layout('isVisible', expand)) {
                        opts.regionState[region] = 1;
                        panels[expand].panel('close');
                    } else if($(dom).layout('isVisible', region)) {
                        opts.regionState[region] = 0;
                        panels[region].panel('close');
                    }
                } else {
                    panels[region].panel('close');
                }
                if(doResize){
                    $(dom).layout('resize');
                }
            };
            if(region.toLowerCase() == 'all'){
                hide(this,'east',false);
                hide(this,'north',false);
                hide(this,'west',false);
                hide(this,'south',true);
            }else{
                hide(this,region,true);
            }
        });
    },
    /**
     * 显示某个region，center除外。
     * @param {Object} jq
     * @param {Object} params
     */
    show: function(jq, params) {
        return jq.each(function() {
            var opts = $.data(this, 'layout').options;
            var panels = $.data(this, 'layout').panels;
            var region = params;

            function show(dom,region,doResize){
                var first = region.substring(0,1);
                var others = region.substring(1);
                var expand = 'expand' + first.toUpperCase() + others;
                if(panels[expand]) {
                    if(!$(dom).layout('isVisible', expand)) {
                        if(!$(dom).layout('isVisible', region)) {
                            if(opts.regionState[region] == 1) {
                                panels[expand].panel('open');
                            } else {
                                panels[region].panel('open');
                            }
                        }
                    }
                } else {
                    panels[region].panel('open');
                }
                if(doResize){
                    $(dom).layout('resize');
                }
            };
            if(region.toLowerCase() == 'all'){
                show(this,'east',false);
                show(this,'north',false);
                show(this,'west',false);
                show(this,'south',true);
            }else{
                show(this,region,true);
            }
        });
    }
});

/*
 * zxxFile.js 基于HTML5 文件上传的核心脚本 http://www.zhangxinxu.com/wordpress/?p=1923
 */
var ZXXFILE = {
    fileInput: null,				//html file控件
    dragDrop: null,					//拖拽敏感区域
    upButton: null,					//提交按钮
    url: "",						//ajax地址
    fileFilter: [],					//过滤后的文件数组
    filter: function(files) {		//选择文件组的过滤方法
        return files;
    },
    onSelect: function() {},		//文件选择后
    onDelete: function() {},		//文件删除后
    onDragOver: function() {},		//文件拖拽到敏感区域时
    onDragLeave: function() {},	//文件离开到敏感区域时
    onProgress: function() {},		//文件上传进度
    onSuccess: function() {},		//文件上传成功时
    onFailure: function() {},		//文件上传失败时,
    onComplete: function() {},		//文件全部上传完毕时

    /* 开发参数和内置方法分界线 */

    //文件拖放
    funDragHover: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
        return this;
    },
    //获取选择文件，file控件或拖放
    funGetFiles: function(e) {
        // 取消鼠标经过样式
        this.funDragHover(e);

        // 获取文件列表对象
        var files = e.target.files || e.dataTransfer.files;
        //继续添加文件
        this.fileFilter = this.fileFilter.concat(this.filter(files));
        this.funDealFiles();
        return this;
    },

    //选中文件的处理与回调
    funDealFiles: function() {
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            //增加唯一索引值
            file.index = i;
        }
        //执行选择回调
        this.onSelect(this.fileFilter);
        return this;
    },

    //删除对应的文件
    funDeleteFile: function(fileDelete) {
        var arrFile = [];
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            if (file != fileDelete) {
                arrFile.push(file);
            } else {
                this.onDelete(fileDelete);
            }
        }
        this.fileFilter = arrFile;
        return this;
    },

    //文件上传
    funUploadFile: function() {
        var self = this;
        if (location.host.indexOf("sitepointstatic") >= 0) {
            //非站点服务器上运行
            return;
        }
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            (function(file) {
                var xhr = new XMLHttpRequest();
                if (xhr.upload) {
                    // 上传中
                    xhr.upload.addEventListener("progress", function(e) {
                        self.onProgress(file, e.loaded, e.total);
                    }, false);

                    // 文件上传成功或是失败
                    xhr.onreadystatechange = function(e) {
                        if (xhr.readyState == 4) {
                            if (xhr.status == 200) {
                                self.onSuccess(file, xhr.responseText);
                                self.funDeleteFile(file);
                                if (!self.fileFilter.length) {
                                    //全部完毕
                                    self.onComplete();
                                }
                            } else {
                                self.onFailure(file, xhr.responseText);
                            }
                        }
                    };

                    // 开始上传
                    xhr.open("POST", self.url, true);
                    xhr.setRequestHeader("X_FILENAME", file.name);
                    xhr.send(file);
                }
            })(file);
        }

    },

    init: function() {
        var self = this;

        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("dragleave", function(e) { self.funDragHover(e); }, false);
            this.dragDrop.addEventListener("drop", function(e) { self.funGetFiles(e); }, false);
        }

        //文件选择控件选择
        if (this.fileInput) {
            this.fileInput.addEventListener("change", function(e) { self.funGetFiles(e); }, false);
        }

        //上传按钮提交
        if (this.upButton) {
            this.upButton.addEventListener("click", function(e) { self.funUploadFile(e); }, false);
        }
    }
};
