////////////////////////////公共脚本部分////////////////////////////////////////////
//说明：该js文件用于提供公共的接口脚本，方便其他人使用。
//		只要是大家自己认为其他人也都会使用到的方法,都可以在该文件中添加
//注意事项: 为了避免公共部分方法和全局参数与其他人定义的方法或全局参数出现重复
//			该文件中的方法和全局参数均以public_ 为前缀
//现有方法：
//public_MessageBox(sMessage, sTitle)//浮动消息提示框 sMessage:消息内容 , sTitle:消息标题
//public_initPCACtrl(ctrl_id, index)//省市县三级联动 ctrl_id:控件id , index
//public_toDecimal2(x)  //将浮点数四舍五入，保留两位小数,以返回值方式返回
//public_contains(a, obj)//判断元素obj是否在数组a中已存在，是返回true,否返回false
//public_fromatterCreatedTime(value,row,index) //用于格式化datagrid中的创建时间，去掉小数点后的毫秒数据
//public_FormatterConsignnoteState(value, row, index) //用于格式化datagrid中托运单的状态
//public_openNewUrl(title, sActionNum, sDllName, bClosed) //用于打开一个新的页面
//public_initBankTabs()
//////////////////////////////////////////////////////////////////////////

///////////////////////////省市县三级联动部分///////////////////////////
//使用方法：放置html控件 <select class="easyui-combo" id="test_address">
//		在需要使用该控件时	public_initPCACtrl("test_address", index);
//同时需要在请求回调函数OnRequestParamsCallBack中增加如下判断和方法调用
//function OnRequestParamsCallBack(totalJson) {
//if(totalJson.action == "onSendMgMessage_QueryArea")
//  {
//     public_onCallBackForQueryArea(totalJson);
//  }
//}
//ctrl_id 当前控件id 
//index 当前控件索引 主要用于在datagrid中使用detailview做增删改时
//		，动态引入form中包含地址信息的。
//		当index 等于 -1 时，表示该控件只有一个不需要
//当使用该方法时，要拿到地址信息需要通过$('#' + ctrl_id).combo('getValue');的方式拿到控件对应值
// var addressjson = $('#' +ctrl_id).combo('getValue');
// if (!jQuery.isEmptyObject(addressjson))
// {
// 		addressjson = jQuery.parseJSON(addressjson);
// }
// addressjson["provinceid"] = id;
// addressjson["provincename"] = name;
// addressjson["cityid"] = 0;
// addressjson["cityname"] = "";
// addressjson["areaid"] = 0;
// addressjson["areaname"] = "";

$(function(){
  //  $("body").attr("onLoad", "public_onLoadCompleted();");
    $("body").attr("oncontextmenu", "self.event.returnValue=false;");
    $('.easyui-datagrid').datagrid({
     	onLoadSuccess:function(data)
        {
			public_datagridHiddenExPander(this);
        }
    });
    $("<link>").attr({ rel: "stylesheet",
				        type: "text/css",
				        href: "common/mglogistics.easyui.css"
				    })
    			.appendTo("head");
});

var g_ProvinceValue = undefined;
var g_HBankCodeInfo = undefined;
function public_datagridHiddenExPander(obj)
{
	try{
		$('.datagrid-header-expander').width(0);
		$(obj).datagrid('hideColumn', '_expander');
	}
	catch (err)
	{
	}
}

