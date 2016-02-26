// 去掉所有的空格，前后以及中间
function trim_all(str)
{
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    result = result.replace(/\s/g,"");
    return result;
}

//删除左右两端的空格
function trim_left_right(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

//删除左边的空格
function trim_left(str)
{
    return str.replace(/(^\s*)/g,"");
}

//删除右边的空格
function trim_right(str)
{
    return str.replace(/(\s*$)/g,"");
}

// 获取对象的value值
function get_value(name)
{
    return document.getElementById(name).value;
}

// 设置控制的disabled属性
function disabled_ctrl(Id, bDisabled)
{
    document.getElementById(Id).disabled = bDisabled;
}

function set_value(object_id, new_value)
{
    document.getElementById(object_id).value = new_value;
}

function set_span_value(span_id, new_value)
{
    var oSpan = document.getElementById(span_id);
    if (oSpan != undefined)
    {
        oSpan.innerHTML = new_value;
    }
}

function get_option_text(obj_id)
{
    var opt = document.getElementById(obj_id);
    return opt.options[opt.selectedIndex].text;
}

function get_pic_type_name(nType)
{
    var sTitle = '';

    if (nType == 1) sTitle = '身份证';
    else if (nType == 2) sTitle = '营业执照';
    else if (nType == 3) sTitle = '税务登记证';
    else if (nType == 7) sTitle = '特约客户调查表';
    else if (nType == 10) sTitle = '门店';
    else if (nType == 14) sTitle = '其他';
    else if (nType == 101) sTitle = '合同';
    else if (nType == 102) sTitle = '附加合同';

    return sTitle;
}

function hide_ctrl(sId)
{
    document.getElementById(sId).style.display = "none";
}

function show_ctrl(sId)
{
    document.getElementById(sId).style.display = "";
}

function formatDate(date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth()+1;
    var myweekday = date.getDate();

    if(mymonth < 10) mymonth = "0" + mymonth;
    if(myweekday < 10) myweekday = "0" + myweekday;
    return (myyear+"-"+mymonth + "-" + myweekday);
}

//获得某月的天数
// 例如：2015年07月，myYear=2015 myMonth=7
function getMonthDays(myYear, myMonth){
    var now = new Date(); //当前日期

    var monthStartDate = new Date(myYear, myMonth - 1, 1);
    var monthEndDate = new Date(myYear, myMonth, 1);
    var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24);
    return days;
}

//获得本月的开始日期
// 例如：2015年07月，nYear=2015 nMonth=7
function getMonthStartDate(nYear, nMonth){
    var now = new Date(); //当前日期

    var monthStartDate = new Date(nYear, nMonth - 1, 1);
    return formatDate(monthStartDate);
}

//获得本月的结束日期
// 例如：2015年07月，nYear=2015 nMonth=7
function getMonthEndDate(nYear, nMonth){
    var now = new Date();

    var monthEndDate = new Date(nYear, nMonth - 1, getMonthDays(nYear, nMonth));
    return formatDate(monthEndDate);
}