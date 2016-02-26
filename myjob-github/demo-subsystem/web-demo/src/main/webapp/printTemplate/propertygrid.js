function PropertyGrid(obj){
    this.m_object = obj;
    this.m_tempinfo = null;
    this.m_data = null;
    this.m_editIndex = null;
    this.m_type = "";    
    
    this.m_editRowIndex = -1;
    
    this.init();
}
PropertyGrid.prototype = {
    clear: function(){
        this.m_object.propertygrid("loadData", {
            total: 0,
            rows: []
        });
    },
    refresh: function(){
        if(this.m_type == "tempinfo"){
            this.setTempInfo(this.m_tempinfo);
        }
        else if(this.m_type == "tempitem"){
            this.setTempItemData(this.m_data);
        }
        else if(this.m_type == "dataitem"){
            this.setDataItemData(this.m_tempinfo, this.m_data, this.m_editIndex);
        }
    },
    isEdit: function(){
        if(this.m_editRowIndex != -1){
            return true;
        }
        else{
            return false;
        }
    },
    init: function(){
        var pThis = this;
        
        var isMyEdit = false;
        
        var editBuffer = {
            datatype: 100,
            typeparam: ""
        };
        
        this.m_object.propertygrid({            
            onClickCell: function(index, field, row){
                if(pThis.m_editRowIndex != -1){
                    $(this).propertygrid("endEdit", pThis.m_editRowIndex);
                    pThis.m_editRowIndex = -1;
                }
                if($(this).propertygrid("getRows")[index].editor && field != "name"){
                    isMyEdit = true;
                    $(this).propertygrid("beginEdit", index);
                    pThis.m_editRowIndex = index;
                }
            },
            onBeforeEdit: function(index, row){
                if(!(isMyEdit)){
                    return false;
                }
                isMyEdit = false;
            },
            onBeginEdit: function(index, row){
                if(row.key == "datatype"){
                    var ed = $(this).propertygrid("getEditor", {index: index, field: 'value'});
                    
                    $("#pgdatatype_content").remove();
                    
                    var content = [];
                    content.push("<div id='pgdatatype_content' style='padding:5px;    background-color: #F1EAEA;'>");
                    content.push("<div>类型：<input id='pgdatatype' class='easyui-combobox' style='width:150px;' editable='false'/></div>");
                    content.push("<div id='pguppercase_div' style='margin-top:10px;'>位数：<input id='pguppercase' class='easyui-combobox' editable='false' style='width:150px;'/></div>");
                    content.push("<div id='pgdate_div' style='margin-top:10px;'>格式：<input id='pgdate' class='easyui-combobox'  editable='false' style='width:150px;'/></div>");
                    content.push("<div id='barcode_div' style='margin-top:10px;'>编码：<input id='barcode' class='easyui-combobox'  editable='false' style='width:150px;'/></div>");
                    content.push("<div class='barcode' style='margin-top:10px;'>高度：<input id='barcode_height' type='text' class='easyui-numberbox'  style='width:150px;'/></div>");
                    content.push("<div class='barcode' style='margin-top:10px;'>字体：<input id='barcode_font' type='text' class='easyui-numberbox'  style='width:150px;'/></div>");
                    content.push("<div class='barcode' style='margin-top:10px;'>分辨率：<input id='barcode_size' type='text' class='easyui-numberbox'  style='width:137px;'/></div>");
                    content.push("<div style='margin-top:10px;'>说明：<span id='pgparamdesc'></span></div>");
                    content.push("</div>");
                    var t = $(content.join(""));
                    $.parser.parse(t);
                    t.appendTo($(ed.target).combo("panel"));
                    
                    $("#pguppercase").combobox("loadData", [
                        {value:"分", text:"分"},
                        {value:"角", text:"角"},
                        {value:"元", text:"元"},
                        {value:"拾", text:"拾"},
                        {value:"佰", text:"佰"},
                        {value:"仟", text:"仟"},
                        {value:"万", text:"万"},
                        {value:"拾万", text:"拾万"},
                        {value:"佰万", text:"佰万"},
                        {value:"仟万", text:"仟万"},
                        {value:"亿", text:"亿"}
                    ]);
                    $("#pgdate").combobox("loadData", [
                        {value:"YYYY-MM-DD", text:"YYYY-MM-DD"},
                        {value:"YYYY/MM/DD", text:"YYYY/MM/DD"},
                        {value:"YYYY年MM月DD日", text:"YYYY年MM月DD日"},
                        {value:"YYYY.MM.DD", text:"YYYY.MM.DD"},
                        {value:"YY-MM-DD", text:"YY-MM-DD"},
                        {value:"YY/MM/DD", text:"YY/MM/DD"},
                        {value:"YY年MM月DD日", text:"YY年MM月DD日"},
                        {value:"YY.MM.DD", text:"YY.MM.DD"}
                    ]);
                    $("#barcode").combobox("loadData", [
                         {value:"code128", text:"code128"},                                 
                        {value:"int25", text:"2_5interleaved"},
	                    {value:"code39", text:"Code39"},
	                    {value:"ean13", text:"EAN13"},
	                    {value:"ean8", text:"EAN8"},
	                    {value:"std25", text:"STD25"},
	                    {value:"codabar", text:"CODABAR"}
	                  
	                ]);
	                $('#barcode_size').numberbox()
	                $('#barcode_height').numberbox()
	                $('#barcode_font').numberbox()
	              
                    
                    $("#pgdatatype").combobox({bClear:true, panelHeight:'auto', onSelect: function(record){
                        if($(this).combobox("options").bClear){
                            editBuffer.datatype = record.value;
                            editBuffer.typeparam = "";
                            
                            $(ed.target).combo("setText", record.text);
                        }
                        else{
                            $(this).combobox("options").bClear = true;
                        }
                        
                        switch(record.value){
                        case 1:
                            $("#pgparamdesc").html('选择你要显示大写金额的哪一位，打印模板时即打印数据对应位数的金额大写，例如选择"佰"，打印的数据是"2500"，则打印"伍"，你可以拖动多个相同控件选择不同位数组成完整金额表示');
                            $("#pgdate_div").hide();
                            $("#pguppercase_div").show();
                            $("#barcode_div").hide();
                            $(".barcode").hide();
                            
                            $("#pguppercase").combobox({onSelect: function(record){
                                editBuffer.typeparam = record.value.toString();
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + record.text);
                            }});
                            
                            if(editBuffer.typeparam == ""){
                                $("#pguppercase").combobox("select", "分");
                            }
                            else{
                                $("#pguppercase").combobox("select", editBuffer.typeparam);
                            }
                        break;
                        case 2:
                            $("#pgparamdesc").html('使用条形码打印格式，打印模板时按照其传进的数据打印其对应的条形码图形，图形大小以实际生产为准');
                            $("#pguppercase_div").hide();
                            $("#pgdate_div").hide();
                            $("#barcode_div").show();
                            $(".barcode").show();
                            
                            var code="code128",codesize=1,codeheight=30,codefont=12;
                            
                            $("#barcode").combobox({onSelect: function(record){
                            	code=record.value.toString();
                                editBuffer.typeparam =code+","+codeheight+","+codefont+","+codesize
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + editBuffer.typeparam);
                            }});
                            
                            $("#barcode_size").numberbox({onChange: function(newValue,oldValue){
                            	codesize=newValue;
                                editBuffer.typeparam =code+","+codeheight+","+codefont+","+codesize
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + editBuffer.typeparam);
                            }});
                            $("#barcode_height").numberbox({onChange: function(newValue,oldValue){
                            	codeheight=newValue;
                                editBuffer.typeparam =code+","+codeheight+","+codefont+","+codesize
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + editBuffer.typeparam);
                            }});
                            $("#barcode_font").numberbox({onChange: function(newValue,oldValue){
                            	codefont=newValue;
                                editBuffer.typeparam = code+","+codeheight+","+codefont+","+codesize
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + editBuffer.typeparam);
                            }});
                           
                            if(editBuffer.typeparam == ""){
                                $("#barcode").combobox("select", "code128");
                                $("#barcode_size").numberbox({value:1});
                                $("#barcode_height").numberbox({value:30});
                                $("#barcode_font").numberbox({value:12});
                            }
                            else{
                            	var sett=editBuffer.typeparam.split(",")
                                $("#barcode").combobox("select", sett[0]);
                                $("#barcode_height").numberbox({value:sett[1]});
                                $("#barcode_font").numberbox({value:sett[2]});
                                $("#barcode_size").numberbox({value:sett[3]});
                            }
                        break;
                        case 3:
                            $("#pgparamdesc").html('YYYY代表年(YY表示年份后两位)，MM代表月，DD代表日，例如"YYYY年MM月DD日",亦可显示部分，例如"YYYY-MM","MM月DD日"等');
                            $("#pguppercase_div").hide();
                            $("#pgdate_div").show();
                            $("#barcode_div").hide();
                            $(".barcode").hide();
                            
                            $("#pgdate").combobox({onSelect: function(record){
                                editBuffer.typeparam = record.value.toString();
                                $(ed.target).combo("setText", $("#pgdatatype").combobox("getText") + "," + record.text);
                            }});
                            
                            if(editBuffer.typeparam == ""){
                                $("#pgdate").combobox("select", "YYYY年MM月DD日");
                            }
                            else{
                                $("#pgdate").combobox("select", editBuffer.typeparam);
                            }
                        break;
                        default:
                            $("#pgparamdesc").html('使用默认的打印格式，打印模板时按照其传进的数据打印其原始数据，例如打印数据是"广东省"，则打印"广东省"');
                            $("#pguppercase_div").hide();
                            $("#pgdate_div").hide();
                            $("#barcode_div").hide();
                            $(".barcode").hide();
                        break;
                        }                     
                    }});
                    
                    $("#pgdatatype").combobox("loadData", [
                        {text:"默认", value:100},
                        {text:"大写金额", value:1},
                        {text:"条形码", value:2},
                        {text:"日期", value:3}
                    ]);

                    $("#pgdatatype").combobox("options").bClear = false;
                    editBuffer.datatype = pThis.m_data.datatype;
                    editBuffer.typeparam = pThis.m_data.typeparam;
                    $("#pgdatatype").combobox("select", editBuffer.datatype);
                }
            },
            onEndEdit: function(index, row, changes){
                if(row.key == "datatype"){
                    var ed = $(this).propertygrid("getEditor", {index: index, field: 'value'});
                    row.value = $(ed.target).combo("getText");
                    MsgDispatch.onPropertyChange(row.key, editBuffer, pThis.m_editIndex);
                }
                else{
                    if(jQuery.isEmptyObject(changes)){
                        return;
                    }
                    MsgDispatch.onPropertyChange(row.key, changes.value, pThis.m_editIndex);
                }
            }
        });
    },
    setTempInfo: function(data){
        this.m_tempinfo = data;
        this.m_type = "tempinfo";
        this.m_editIndex = -1;
        this.m_editRowIndex = -1;
        
        var temptypename;
        for(var i in MsgDispatch.temptypes){
            if(MsgDispatch.temptypes[i].id == data["temptype"]){
                temptypename = MsgDispatch.temptypes[i].title;
                break;
            }
        }
        
        //位置大小, editor
        var posEditor = {
            type: "numberbox",
            options: {
                min: 1,
                max: 1000,
                precision: 2,
                filter: function(e){
                    if(e == "."){
                        return true;
                    }
                }
            }
        };
        
        var result = {
            total:6,
            rows:[
                {name:"模板ID", value:data["tempid"], group:"基本信息"},
                {name:"模板名称", value:data["tempname"], group:"基本信息"},
                {name:"模板类型", value:temptypename, group:"基本信息"},
                {name:"作者", value:data["createdby"], group:"基本信息"},
                {name:"宽度", key: "width", value:eval(data["width"]).toFixed(2), group:"模板大小(mm)", editor: posEditor},
                {name:"高度", key: "height", value:eval(data["height"]).toFixed(2), group:"模板大小(mm)", editor: posEditor}
            ]
        };
        
        this.m_object.propertygrid("loadData", result);
    },
    setTempItemData: function(data){
        this.m_data = data;
        this.m_type = "tempitem";
        this.m_editRowIndex = -1;
        //row data -> propertygrid data
        var result = {
            total:2,
            rows:[
                {name:"模板项名称", value:data["title"], group:"基本信息"},
                {name:"数据库字段", value:data["param"], group:"基本信息"},
            ]
        };
        
        this.m_object.propertygrid("loadData", result);
    },
    setDataItemData: function(tempinfo, data, index){
        this.m_tempinfo = tempinfo;
        this.m_data = data;
        this.m_type = "dataitem";
        this.m_editIndex = index;
        this.m_editRowIndex = -1;
        //row data -> propertygrid data
        //位置大小
        var posEditor = {
            type: "numberbox",
            options: {
                min: 0,
                max: Math.max(tempinfo.width, tempinfo.height),
                precision: 2,
                filter: function(e){
                    if(e == "."){
                        return true;
                    }
                }
            }
        };
        var colorpick= {
		   type: "textbox",
           options: {
        	   icons: [{
        			iconCls:'icon-colorP',
        			handler: function(e){
        				$(e.currentTarget).colorpicker({
        		            fillcolor:true,
        		            clearColor:function(){
        		            	$(e.data.target).textbox('setValue', "#000000");
        		            },
        		            success:function(o,color){
        		            	$(e.data.target).textbox('setValue', color);
        		            }
        		        });
        		
        				$(e.currentTarget).click();
        				
        			}
        		}]
           }
        }
        //数据格式
        var datatype;
        var mydatatype=["默认","大写金额","条形码","日期"]
        switch(data["datatype"]){
        case "1":
            datatype = "大写金额";
        break;
        case "2":
            datatype = "条形码";
        break;
        case "3":
            datatype = "日期";
        break;
        default:
            datatype = "默认";
        break;
        }
        if(data["typeparam"] != ""){
            datatype += ("," + data["typeparam"]);
        }
        var typeEdit = {
            type: "combobox",
            options: {
                editable:false,
                panelWidth: 200,
                panelHeight: 'auto',
            }
        };
        
        var result = {
            total:0,
            rows:[
                {name:"数据项名称", key: "dataname", value:data["dataname"], group:"基本信息"},
                {name:"数据库字段", key: "linkparam", value:data["linkparam"], group:"基本信息"},
                {name:"显示名称", key: "displayname", value:data["displayname"], group:"基本信息",editor: {type: "text"}},
                {name:"X坐标", key: "x", value:data["x"], group:"位置大小(单位:mm)", editor: posEditor},
                {name:"Y坐标", key: "y", value:data["y"], group:"位置大小(单位:mm)", editor: posEditor},
                {name:"宽度", key: "cx", value:data["cx"], group:"位置大小(单位:mm)", editor: posEditor},
                {name:"高度", key: "cy", value:data["cy"], group:"位置大小(单位:mm)", editor: posEditor},
                {name:"数据类型", key: "datatype", value:data["datatype"]==100?"默认":mydatatype[data["datatype"]]+" "+data["typeparam"], group:"数据格式", editor:typeEdit},
                //{name:"类型参数", key: "typeparam", value:data["typeparam"], group:"数据格式"},
                {name:"是否打印", key: "isprint", value:data["isprint"] == 1 ? "是" : "否", group:"其它",
                    editor: {
                        type: "combobox",
                        options: {
                            panelHeight: 'auto',
                            editable: false,
                            data:[
                                {text:"是", value:"是"},
                                {text:"否", value:"否"}
                            ]
                        }
                    }
                },
                {name:"上间距", key: "intervals", value:data["intervals"], group:"位置大小(单位:mm)", editor:  posEditor},
                {name:"字体大小", key: "fontsize", value:data["fontsize"], group:"样式", editor:  {
                    type: "numberbox",
                    options: {
                        min: 1,
                        max: 100,
                        precision: 0,
                        filter: function(e){
                            if(e == "."){
                                return true;
                            }
                        }
                    }
                }},
                {name:"字体颜色", key: "fontcolor", value:data["fontcolor"], group:"样式", editor: colorpick}
            ]
        };
        
        this.m_object.propertygrid("loadData", result);
    }
}