function public_initPCACtrl(ctrl_id, index, iLevel)
{//iLevel-层级标志，1-省级 2-市级 3-县区级
	//判断当前id是否存在，是则删除自身
	if(index != undefined && index != -1)
	{
		if(!jQuery.isEmptyObject(document.getElementById(ctrl_id + index)))
		{
			var temp = document.getElementById(ctrl_id+index);
			temp.parentNode.removeChild(temp);
		}
	    var combo = document.getElementById(ctrl_id);
	    combo.id = combo.id + index;
	    ctrl_id = ctrl_id + index;
    }
    $('#'+ ctrl_id).combo(public_address_config);
    $('#' + ctrl_id).combo('options').combo_id = ctrl_id;
    
    //判断层级,默认为县区级
    if (iLevel == undefined) {
		iLevel = 3;
	};
    $('#' + ctrl_id).combo('options').iLevel = iLevel;

    var para=document.createElement("div");
    para.setAttribute("id", ctrl_id + "_div");

    var div_table = document.createElement("div");
    $(div_table).addClass("easyui-tabs");
    div_table.setAttribute("tabWidth", "80");
    div_table.setAttribute("id", ctrl_id + "_table");

    var province = document.createElement("div");
    province.setAttribute("title", "省");
    province.setAttribute("id", ctrl_id + "_province");
    div_table.appendChild(province);
    $('#' + ctrl_id).combo('options').province_object = province;

    if (iLevel >= 2) {
	    var city = document.createElement("div");
	    city.setAttribute("title", "市");
	    city.setAttribute("id", ctrl_id + "_city");
	    div_table.appendChild(city);
	    $('#' + ctrl_id).combo('options').city_object = city;
	}

    if (iLevel == 3) {
	    var area = document.createElement("div");
	    area.setAttribute("title", "县区");
	    area.setAttribute("id", ctrl_id + "_area");
	    div_table.appendChild(area);
	    $('#' + ctrl_id).combo('options').area_object = area;
    };

    para.appendChild(div_table);
	
	$('#' + ctrl_id).combo('options').div_object = para;
    $('#' + ctrl_id).combo('options').table_object = div_table;

    var obj = $(para).appendTo($('#'+ctrl_id).combo('panel'));
    $.parser.parse(obj);
    $('#' + ctrl_id).combo('showPanel');
    $('#' + ctrl_id).combo('hidePanel');
    // public_sendMessageForAddress(0, 0, ctrl_id);
}

var public_address_config = {
	combo_id: '',
    required:true,
    editable:false,
    panelWidth:290,
    panelHeight:null,
    hasDownArrow:false,
    prompt:'点击选择地区信息',
    table_object: undefined,
    province_object: undefined,
    city_object: undefined,
    area_object: undefined,
    bInited: false,
    onShowPanel: function()
    {
    	if (!$(this).combo('options').bInited) {
    		// if (g_ProvinceValue != undefined) {
    		// 	var data = $.parseJSON(JSON.stringify(g_ProvinceValue));
    		// 	var sJsContent = {};
    		// 	sJsContent.data = data;
    		// 	sJsContent.id = 0;
    		// 	sJsContent.type = 0;
    		// 	sJsContent.combo_id = $(this).combo('options').combo_id;
    		// 	public_onCallBackForQueryArea(sJsContent);
    		// }
    		// else
    		// {
	    		public_sendMessageForAddress(0,0, $(this).combo('options').combo_id);
    		// }
    	};
    },
    onHidePanel: function()
    {
		var addressjson = $(this).combo('getValue');
    	if (!jQuery.isEmptyObject(addressjson))
    	{
    		addressjson = jQuery.parseJSON(addressjson);
    	}
    	var temp = {};
    	if(addressjson["provincename"] == undefined)
    	{
    		return;	
    	}
    	var sText = "";
    	var sValue = JSON.stringify(addressjson);
    	sText += addressjson["provincename"];
    	if (addressjson["cityid"] != 0)
		{
			sText += "-" + addressjson["cityname"];
			if (addressjson["areaid"] != 0)
    		{
    			sText += "-" + addressjson["areaname"];
    		}
		}
		$(this).combo('setValue', sValue)
				.combo('setText', sText);
     }
};

function public_setPCACtrlValue(ctrl_id, addressjson)
{
	$('#' + ctrl_id).combo('setValue', JSON.stringify(addressjson));
	$('#' + ctrl_id).combo('showPanel');	
	$('#' + ctrl_id).combo('hidePanel');
}

function public_getPCACtrlValue(ctrl_id)
{
	var addressjson = $('#' + ctrl_id).combo('getValue');
	if (jQuery.isEmptyObject(addressjson)) {
		return {};
	};
	addressjson = jQuery.parseJSON(addressjson);
	return addressjson;
}

