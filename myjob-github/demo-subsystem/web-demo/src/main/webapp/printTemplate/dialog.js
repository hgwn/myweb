//////////////new dialog/////////////////////////
//filebox
$.extend($.fn.validatebox.defaults.rules, {
    picPath: {
        validator: function(value, param){
        	var flag= NewDialog.validateFileBox(value);
        	if(flag){
        		UpladFile("getTemp.do",NewDialog.file)
        	}
            return flag
        },
        message: '请选择图片文件'
    }
});
$.extend($.fn.validatebox.defaults.rules, { //验证模板名称唯一
	tempName: {
        validator: function(value, param){
            return NewDialog.validateTempName(value);
        },
        
        message: '已存在该模板名称'
    }
});
function UpladFile(url,fileObj) {
    var form = new FormData();
    form.append("upfile", fileObj.files[0]);                           // 文件对象
	$.ajax({  
        url: '../base/fileUpload.do',  
        type: 'POST',  
        data: form,  
        dataType: 'JSON',  
        cache: false,  
        processData: false,  
        contentType: false  
    }).done(function(msg){  
    	if(msg.ret==0){
    		NewDialog.m_backUrL=msg.data.upfile;
    		NewDialog.m_backUrlmsg=null;
    	}else{
    		NewDialog.m_backUrlmsg="图片上传失败请重新选择！"
    	}
    	$.messager.show({title:'系统信息', msg: msg.message});
    });  
    return false;  
   
}
function NewDialog(dlgObj, typeObj, nameObj, authorObj, widthObj, heightObj, bgObj){
    this.m_dlg = dlgObj;
    this.m_temptype = typeObj;
    this.m_tempname = nameObj;
    this.m_author = authorObj;
    this.m_width = widthObj;
    this.m_height = heightObj;
    this.m_background = bgObj;
    NewDialog.file=bgObj.parent().find(".textbox-value").get(0);
   
    //改写filebox
    /*  this.m_background.textbox({onClickButton: function(){
     MsgDispatch.sendMessage("onBrowsePicture", ["{}"], function(param, sender){
            $(sender).textbox("setValue", param.path);
        }, this);
    }});*/
}
NewDialog.prototype = {
    open: function(temptypes){
        this.m_temptype.combobox({textField:'title',valueField:'templatetypeid'});
        if(temptypes && temptypes.length != 0){
            this.m_temptype.combobox("loadData", temptypes);
        }
        this.m_tempname.textbox("clear");
        this.m_author.textbox("clear");
        this.m_width.numberbox("clear");
        this.m_height.numberbox("clear");
        this.m_background.textbox("clear");
   
        this.m_dlg.show();
    },
    close: function(){
        this.m_dlg.hide();
    },
    validate: function(){
        var description = "";
        if(this.m_temptype.combobox("getText") == ""){
            description = "模板类型不能为空";
        }
        else if(this.m_tempname.textbox("getValue") == ""){
            description = "模板名称不能为空";
        }
        else if(!this.m_width.numberbox("getValue")){
            description = "宽度不能为空或0";
        }
        else if(!this.m_height.numberbox("getValue")){
            description = "高度不能为空或0";
        }
       else if(!NewDialog.validateFileBox(this.m_background.textbox("getValue"))){
            description = "请选择bmp/jpg/png图片文件";
        }
        else if(!NewDialog.validateTempName(this.m_tempname.textbox("getValue"))){
            description = "模版名称已存在";
        }
        if(description != ""){
            $.messager.show({title:'系统信息', msg: description});
            return false;
        }
        else{
            return true;
        }
    },
    getData: function(){
    	 var data = {};
    	 	data["temptype"] = this.m_temptype.combobox("getValue");	
    	 	data["templatetypename"] = this.m_temptype.combobox("getText");	
    	 	data["templatetypeid"] = this.m_temptype.combobox("getValue");	
    		data["tempname"] = this.m_tempname.textbox("getValue");
	       // data["createdby"] = this.m_author.textbox("getValue");
	        data["createdby"] = "";   //获取用户ID生成
	        data["width"] = this.m_width.numberbox("getValue");
	        data["height"] = this.m_height.numberbox("getValue");
	        data["pictureurl"] = NewDialog.m_backUrL;
	        data["action"] = 'create';
        return data;
    }
}
//static method
NewDialog.m_backUrL=null;

NewDialog.validateFileBox = function(value){
    if(value == ""){
    	NewDialog.m_backUrL=" ";
        return true;
    }
    
    var reg = /(\.jpg)|(\.png)|(\.bmp)$/i;
    if(reg.test(value)){
        return true;
    }
    else{
    return false;
    }
}
NewDialog.validateTempName = function(value){
    if(value == ""){
    	  return true; 
    }
    
     for(var i=0;i<MsgDispatch.tempDatas.length;i++){
    	 if(value==MsgDispatch.tempDatas[i].tempname){
    		 return false
    	 }
     }
    return true;
}
//////////////new dialog end/////////////////////////

//////////////open dialog/////////////////////////
function OpenDialog(dlgObj, datagridObj){
    this.m_dlg = dlgObj;
    this.m_datagrid = datagridObj;
    this.data=null;
}
OpenDialog.prototype = {
    open: function(temptypes, tempinfos){
        this.m_dlg.show();
        this.m_temptype = {};
        for(var i = 0; i < temptypes.length; ++i){
            this.m_temptype[temptypes[i].id] = temptypes[i].title;
        }
        
        var temptype = this.m_temptype;
       // var opt = this.m_datagrid.datagrid("getColumnOption", "temptype");
     //   opt.formatter = function(value, row, index){
      //      if(temptype && value in temptype){
      //          return temptype[value];
       //     }
       //     else{
       //         return value;
       //     }
      //  };
        if(tempinfos){
            this.m_datagrid.datagrid("loadData", {total:tempinfos.length, rows: tempinfos});
        }
    },
    close: function(){
        this.m_dlg.hide();
    },
    openFile: function(){
        var row = this.m_datagrid.datagrid("getSelected");
        var param = {};
        param["tempid"] = row["tempid"];
        public_sendMessage("onOpenTemplate", [JSON.stringify(param)]);
    },
    deleteFile: function(index){
        if(index == undefined){
            var row = this.m_datagrid.datagrid("getSelected");
            var index = this.m_datagrid.datagrid("getRowIndex", row);
            if(row == null){
                $.messager.show({title:'系统信息', msg: '请选择一项进行删除'});
                return;
            }
            $.messager.confirm('系统信息','确定删除此模版？',function(r){
                if (r){
                    var param = {};
                    param["index"] = index;
                    param["tempid"] = row["tempid"];
                    public_sendMessage("onDeleteTemplate", [JSON.stringify(param)]);
                }
            });
        }
        else {
            this.m_datagrid.datagrid("deleteRow", index);
        }
    }
}
//////////////open dialog end/////////////////////////

//////////////my messagebox/////////////////////////
var LMsgBox = {};
LMsgBox.show = function(msg, func){
    $("#msgYes").linkbutton({onClick: function(){func("yes");$("#msgbox").dialog("close");}});
    $("#msgNo").linkbutton({onClick: function(){func("no");$("#msgbox").dialog("close");}});
    $("#msgCancel").linkbutton({onClick: function(){func("cancel");$("#msgbox").dialog("close");}});
    $("#msgbox").dialog("open");
}
//////////////my messagebox end/////////////////////////