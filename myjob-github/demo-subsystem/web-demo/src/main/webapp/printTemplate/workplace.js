WorkPlace.bDrop = false;

function WorkPlace(dlgObj, canvasObj, picmenuObj, itemmenuObj,
        tbalignupObj, tbaligndownObj, tbalignleftObj, tbalignrightObj,
        tbmaxwidthObj, tbminwidthObj, tbmaxheightObj, tbminheightObj){
    this.m_dlg = dlgObj;
    this.m_canvas = canvasObj;
    this.m_picMenu = picmenuObj;
    this.uploadImg =$("#modeifyfile");
    this.m_data = new TemplateData(itemmenuObj,
        tbalignupObj, tbaligndownObj, tbalignleftObj, tbalignrightObj,
        tbmaxwidthObj, tbminwidthObj, tbmaxheightObj, tbminheightObj);
    
    this.init();
}
WorkPlace.prototype = {
    init: function(){
        var pThis = this;
        
        this.m_canvas.bind("click", function(){
            pThis.m_data.unselectAll();
            MsgDispatch.onTempInfoSelect(pThis.m_data.getTemplate());
        });
        this.m_canvas.bind("contextmenu", function(e){
            e.preventDefault();
            pThis.m_picMenu.menu('show', {
                left: e.pageX,
                top: e.pageY
            });

        });
        this.m_canvas.bind("error", function(){
            $(this).attr("src", "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==");
            var originalPic = pThis.m_data.getTemplate().pictureurl;
            pThis.m_data.setPicture("");
            
            pThis.m_picMenu.menu("disableItem", $("#mpsaveas")[0]);
            
            if(originalPic!=" "){
	            $.messager.show({
	                title: "系统信息",
	                msg: "找不到背景图片<br/>路径：" + originalPic
	            });
            }
        });
        this.m_canvas.droppable({
            onDragEnter: function(e, source){
                $(source).draggable('proxy').css("cursor", "pointer");
                $(source).draggable('options').cursor='pointer';
                
                $(".mainview").addClass("workplace-over");
            },
            onDragLeave: function(e, source){
                $(source).draggable('proxy').css("cursor", "not-allowed");
                $(source).draggable('options').cursor='not-allowed';
                
                $(".mainview").removeClass("workplace-over");
            },
            onDrop: function(e, source){
                WorkPlace.bDrop = true;
                $(".mainview").removeClass("workplace-over");
            }
        });
        
     
        this.uploadImg.filebox({
        	 buttonText: 'Choose File', 
        	 buttonAlign: 'left',
        	 onChange:function(){
        		  		var file=$("#modeifyfile").parent().find(".textbox-value").get(0).files[0];
        			    var form = new FormData();
        			    form.append("upfile", file);                           // 文件对象
        				var backUrl=null;
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
        			    		 pThis.m_data.setPicture(msg.data.upfile);
        		        		 pThis.m_canvas.attr("src", msg.data.upfile);
        			    	}
        			    	$.messager.show({title:'系统信息', msg: msg.message});
        			    });  
       		  
        	
        		// pThis.m_data.setPicture(newValue);
        		// pThis.m_canvas.attr("src", newValue);
        	 }
        });
        this.m_picMenu.menu({
            onClick: function(item){
                switch(item.name){
                case "change":
                	$("#modeifyfile+.filebox .textbox-button").click();
                    MsgDispatch.sendMessage("onBrowsePicture", ["{}"], function(param, sender){
                        if(param.path){
                            sender.m_data.setPicture(param.path);
                            sender.m_canvas.attr("src", param.path);
                        }
                    }, pThis);
                break;
                case "saveas":
                    var param = {
                        path:pThis.m_data.getTemplate().pictureurl.replace(/\//g, "\\")
                    };
                    MsgDispatch.sendMessage(
                        "onSavePicture",
                        [JSON.stringify(param)],
                        function(param, sender){
                            if(param.result == -1) return;
                            
                            var desc;
                            if(param.result == 0){
                                desc = "保存图片失败，请稍后重试";
                            }
                            else{
                                desc = "保存图片成功";
                            }
                            $.messager.show({
                                title: "系统信息",
                                msg: desc
                            });
                        },
                        pThis
                    );
                break;
                }
            }
        });
        var bDel = false;
        document.onkeydown = function(e){
            if(jQuery.isEmptyObject(pThis.m_data.m_selectedlist) || !MsgDispatch.onTestKey()) return;
            
            switch(e.which){
            case 46:        //delete
                if(bDel) break;
                bDel = true;
                $.messager.confirm('系统信息','确定要删除选中的控件？',function(r){
                    bDel = false;
                    if (r){
                        pThis.m_data.deleteSelectedItem();
                    }
                });
            break;
            case 37:        //left
                pThis.m_data.moveUnitSelectedItem("left");
            break;
            case 38:        //up
                pThis.m_data.moveUnitSelectedItem("up");
            break;
            case 39:        //right
                pThis.m_data.moveUnitSelectedItem("right");
            break;
            case 40:        //down
                pThis.m_data.moveUnitSelectedItem("down");
            break;
            }
        }
    },
    show: function(){
        this.m_dlg.show();
    },
    endWork: function(){
        this.m_dlg.hide();
        this.m_canvas.attr("src", "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==");
        this.m_data.clear();
    },
    setData: function(tempinfo, dataitem){
    	this.m_data.setTemplate(tempinfo);
        //tempinfo
        this.m_dlg.css("width", tempinfo.width + "mm");
        this.m_dlg.css("height", tempinfo.height + "mm");
        if(tempinfo.pictureurl){
        	if(tempinfo.pictureurl)
            tempinfo.pictureurl = tempinfo.pictureurl.replace(/\\/g, "/");
            //设置背景图片
            var rand = new Date();
            this.m_canvas.attr("src", tempinfo.pictureurl + "?" + rand.getTime());
            
            this.m_picMenu.menu("enableItem", $("#mpsaveas")[0]);
        }
        else{
            this.m_picMenu.menu("disableItem", $("#mpsaveas")[0]);
        }
        
        this.m_data.setDPI(this.m_canvas.width() / tempinfo.width);
        
        //dataitem        
        var dpi = this.m_data.getDPI();
        if(dataitem&&dataitem.length>0){
        for(var i = 0; i < dataitem.length; ++i){
            var row = dataitem[i];
            var key;
            
            key = "x";
            row[key] = eval(row[key]).toFixed(2).toString();
            key = "y";
            row[key] = eval(row[key]).toFixed(2).toString();
            key = "cx";
            row[key] = eval(row[key]).toFixed(2).toString();
            key = "cy";
            row[key] = eval(row[key]).toFixed(2).toString();
            
            this.m_data.add(this.m_dlg, dataitem[i]);
        }
        }
    },
    needSave: function(){
        var param = {};
        param["tempinfo"] = DataFormat.recoverTempInfo(this.m_data.getTemplate());
        param["dataitem"] = DataFormat.recoverDataItem(this.m_data.getDataItems());

        if(!("action" in param["tempinfo"]) && !param["dataitem"].length)
            return false;

        return true;
    },
    saveData: function(){
        var param = {};
        param["tempinfo"] = DataFormat.recoverTempInfo(this.m_data.getTemplate());
        param["tempinfo"]["templatedataitem"]  = DataFormat.recoverDataItem(this.m_data.getDataItems());
       if(param["tempinfo"]["templatedataitem"]==null||param["tempinfo"]["templatedataitem"].length==0&&("action" in param["tempinfo"])){
    	   $.messager.show({title:'系统信息', msg: '模板不能为空'});
       }else{
        MsgDispatch.sendMessage("onSaveTemplate", [JSON.stringify(param)], function(param, sender){
            if(param["result"] > 0){
                sender.m_data.setTempID(param["result"]);
                $.messager.show({
                    title: "系统信息",
                    msg: "保存操作成功"
                });

                //改变source
                sender.m_data.setStateSave();
            }
            else{
                $.messager.show({
                    title: "系统信息",
                    msg: "保存操作失败"
                });
            }
        }, this);}
    },
    //point为绝对位置，即相对于浏览器的坐标位置
    addDataItem: function(point, tempitem){
    	
        var clientPoint = this.toClient(point);
        //保存数据
        var dataitem = {
        	dataid: 0,
            dataname: tempitem.title,
            displayname: tempitem.title,
            groupid: 0,
            datatype: 100,  //默认
            typeparam: '',
            linkparam: tempitem.param,
            x: clientPoint.left.toString(),
            y: clientPoint.top.toString(),
            /////待修改
            // cx: "0",
            // cy: "0",
            isprint: 1,  
            action:"add"
        };
        this.m_data.unselectAll();
        this.m_data.add(this.m_dlg, dataitem);
        //选中
        this.m_data.unselectAll(); 
        this.m_data.select(this.m_data.getLength() - 1);
      
    },
    modify: function(key, value, index){
        if(index == -1){
            var css = {};
            css[key] = value + "mm";
            this.m_dlg.animate(css, 500);
            this.m_data.modifyTempInfo(key, value);
        }
        else{
            this.m_data.modifyDataItem(key, value, index);
        }
    },
    toClient: function(point){
        point.left -= this.m_canvas.offset().left;
        point.top -= this.m_canvas.offset().top + 1;//1px修正
        
        if(point.left < 0) point.left = 0;
        if(point.top < 0) point.top = 0;
        
        var dpi = this.m_data.getDPI();
        point.left = (point.left / dpi).toFixed(2);
        point.top = (point.top / dpi).toFixed(2);
        
        return point;
    }
}
function TemplateData(itemmenuObj,
        tbalignupObj, tbaligndownObj, tbalignleftObj, tbalignrightObj,
        tbmaxwidthObj, tbminwidthObj, tbmaxheightObj, tbminheightObj){
    this.m_itemMenu = itemmenuObj;
    
    this.m_tbAlignUp = tbalignupObj;
    this.m_tbAlignDown = tbaligndownObj;
    this.m_tbAlignLeft = tbalignleftObj;
    this.m_tbAlignRight = tbalignrightObj;
    
    this.m_tbMaxWidth = tbmaxwidthObj;
    this.m_tbMinWidth = tbminwidthObj;
    this.m_tbMaxHeight = tbmaxheightObj;
    this.m_tbMinHeight = tbminheightObj;
    
    this.m_tempinfo = null;
    this.m_dataitem = [];
    this.m_selectedlist = {};
    
    this.m_dpi = 0;
    
    this.init();
}