function public_getInnerHtml(data, type,sType)
{
	if (type == 1 && !$.isEmptyObject(data)) {
		$('#'+sType).combo('options').bInited = true;
	};
	var sHtml = '<ul style="width:280px;list-style: none;margin:0;padding:0;">';
	for(var i=0;i<data.length; i++)
	{
		sHtml += '<li style="list-style: none;float:left;width:auto;list-style-type: none; margin-left:5px;margin-top:5px;margin-bottom: 5px;">'
				+'<a href="#" style="TEXT-DECORATION:none; font-size: 20;padding: 0 3px;" onclick="public_onClickHrefForAddress('+ data[i].id +',\'' + data[i].name +'\', '+ type +',\'' + sType + '\');">'+ data[i].name +'</a>'
				+'</li>'
	}
	sHtml += '</ul>';
	return sHtml;
}

function public_onCallBackForQueryArea(sJsContent)
{
	if (sJsContent.type == 0 && g_ProvinceValue == undefined) {
		g_ProvinceValue = sJsContent.data;
	};
    var sHtml = public_getInnerHtml(sJsContent.data, sJsContent.type+1, sJsContent.combo_id);
    switch(sJsContent.type)
    {
    	case 0:
    	$('#' + sJsContent.combo_id).combo('options').province_object.innerHTML = sHtml;
    	$('#' + sJsContent.combo_id).combo('options').city_object.innerHTML = '';
    	$('#' + sJsContent.combo_id).combo('options').area_object.innerHTML = '';
    	break;
    	case 1:
    	$('#' + sJsContent.combo_id).combo('options').city_object.innerHTML = sHtml;
    	$('#' + sJsContent.combo_id).combo('options').area_object.innerHTML = '';
    	break;
    	case 2:
    	$('#' + sJsContent.combo_id).combo('options').area_object.innerHTML = sHtml;
    	break;
    	default:
    	break;
    }
}

function public_onClickHrefForAddress(id, name, type, sType)//type 1-province 2-city 3-area 
{
	var addressjson = $('#' +sType).combo('getValue');
	if (!jQuery.isEmptyObject(addressjson))
	{
		addressjson = jQuery.parseJSON(addressjson);
	}
	else
	{
		addressjson = {};
	}
	switch(type)
	{
		case 1://点击省
			addressjson["provinceid"] = id;
			addressjson["provincename"] = name;
			addressjson["cityid"] = 0;
			addressjson["cityname"] = "";
			addressjson["areaid"] = 0;
			addressjson["areaname"] = "";
		break;
		case 2://点击市
			addressjson["cityid"] = id;
			addressjson["cityname"] = name;
			addressjson["areaid"] = 0;
			addressjson["areaname"] = "";
		break;
		case 3://点击县区
			addressjson["areaid"] = id;
			addressjson["areaname"] = name;
		break;
		default:
		addressjson = {};
		break;
	}
	$('#' +sType).combo('setValue', JSON.stringify(addressjson));

	var iLevel = $('#' + sType).combo('options').iLevel;
	if (iLevel == type) {
		$('#' + sType).combo('hidePanel');
		return;
	};

	if(type != 3)
	{
		public_sendMessageForAddress(id, type, sType);
		$($('#'+sType).combo('options').table_object).tabs('select', type);
	}
	else
	{
		$('#' + sType).combo('hidePanel');
	}
}

function public_sendMessageForAddress(id, type, sType)
{
	var param = {};
	var data = [];
	param["id"] = id;
	param["type"] = type;
	param["combo_id"] = $('#' +sType).combo('options').combo_id;

	data.push(JSON.stringify(param));
	public_sendMessage('onSendMgMessage_QueryArea', data);
}

///////////////////end 省市县三级联动部分///////////////////////////////////////
////////////////////////可公共使用部分--应建立公共js函数////////////////////////////////////
$.extend($.fn.datagrid.methods, {
	editCell: function(jq,param){
		return jq.each(function(){
			var opts = $(this).datagrid('options');
			var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor1 = col.editor;
				if (fields[i] != param.field){
					col.editor = null;
				}
			}
			$(this).datagrid('beginEdit', param.index);
			for(var i=0; i<fields.length; i++){
				var col = $(this).datagrid('getColumnOption', fields[i]);
				col.editor = col.editor1;
			}
		});
	}
});

