var tempItem = null;
var property = null;
var mainView = null;

$(function(){
    mainView = new MainView(
        new NewDialog($("#newdialog"),$("#ndtype"),$("#ndname"),$("#ndauthor"),$("#ndwidth"),$("#ndheight"),$("#ndbackground")),
        new OpenDialog($("#opendialog"), $("#odgrid")),
        new WorkPlace($("#workdialog"), $("#wdcanvas"), $("#mmpicture"), $("#mmdataitem"),
            $("#tbalignup"), $("#tbaligndown"), $("#tbalignleft"), $("#tbalignright"),
            $("#tbmaxwidth"), $("#tbminwidth"), $("#tbmaxheight"), $("#tbminheight"))
    );
    tempItem = new Accordion($("#tempitemlist"));
    property = new PropertyGrid($("#propertylist"));
    FileMenu.object = $("#mmfile");  
    documentOnload()
});

function documentOnload(){
	$.ajax({ //获取左边栏目
		url:"getPlaform.do",
		dataType:"json",
		error: function(){console.log("请求失败")},
		success: function(msg){
			console.log(msg)
			msg.action="onOpenTemplate";
			 if(msg.ret==0)
			 OnCefLoadCompletedCallBack(msg.data.rows)
			 else{
				  $.messager.show({
		                title: "系统信息",
		                msg: "打开模板操作失败"
		            });
			 }
		}
	})	
}
function OnCefLoadCompletedCallBack(param) {
    tempItem.setData(DataFormat.formatTempItem(param));
    MsgDispatch.temptypes = tempItem.getTempTypes();
    mainView.openOpenDialog();
}
function OnRequestParamsCallBack(param) {
    if(param.action == "onOpenTemplate"){
        if(param["ret"] > 0){
            mainView.beginWork(DataFormat.formatTempInfo(param["tempinfo"]), DataFormat.formatDataItem(param["dataitem"]));
        }
        else{
            $.messager.show({
                title: "系统信息",
                msg: "打开模板操作失败"
            });
        }
    }
    else if(param.action == "onDeleteTemplate"){
        if(param["result"] > 0){
            mainView.deleteFile(param["index"]);
            $.messager.show({
                title: "系统信息",
                msg: "删除操作成功"
            });
        }
        else{
            $.messager.show({
                title: "系统信息",
                msg: "删除操作失败"
            });
        }
    }
    else{
        MsgDispatch.onMessage(param);
    }
}
MsgDispatch = {
    temptypes: null,
    tempDatas:[],
    msgData: {},
    sendMessage: function(action, param, func, sender, userData){
        this.msgData[action] = {
            func: func,
            sender: sender,
            userData: userData
        };
        public_postMessage(action, param);
    },
    onMessage: function(param){
        if(param.action in this.msgData && this.msgData[param.action].func){
            var userData = this.msgData[param.action].userData;
            var sender = this.msgData[param.action].sender;
            this.msgData[param.action].func(param, sender, userData);
            delete this.msgData[param.action];
        }
    },
    
    //tree选中某项的回调函数，function(node, data);node返回tree的节点node,data为用户绑定的数据
    onTempInfoSelect: function(data){
        property.setTempInfo(data);
    },
    onTempItemSelect: function(node, data){
        property.setTempItemData(data);
    },
    onDataItemSelect: function(tempinfo, dataitem, index){
        property.setDataItemData(tempinfo, dataitem, index);
    },
    //tree拖动drag结束后的回调函数，function(node, e, data);
    onTempItemDragOver: function(node, e, data){
        if(!WorkPlace.bDrop) return;
        
        var point = {left:e.data.left,top:e.data.top};
        mainView.addDataItem(point, data);
        
        WorkPlace.bDrop = false;
    },
    onPropertyChange: function(key, value, index){
        mainView.m_workplace.modify(key, value, index);
    },
    onClearProperty: function(){
        property.clear();
    },
    onRefreshProperty: function(){
        property.refresh();
    },
    onTestKey: function(){
        if(!mainView.isWork()) return false;
        if(property.isEdit()) return false;
        
        return true;
    }
}
FileMenu = {
    object: null,
    begin:function(){
        this.object.menu("enableItem", $("#mfsave")[0]);
        this.object.menu("enableItem", $("#mfclose")[0]);
    },
    end:function(){
        this.object.menu("disableItem", $("#mfsave")[0]);
        this.object.menu("disableItem", $("#mfclose")[0]);
        property.clear();
    },
    onNew: function(){
        var pThis = this;
        if(mainView.isWork() && mainView.needSave()){
            LMsgBox.show("当前模板已经经过修改，是否保存当前模板？", function(r){
                if (r == "yes"){
                    pThis.onSave();
                }
                if(r == "yes" || r == "no"){
                    if(mainView.openNewDialog()){
                        property.clear();
                    }
                }
            });
        }
        else{
            if(mainView.openNewDialog()){
                property.clear();
            }
        }
    },
    onOpen: function(){
        var pThis = this;
        if(mainView.isWork() && mainView.needSave()){
            LMsgBox.show("当前模板已经经过修改，是否保存当前模板？", function(r){
                if (r == "yes"){
                    pThis.onSave();
                }
                if(r == "yes" || r == "no"){
                    if(mainView.openOpenDialog()){
                        property.clear();
                    }
                }
            });
        }
        else{
            if(mainView.openOpenDialog()){
                property.clear();
            }
        }
    },
    onSave: function(){
        mainView.save();
    }
}