TemplateData.prototype.init = function(){
    var pThis = this;
    
    this.m_itemMenu.menu({
        onClick: function(item){
            switch(item.name){
            case "delete":
                pThis.deleteSelectedItem();
            break;
            case "alignup":
                pThis.alignUpSelectedItem();
            break;
            case "aligndown":
                pThis.alignDownSelectedItem();
            break;
            case "alignleft":
                pThis.alignLeftSelectedItem();
            break;
            case "alignright":
                pThis.alignRightSelectedItem();
            break;
            case "maxwidth":
                pThis.maxWidthSelectedItem();
            break;
            case "minwidth":
                pThis.minWidthSelectedItem();
            break;
            case "maxheight":
                pThis.maxHeightSelectedItem();
            break;
            case "minheight":
                pThis.minHeightSelectedItem();
            break;
            }
        }
    });
    
    this.m_tbAlignUp.linkbutton({onClick: function(){
        pThis.alignUpSelectedItem();
    }});
    this.m_tbAlignDown.linkbutton({onClick: function(){
        pThis.alignDownSelectedItem();
    }});
    this.m_tbAlignLeft.linkbutton({onClick: function(){
        pThis.alignLeftSelectedItem();
    }});
    this.m_tbAlignRight.linkbutton({onClick: function(){
        pThis.alignRightSelectedItem();
    }});
    
    this.m_tbMaxWidth.linkbutton({onClick: function(){
        pThis.maxWidthSelectedItem();
    }});
    this.m_tbMinWidth.linkbutton({onClick: function(){
        pThis.minWidthSelectedItem();
    }});
    this.m_tbMaxHeight.linkbutton({onClick: function(){
        pThis.maxHeightSelectedItem();
    }});
    this.m_tbMinHeight.linkbutton({onClick: function(){
        pThis.minHeightSelectedItem();
    }});
}
TemplateData.prototype.setDPI = function(dpi){
    this.m_dpi = dpi;
}
TemplateData.prototype.getDPI = function(){
    return this.m_dpi;
}
TemplateData.prototype.setTemplate = function(data){
    this.m_tempinfo = data;
}
TemplateData.prototype.getTemplate = function(){
    return this.m_tempinfo;
},
TemplateData.prototype.setTempID = function(tempid){
    this.m_tempinfo["tempid"] = tempid;
}
TemplateData.prototype.setPicture = function(path){
    this.m_tempinfo["pictureurl"] = path;
}
TemplateData.prototype.getDataItems = function(){
    var data = [];
    for(var i = 0; i < this.m_dataitem.length; i++){
        if("action" in this.m_dataitem[i].dataitem){
            data.push(this.m_dataitem[i].dataitem);
        }
    }
    return data;
}
TemplateData.prototype.getLength = function(){
    return this.m_dataitem.length;
}
TemplateData.prototype.add = function(parent, dataitem){
    var value = $('<div index=' + this.getLength() + ' class="dataitem easyui-draggable easyui-resizable" disabled=true style="left:' + dataitem.x + 'mm;top:' + dataitem.y + 'mm;" onselectstart="return false;">' + dataitem.displayname + '</div>');
    parent.append(value);
    $.parser.parse(parent);
    ////选中事件
    var pThis = this;
    
    var bDrag = false;
    value.bind("click", function(){
        if(bDrag){
            bDrag = false;
            return;
        }
        
        if(!window.event.ctrlKey){
            pThis.unselectAll();
        }
        
        pThis.select($(this).attr("index"));
    });        
    
    //拖动事件
    var ePos = {left:0, top:0};
    
    value.draggable({
        edge:5,
        onStartDrag: function(e){
            ePos.left = e.data.left;
            ePos.top = e.data.top;
        },
        onDrag: function(e){
            //限制拖动范围
                
            var d = e.data;
            if (d.left < 0){d.left = 0}
            if (d.top < 0){d.top = 0}
            if (d.left + $(d.target).outerWidth() > $(d.parent).width()){
                d.left = $(d.parent).width() - $(d.target).outerWidth();
            }
            if (d.top + $(d.target).outerHeight() > $(d.parent).height()){
                d.top = $(d.parent).height() - $(d.target).outerHeight();
            }
            
            var point = {left: d.left - ePos.left, top: d.top - ePos.top};
            pThis.moveSelectedItem(this, point);
        },
        onStopDrag: function(e){
            if(ePos.left == e.data.left && ePos.top == e.data.top){
                return;
            }
            bDrag = true;
            setTimeout(function(){ bDrag = false }, 500);
            
            var pos = {left: $(this).offset().left - e.data.left, top:$(this).offset().top - e.data.top};
            
            for(var i in pThis.m_selectedlist){
                pThis.modifyDataItem("x",((pThis.m_dataitem[i].target.offset().left - pos.left) / pThis.getDPI()).toFixed(2).toString(), i, true);
                pThis.modifyDataItem("y", ((pThis.m_dataitem[i].target.offset().top - pos.top) / pThis.getDPI()).toFixed(2).toString(), i, true);
            }

            MsgDispatch.onDataItemSelect(pThis.m_tempinfo, pThis.m_dataitem[$(this).attr("index")].dataitem, $(this).attr("index"));
    }});
    //resize事件
    value.resizable({
        handles:'e,s,se',
        onStopResize: function(e){
            pThis.modifyDataItem("cx", (e.data.width / pThis.getDPI()).toFixed(2).toString(), $(this).attr("index"), true);
            pThis.modifyDataItem("cy", (e.data.height / pThis.getDPI()).toFixed(2).toString(), $(this).attr("index"), true);
        }
    });

    //补充dataitem的cx,xy
    if(!("cx" in dataitem) || !("cy" in dataitem)){
        dataitem.cx = (value.width() / pThis.getDPI() + 0.01).toFixed(2).toString();
        dataitem.cy = (value.height() / pThis.getDPI()).toFixed(2).toString();
    }
    value.css("width", dataitem.cx + "mm");
    value.css("height", dataitem.cy + "mm");

    if(!("fontsize" in dataitem)){
    	value.css("font-size", "12pt");
    	dataitem.fontsize=12
    }else{
    	value.css("font-size", dataitem.fontsize+"pt");
    }
    if(!("fontcolor" in dataitem)){
    	value.css("color", "#000"); 
       dataitem.fontcolor="#000"
    }else{
    	 value.css("color", dataitem.fontcolor );
    }
    if(!("intervals" in dataitem)){
        dataitem.intervals=0
    }
    

    this.m_dataitem.push({dataitem: dataitem, target: value});
}
TemplateData.prototype.modifyTempInfo = function(key, value){        
    this.m_tempinfo[key] = value.toString();
    this.m_tempinfo["action"] = "modify";
}
TemplateData.prototype.modifyDataItem = function(key, value, index, nocss){   
    var css = {};
    var dataitem = this.m_dataitem[index];
    switch(key){
    case "displayname":
        if(!nocss) dataitem.target.html(value);
    break;
    case "x":
        css["left"] = value + "mm";
        if(!nocss) dataitem.target.animate(css, 500);
    break;
    case "y":
        css["top"] = value + "mm";
        if(!nocss) dataitem.target.animate(css, 500);
    break;
    case "cx":
        css["width"] = value + "mm";
        if(!nocss) dataitem.target.animate(css, 500);
    break;
    case "cy":
        css["height"] = value + "mm";
        if(!nocss) dataitem.target.animate(css, 500);
    break;
    case "fontsize":
        css["font-size"] = value + "pt";
        if(!nocss) dataitem.target.animate(css, 500);
    break;
    case "fontsize":
        css["font-size"] = value + "pt";
        if(!nocss) dataitem.target.animate("font-size",value + "pt");
    break;
    case "fontcolor":
        css["color"] = value ;
        if(!nocss) dataitem.target.css("color",value);
    break;
    case "isprint":
        value = (value == "是" ? 1 : 400);
        
    break;
    }
    if(key == "datatype"){
        dataitem.dataitem["datatype"] = value.datatype.toString();
        dataitem.dataitem["typeparam"] = value.typeparam;
       
    }else if(key=="isprint"){
    	 dataitem.dataitem[key] = value;
    }
    else{
        dataitem.dataitem[key] = value.toString();
    }
    
    if(!("action" in dataitem.dataitem) || dataitem.dataitem["action"] != "add"){
        dataitem.dataitem["action"] = "modify";
    }
}
TemplateData.prototype.alignUpSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;

    var minY = 99999;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.y) < minY) minY = eval(this.m_dataitem[i].dataitem.y);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.y = minY.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["top"] = minY + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
},
TemplateData.prototype.alignDownSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var maxY = 0;
    for(var i in this.m_selectedlist){
        var item = this.m_dataitem[i].dataitem;
        
        var temp = eval(item.y) + eval(item.cy);
        if(temp > maxY) maxY = temp;
    }
    for(var i in this.m_selectedlist){
        var top = eval(maxY - this.m_dataitem[i].dataitem.cy);
        this.m_dataitem[i].dataitem.y = top.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["top"] = top + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.alignLeftSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var minX = 99999;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.x) < minX) minX = eval(this.m_dataitem[i].dataitem.x);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.x = minX.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["left"] = minX + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.alignRightSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var maxX = 0;
    for(var i in this.m_selectedlist){
        var item = this.m_dataitem[i].dataitem;
        
        var temp = eval(item.x) + eval(item.cx)
        if(temp > maxX) maxX = temp;
    }
    for(var i in this.m_selectedlist){
        var left = eval(maxX - this.m_dataitem[i].dataitem.cx);
        this.m_dataitem[i].dataitem.x = left.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["left"] = left + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.maxWidthSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var maxWidth = 0;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.cx) > maxWidth) maxWidth = eval(this.m_dataitem[i].dataitem.cx);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.cx = maxWidth.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["width"] = maxWidth + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.minWidthSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var minWidth = 99999;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.cx) < minWidth) minWidth = eval(this.m_dataitem[i].dataitem.cx);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.cx = minWidth.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["width"] = minWidth + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.maxHeightSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var maxHeight = 0;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.cy) > maxHeight) maxHeight = eval(this.m_dataitem[i].dataitem.cy);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.cy = maxHeight.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["height"] = maxHeight + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.minHeightSelectedItem = function(){
    if(jQuery.isEmptyObject(this.m_selectedlist)) return;
    
    var minHeight = 99999;
    for(var i in this.m_selectedlist){
        if(eval(this.m_dataitem[i].dataitem.cy) < minHeight) minHeight = eval(this.m_dataitem[i].dataitem.cy);
    }
    for(var i in this.m_selectedlist){
        this.m_dataitem[i].dataitem.cy = minHeight.toFixed(2).toString();
        if(!("action" in this.m_dataitem[i].dataitem)){
            this.m_dataitem[i].dataitem["action"] = "modify";
        }
        //css
        var css = {};
        css["height"] = minHeight + "mm";
        this.m_dataitem[i].target.animate(css, 500);
    }
}
TemplateData.prototype.moveSelectedItem = function(moveItem, pos){//pos,与开始位置之间的偏移值
    for(var i in this.m_selectedlist){
        var t = this.m_dataitem[i].target;
        var d = this.m_dataitem[i].dataitem;
        if(t != moveItem){
            t.css("left", d.x * this.getDPI() + pos.left + "px");
            t.css("top", d.y * this.getDPI() + pos.top + "px");
        }
    }
}
TemplateData.prototype.moveUnitSelectedItem = function(direction){
    for(var i in this.m_selectedlist){
        var t = this.m_dataitem[i].target;
        var d = this.m_dataitem[i].dataitem;
        
        if(direction == "left"){
            var temp = Math.ceil(eval(d.x) - 1);
            if(temp < 0) temp = 0;
            d.x = temp.toFixed(2).toString();
            t.css("left", d.x + "mm");
        }
        else if(direction == "up"){
            var temp = Math.ceil(eval(d.y) - 1);
            if(temp < 0) temp = 0;
            d.y = temp.toFixed(2).toString();
            t.css("top", d.y + "mm");
        }
        else if(direction == "right"){
            var temp = Math.floor(eval(d.x) + 1);
            var max = eval(this.m_tempinfo.width) - eval(d.cx);
            if(temp > max) temp = max; 
            d.x = temp.toFixed(2).toString();
            t.css("left", d.x + "mm");
        }
        else if(direction == "down"){
            var temp = Math.floor(eval(d.y) + 1);
            var max = eval(this.m_tempinfo.height) - eval(d.cy);
            if(temp > max) temp = max; 
            d.y = temp.toFixed(2).toString();
            t.css("top", d.y + "mm");
        }
    }
    MsgDispatch.onRefreshProperty();
}
TemplateData.prototype.deleteSelectedItem = function(){
    for(var index in this.m_selectedlist){
        var t = this.m_dataitem[index].target;
        t.remove();

        var d = this.m_dataitem[index].dataitem;
        if(d.action && d.action == "add"){
            delete this.m_dataitem[index];
        }
        else{
            this.m_dataitem[index].dataitem.action = "delete";
        }

        delete this.m_selectedlist[index];
    }

    for(var i = this.m_dataitem.length - 1; i >= 0; --i){
        if(this.m_dataitem[i] == undefined){
            this.m_dataitem.splice(i, 1);
        }
    }

    MsgDispatch.onClearProperty();
}
TemplateData.prototype.clear = function(){
    this.unselectAll();
    for(var i = this.m_dataitem.length - 1; i >= 0; --i){
        var e = this.m_dataitem.pop();
        e.target.remove();
    }
}
TemplateData.prototype.select = function(index){
    if(index in this.m_selectedlist) return;
    
    if(jQuery.isEmptyObject(this.m_selectedlist)){
        this.m_tbAlignUp.linkbutton("enable");
        this.m_tbAlignDown.linkbutton("enable");
        this.m_tbAlignLeft.linkbutton("enable");
        this.m_tbAlignRight.linkbutton("enable");
        
        this.m_tbMaxWidth.linkbutton("enable");
        this.m_tbMinWidth.linkbutton("enable");
        this.m_tbMaxHeight.linkbutton("enable");
        this.m_tbMinHeight.linkbutton("enable");
    }
    
    var t = this.m_dataitem[index].target;
    t.draggable("enable");
    t.resizable ("enable");
    t.addClass("dataitem-focus");
    //右键菜单
    var pThis = this;
    t.bind("contextmenu", function(e){
        e.preventDefault();
        pThis.m_itemMenu.menu('show', {
            left: e.pageX,
            top: e.pageY
        });

    });
        
    this.m_selectedlist[index] = true;
    MsgDispatch.onDataItemSelect(this.m_tempinfo, this.m_dataitem[index].dataitem, index);
}
TemplateData.prototype.unselectAll = function(){
    if(!jQuery.isEmptyObject(this.m_selectedlist)){
        this.m_tbAlignUp.linkbutton("disable");
        this.m_tbAlignDown.linkbutton("disable");
        this.m_tbAlignLeft.linkbutton("disable");
        this.m_tbAlignRight.linkbutton("disable");
        
        this.m_tbMaxWidth.linkbutton("disable");
        this.m_tbMinWidth.linkbutton("disable");
        this.m_tbMaxHeight.linkbutton("disable");
        this.m_tbMinHeight.linkbutton("disable");
    }

    for(var index in this.m_selectedlist){
        var t = this.m_dataitem[index].target;
        t.draggable("disable");
        t.resizable ("disable");
        t.removeClass("dataitem-focus");
        t.unbind("contextmenu");
        
        delete this.m_selectedlist[index];
    }
}
TemplateData.prototype.setStateSave = function(){
    delete this.m_tempinfo["action"];
    //dataitem
    for(var i = 0; i < this.m_dataitem.length; i++){
        if("action" in this.m_dataitem[i].dataitem){
            delete this.m_dataitem[i].dataitem["action"];
        }
    }
}