function public_tm_day_formatter(date)
{
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}
//将浮点数四舍五入，保留两位小数
function public_toDecimal2(x) 
{  
	var f = parseFloat(x);  
	if (isNaN(f)) {  
		return '';  
	}  
	var f = Math.round(x*100)/100;  
	var s = f.toString();  
	var rs = s.indexOf('.');  
	if (rs < 0) {  
		rs = s.length;  
		s += '.';  
	}  
	while (s.length <= rs + 2) {  
		s += '0';  
	}  
	return s;  
}  

//判断obj是否在数组a中已存在
function public_contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] == obj) {
            return true;
        }
    }
	return false;
}
 
function public_MessageBox(sMessage, sTitle)
{
    $.messager.show({
        width: 400,
        height: 200,
        title: sTitle,
        msg: sMessage,
        timeout: 1500,
        showType: 'slide'
    });
}

////////////////用于datagrid 格式化创建时间///////////////
function public_fromatterCreatedTime(value,row,index)
{
	if (value == undefined) {
		return "";
	};
	var iIndex = value.indexOf(".");
	if (iIndex != -1) {
		value = value.slice(0, iIndex);	
	}
	return value;
}
function public_fromatterDate(value,row,index)
{
	if (value == undefined) {
		return "";
	};
	var iIndex = value.indexOf(" ");
	if (iIndex != -1) {
		value = value.slice(0, iIndex);	
	}
	return value;
}
////////////////end public_fromatterCreatedTime///////////////
////////////////用于datagrid格式化托运单状态//////////////////
function public_FormatterConsignnoteState(value, row, index)
{
	value = value.toString();
	switch(value)
	{
		case "3":
			return '物流已收货';
		break;
		case "7":
			return '装车';
		break;
		case "8":
			return '转运';
		break;
		case "9":
			return '运送中';
		break;
		case "10":
			return '派送中';
		break;
		case "11":
			return '全部签收';
		break;
		case "12":
			return '部分签收';
		break;
		case "16":
			return '物流已受理';
		break;
		case "17":
			return '物流上门提货(在途)';
		break;
		case "13":
			return '取消';
		break;
		case "14":
			return '拒收';
		break;
		case "15":
			return '月结';
		break;
		default:
			return '';
		break;
	}
}
///////////////end public_FormatterConsignnoteState////////////////////////

function public_onLoadCompleted()
{
  window.parent.onLoadChildHtml(public_getFileName());
}

function public_getFileName(){
  var url = window.location.pathname;
  var pos = url.lastIndexOf("/");
  if(pos == -1){
     pos = url.lastIndexOf("\\")
  }
  var filename = url.substr(pos +1)
  var pos = filename.lastIndexOf(".");
  filename = filename.substr(0, pos);
  return filename;
}

function public_sendMessage(sAction, sRequestParam)
{
	var param = sRequestParam[0];
	param = jQuery.parseJSON(param);
	param["action"] = sAction;
	
	if("onDeleteTemplate"==sAction){//删除模版
		$.ajax({
			url:"onDeleteTemplate.do",
			dataType:"json",
			data:{"tempid":param["tempid"]},
			success:function(msg){
				if(msg.ret==0){
					 mainView.openOpenDialog();
					 $.messager.show({title:'系统信息', msg: '删除成功'});
				}
			}});
	}else if("onOpenTemplate"==sAction){
		for(var i=0;i<MsgDispatch.tempDatas.length;i++){
			if(MsgDispatch.tempDatas[i].tempid==param["tempid"]){
				var dataitem=DataFormat.formatDataItem(MsgDispatch.tempDatas[i].templatedataitem.rows);
				var tempinfo=DataFormat.formatTempInfo(MsgDispatch.tempDatas[i]);
				mainView.beginWork(tempinfo, dataitem);
			}}
	}

}

function public_postMessage(sAction, sRequestParam)
{ 
	var param = sRequestParam[0],msgAction=MsgDispatch.msgData[sAction];
	param = jQuery.parseJSON(param);
	param["action"] = sAction;	
	if("onSaveTemplate"==sAction&&param["tempinfo"]){
				$.ajax({
					url:"onSaveTemplate.do",
					type:"post",
					dataType:"json",
					data:{"data":$.toJSON(param["tempinfo"])},
					success:function(msg){
						
						if(msg.ret==0){
							mainView.endWork();	
							mainView.openOpenDialog();
						}
						$.messager.show({title:'系统信息', msg: msg.message});
					}
				})
	}else if("onOpenDialog"==sAction){
		$.ajax({
			url:"getTemp.do",
			type:"post",
			dataType:"json",
			data:{"data":MsgDispatch.msgData.userData},
			success:function(msg){
				if(msg.ret==0){
					MsgDispatch.tempDatas=msg["data"]["rows"];
					msgAction.func(msg["data"]["rows"],msgAction.sender)	
				}
			}
		})
	}
}

function changeImg(newValue){
	mainView.m_workplace.m_data.m_tempinfo.pictureurl=newValue;
}

///////////////////////////////////////////////////////////////////////////////
var public_mglogistics_bank_tabs_combo_config = {
    panelWidth: 575,
    panelHeight: null,
    // required: true,
    prompt: '- 开户银行 -',
    editable: false,
    bInited: false,
    onChange: function(newValue,oldValue)
    {
    	try{
    		onChangeMgLogisticsBankTabsCombo(this, newValue, oldValue);
    	}
    	catch(err)
    	{

    	}
    },
    onShowPanel: function()
    {
        $($(this).combo('options').table_object).show();
        $($(this).combo('options').table_object).next().hide();
        
        if (!$(this).combo('options').bInited) {
       	if (g_HBankCodeInfo != undefined) {
        		var sJsContent = $.parseJSON(g_HBankCodeInfo);
        		sJsContent["ctrl_id"] = $(this).combo('options').combo_id;
        		public_onCallBackForQueryHBankCode(sJsContent);
        	}
        	else
        	{
	        	$(this).combo('options').sendMessageForHBankCode();
       		}
        };
    },
    sendMessageForHBankCode: function()
    {
		var param = {};
	    param["ctrl_id"] = this.combo_id;
	    public_sendMessage("onSendMgMessage_QueryHBankCode", [JSON.stringify(param)]);
    },
    InitHotBank:function(data){
    	this.bInited = true;
        var sHtml = '<ul class="bank_ul"><li class="bank_li_break"></li>';
        for(var i=0; i<data.length; i++)
        {
            sHtml += '<li class="bank_li_logo" style="background: url(../public/images/bank.png) no-repeat 0 -'+ parseInt(data[i].iconindex)*35 +'px;" onclick="$(\'#' + this.combo_id + '\').combo(\'options\').onClickSelectBank(\'' +data[i].id+ '\',\''+ data[i].text +'\',\''+ this.combo_id +'\');">'
                +'</li>';
        }
        sHtml += '<li class="bank_li_break"></li></ul>';
        this.hot_bank_object.innerHTML = sHtml;
        this.hot_bank_data = data;
    },
    InitAllBankCombobox: function(data)
    {
		$(this.combobox_bankname_object).combobox('loadData', data);
    },
    InitAllBank:function(data){
        var sHtml = '<ul class="bank_ul"><li class="bank_li_break"></li>';
        for(var i=0;i<data.length; i++)
        {
            sHtml += '<li class="bank_li_link"  onclick="$(\'#' + this.combo_id + '\').combo(\'options\').onClickSelectBank(\'' +data[i].id+ '\',\''+ data[i].text +'\',\''+ this.combo_id +'\');">'
                + '<a href="#">'+data[i].text+'</a>'
                +'</li>';
        }
        sHtml += '<li class="bank_li_break"></li></ul>';
        this.all_bank_object.innerHTML = sHtml;
        this.all_bank_data = data;
    },
    onClickSelectBank:function(id, text, combo_id)
    {
    	$(this.table_object).next().show();
    	$(this.table_object).hide();
        var bank_list =  this.datagrid_banknameex_object;
        $(bank_list).datagrid(this.getBankListConfig());
        $(bank_list).datagrid('getPager').pagination({
            onSelectPage: function (pageNum, pageSize)
            {
                $(bank_list).datagrid('options').pageSize = pageSize;
                $(bank_list).datagrid('options').pageNumber = pageNum;
                $('#'+combo_id).combo('options').onQueryBankBranch();
            }
        });
        var combobox_bankname_object =  this.combobox_bankname_object;

        $(combobox_bankname_object).combobox('setValue', id)
        							.combobox('setText', text);

       	this.onClickQueryBankBranch();
    },
    onClickQueryBankBranch: function()
    {//点击查询支行按钮事件处理
        $(this.datagrid_banknameex_object).datagrid('options').pageNumber = 1;
        this.onQueryBankBranch();
    },
    onQueryBankBranch: function()
    {//点击查询支行按钮事件处理
        var param = {};
        param["hbankcode"] = $(this.combobox_bankname_object).combobox('getValue');
        param["bankname"] = $(this.bank_like_name_object).textbox('getText');
        var address = $(this.bank_address_object).combo('getValue');
        if (address == "") {
            address = '{"provinceid":0, "provincename":"","cityid":0, "cityname":""}';
        };
        param["address"] = $.parseJSON(address);
        param["ctrl_id"] = this.combo_id;

        var options = $(this.datagrid_banknameex_object).datagrid('options');
        param["pageNumber"] = options.pageNumber;
        param["pageSize"] = options.pageSize;

        public_sendMessage("onSendMgMessage_QueryBankCode", [JSON.stringify(param)]);
    },
    initBankNameCombo: function(data)
    {
        $(this.combobox_bankname_object).combobox('loadData', data);
    },
    initBankBranch: function(obj, ctrl_id)
    {
        var bank_child = document.createElement("div");

        var bank_child2 = document.createElement("div");
        $(bank_child2).addClass('div-bankex');
        $(bank_child2).html('<dl><span>开户行：</span></dl>');

        var dt1 = document.createElement("dt");
        var bankname = document.createElement('input');
        $(bankname).addClass('easyui-combobox');
        bankname.setAttribute("data-options", "valueField:'id',textField:'text',prompt:'选择开户行'");
        $(bankname).width(160);
        dt1.appendChild(bankname);
        bank_child2.appendChild(dt1);
        bank_child.appendChild(bank_child2);

        var bank_child1 = document.createElement("div");
        $(bank_child1).addClass('div-bankex');
        $(bank_child1).html('<dl><span>地区：</span></dl>');

        var dt = document.createElement("dt");
        var bank_address = document.createElement('input');
        if(!jQuery.isEmptyObject(document.getElementById(ctrl_id + "_bank_address")))
		{
			var temp = document.getElementById(ctrl_id + "_bank_address");
			temp.parentNode.removeChild(temp);
		}
        bank_address.setAttribute("id", ctrl_id + "_bank_address");
        $(bank_address).width(160);
        dt.appendChild(bank_address);
        bank_child1.appendChild(dt);
        bank_child.appendChild(bank_child1);

        var bank_child3 = document.createElement("div");
        $(bank_child3).addClass('div-bankex');
        $(bank_child3).html('<dl><span>关键字：</span></dl>');

        var dt2 = document.createElement("dt");
        var bank_like_name = document.createElement('input');
        $(bank_like_name).addClass('easyui-textbox');
        $(bank_like_name).width(160);
        dt2.appendChild(bank_like_name);
        bank_child3.appendChild(dt2);
        bank_child.appendChild(bank_child3);

        var bank_child4 = document.createElement("div");
        $(bank_child4).addClass('div-bankex');
        $(bank_child4).html('<dl><span>&nbsp;</span></dl>');

        var dt2 = document.createElement("dt");
        var action = document.createElement('a');
        $(action).addClass('easyui-linkbutton');
        $(action).text('检索支行');
        dt2.appendChild(action);
        bank_child4.appendChild(dt2);
        bank_child.appendChild(bank_child4);

        $(action).bind('click', function(){
            obj.combo('options').onClickQueryBankBranch();
        });

        var bank_list = document.createElement('table');
        $(bank_list).addClass('easyui-datagrid');
        $(bank_list).height(200);
        bank_child.appendChild(bank_list);

        obj.combo('options').bank_address_object = bank_address;
        obj.combo('options').combobox_bankname_object = bankname;
        obj.combo('options').datagrid_banknameex_object = bank_list;
        obj.combo('options').btn_query_banklist_object = action;
        obj.combo('options').bank_like_name_object = bank_like_name;

        $(bank_list).datagrid(obj.combo('options').getBankListConfig());
        $(bank_list).datagrid('options').combo_id = ctrl_id;

        return bank_child;
    },
    getBankListConfig: function()
    {
        var config = {
            singleSelect: true,
            rownumbers: true,
            pagination: true,
            pageSize: 10,
            columns: [
                [{
                    field:'bankcode',
                    title: '联行号',
                    width:'45%'
                },{
                    field:'bankname',
                    title: '支行名称',
                    width:'50%'
                }]
            ],
            onClickRow: function(index, row)
            {
                var combo_id = $(this).datagrid('options').combo_id;
                $('#' + combo_id).combo('setValue', JSON.stringify(row))
                				.combo('setText', row.bankname);
                $('#' + combo_id).combo('hidePanel');
            }
        };
        return config;
    },
    loadBankListData: function(data)
    {
        var datagrid_bankname = this.datagrid_banknameex_object;
        $(datagrid_bankname).datagrid('loadData', data);
    },
    setBankCodeValue:function(record, type)
    {//根据 bankcodeinfoid 或bankcode 设置支行名称
     //type 1/undefined-bankcodeinfoid 2-使用 bankcode
    	var param = {};
    	param["ctrl_id"] = this.combo_id;
    	if (type == undefined || type == 1) {
    		type = 1;
    		param["bankcodeinfoid"] = record.bankcodeinfoid;
    	}
    	else if (type == 2) {
    		param["bankcode"] = record.bankcode;
    	}
    	else
    	{
    		return ;
    	}
    	param["type"] = type;
    	public_sendMessage('onSendMgMessage_QueryBankCodeByQueryParam', [JSON.stringify(param)]);
    },
    setBankCodeValueCallBack: function(record)
    {
    	$(this.combo_object).combo('setValue', JSON.stringify(record[0]))
							.combo('setText', record[0].bankname);
    }
};

function public_initBankTabs(obj, ctrl_id, index)                                                                  
{
	if(index != undefined && index != -1)
	{
		if(!jQuery.isEmptyObject(document.getElementById(ctrl_id + index)))
		{
			var temp = document.getElementById(ctrl_id+index);
			temp.parentNode.removeChild(temp);
		}
		ctrl_id = ctrl_id + index;
    } 

    obj.combo(public_mglogistics_bank_tabs_combo_config);
    obj.combo('options').combo_id = ctrl_id;
    obj.attr('id', ctrl_id);

    var para=document.createElement("div");

    var div_table = document.createElement("div");
    $(div_table).addClass("easyui-tabs");
    div_table.setAttribute("tabWidth", "80");

    var hot_bank = document.createElement("div");
    hot_bank.setAttribute("title", "热门银行");
    div_table.appendChild(hot_bank);

    var all_bank = document.createElement("div");
    all_bank.setAttribute("title", "所有银行");
    div_table.appendChild(all_bank);

    para.appendChild(div_table);

	//
    var bank_child = obj.combo('options').initBankBranch(obj, ctrl_id);
    para.appendChild(bank_child);

    obj.combo('options').div_object = para;
    obj.combo('options').table_object = div_table;
    obj.combo('options').hot_bank_object = hot_bank;
    obj.combo('options').all_bank_object = all_bank;
    obj.combo('options').combo_object = obj;

    var obj1 = $(para).appendTo(obj.combo('panel'));
    $.parser.parse(obj1);

    obj.combo('showPanel');
    obj.combo('hidePanel');

    //初始化地区数据
  	public_initPCACtrl(ctrl_id + '_bank_address', -1, 2);

    $(bank_child).hide();



    //以下为测试数据
    if (g_HBankCodeInfo != undefined) {
    	var sJsContent = $.parseJSON(g_HBankCodeInfo);
    	sJsContent["ctrl_id"] = ctrl_id;
    	public_onCallBackForQueryHBankCode(sJsContent);
    };

    // var data = [];
    // data.push({id:'444444444',text:'招商', iconindex:1});
    // data.push({id:'111111111',text:'工商', iconindex:2});
    // data.push({id:'222222222',text:'农业', iconindex:3});
    // data.push({id:'333333333',text:'中国', iconindex:4});
    // obj.combo('options').InitHotBank(data);

    // obj.combo('options').setBankCodeValue({bankcodeinfoid:'1'}, 1);
}

//查询总行回调函数
function public_onCallBackForQueryHBankCode(sJsContent)
{
	if (g_HBankCodeInfo == undefined) {
		g_HBankCodeInfo = JSON.stringify(sJsContent);
	};
	if (!$.isEmptyObject(sJsContent.vHBankValue)) {
		$('#' + sJsContent.ctrl_id).combo('options').InitHotBank(sJsContent.vHBankValue);
		$('#' + sJsContent.ctrl_id).combo('options').InitAllBank(sJsContent.vAllBankValue);
		$('#' + sJsContent.ctrl_id).combo('options').InitAllBankCombobox(sJsContent.vAllBankValue);
	};
}

//查询支行回调函数
function public_onCallBackForQueryBankCode(sJsContent)
{
	if (!$.isEmptyObject(sJsContent.vBankValue)) {
		$('#' + sJsContent.ctrl_id).combo('options').loadBankListData(sJsContent.vBankValue);
	};
}

function public_onSendMgMessageQueryBankCodeByQueryParam(sJsContent)
{
	$('#' + sJsContent.ctrl_id).combo('options').setBankCodeValueCallBack(sJsContent.vBankValue);
}

//////////////////////公共部分  ///////////////////////////////////////////////
function public_onClickReload()
{
	location.reload();
}

function public_openNewUrl(title, sActionNum, sDllName, bClosed)
{
	window.parent.onClickOpenNewUrl(title, sActionNum, sDllName, bClosed);
}

function public_sendMessageByjQuery(title, sActionNum, sDllName, param)
{
	if (window.parent.onClickOpenNewUrl(title, sActionNum, sDllName, true))
	{
		// window.parent.
		return true;
	}
	else
	{
		return false;
	}
}

function public_closedCurrentPage()
{
	window.parent.closedCurrentPage(public_getFileName());
}


/////////////////////end 公共部分///////////////////////////////////////////////
//////////////////////////////////////////////////////////////

function public_DigitalToCapital(numberValue){
    var numberValue=new String(Math.round(numberValue*100)); // 数字金额
    var chineseValue=""; // 转换后的汉字金额
    var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
    var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
    var len=numberValue.length; // numberValue 的字符串长度
    var Ch1; // 数字的汉语读法
    var Ch2; // 数字位的汉字读法
    var nZero=0; // 用来计算连续的零值的个数
    var String3; // 指定位置的数值
    if(len>15){
        alert("超出计算范围");
        return "";
    }
    if (numberValue==0){
        chineseValue = "零元整";
        return chineseValue;
    }
    String2 = String2.substr(String2.length-len, len); // 取出对应位数的STRING2的值
    for(var i=0; i<len; i++){
        String3 = parseInt(numberValue.substr(i, 1),10); // 取出需转换的某一位的值
        if ( i != (len - 3) && i != (len - 7) && i != (len - 11) && i !=(len - 15) ){
            if ( String3 == 0 ){
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else if ( String3 != 0 && nZero != 0 ){
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else{
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
        }
        else{ // 该位是万亿，亿，万，元位等关键位
            if( String3 != 0 && nZero != 0 ){
                Ch1 = "零" + String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if ( String3 != 0 && nZero == 0 ){
                Ch1 = String1.substr(String3, 1);
                Ch2 = String2.substr(i, 1);
                nZero = 0;
            }
            else if( String3 == 0 && nZero >= 3 ){
                Ch1 = "";
                Ch2 = "";
                nZero = nZero + 1;
            }
            else{
                Ch1 = "";
                Ch2 = String2.substr(i, 1);
                nZero = nZero + 1;
            }
            if( i == (len - 11) || i == (len - 3)){ // 如果该位是亿位或元位，则必须写上
            Ch2 = String2.substr(i, 1);
            }
        }
        chineseValue = chineseValue + Ch1 + Ch2;
    }
    if ( String3 == 0 ){ // 最后一位（分）为0时，加上“整”
        chineseValue = chineseValue + "整";
    }
    return chineseValue;
}
/////////////////////////////////////////////////////////////

