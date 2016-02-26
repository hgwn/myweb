/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0ApplyQuery', function($scope) {

    // 主要用于查询
    $scope.params = {"platformauditflag":0, "enableflag":0, "companyname":"", "begintime":"", "endtime":"", "auditstate":1, "remark":"", "companytype":0};

    // 查询的数据结果列表
    $scope.applydatas = [];

    // 选择的商户
    $scope.data_item = {};

    // 选择商户的详细信息
    $scope.data_infos = {};

    // 页码信息
    $scope.page_infos = {"pagenum":0, "pagesize":0, "total":0}

    // 公司类型
    $scope.companytype = 0;

    // 每页多少条
    $scope.counts_per_page = 50;

    window.onload=function()
    {
        $scope.query_applyt0();
    }

    function request_item_data()
    {
        $.ajax({
            url : './ctrl_query_member_infos.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "companyid":$scope.data_item.applycompanyid
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){ 
                        if (oJson.data.length > 0) $scope.data_infos = oJson.data[0]; 
                        else $scope.data_infos = {};
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);
                    $scope.$apply(function(){ 
                        $scope.data_infos = {};
                    });
                }
            },
            error:function(xhr, optons, thrownError)
            {
                //alert("原始错误：<br>" + thrownError);
                $scope.$apply(function(){ 
                    $scope.data_infos = {};
                });
            }
        });
    }

    $scope.view_infos = function(applydata)
    {
        $scope.data_item = applydata;

        $('#view_info_model').modal({backdrop: 'static', keyboard: false});
        hide_ctrl("frmT0");
        hide_ctrl("btnsubmit");
        get_companycertificates_files(applydata.applycompanyid, 0);

        request_item_data();
    }

    $scope.modify_infos=function(applydata)
    {
        window.location = 'applyt0.jsp?applyloanconfigid=' + applydata.applyloanconfigid;
    }

    $scope.audit_infos = function(applydata)
    {
        $scope.data_item = applydata;

        $('#view_info_model').modal({backdrop: 'static', keyboard: false});
        show_ctrl("frmT0");
        show_ctrl("btnsubmit");
        request_item_data();
        get_companycertificates_files(applydata.applycompanyid, 0);
    }

    $scope.modify_financingtopamount_infos=function(applydata)
    {
        $scope.data_item = applydata;
        if ($scope.data_item.loanpercent <= 1 && $scope.data_item.loanpercent >= 0) $scope.data_item.loanpercent = $scope.data_item.loanpercent * 100;
        $('#modify_financingtopamount_info_model').modal({backdrop: 'static', keyboard: false});
    }

    $scope.query_datas_counts=function()
    {
        var sBegintime = $scope.params.begintime;
        var sEndtime = $scope.params.endtime;

        if ($scope.params.begintime != '' && $scope.params.endtime != '')
        {
            sBegintime = $scope.params.begintime + " 00:00:00";
            sEndtime = $scope.params.endtime + " 23:59:59";
        }

        $.ajax({
            url : './ctrl_query_t0_apply_counts.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "platformauditflag":$scope.params.platformauditflag,
                "enableflag":$scope.params.enableflag,
                "companyname":$scope.params.companyname,
                "begintime":sBegintime,
                "endtime":sEndtime
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $('#pagination').pagination(oJson.total, {
                        current_page : 0,
                        items_per_page : $scope.counts_per_page,
                        num_display_entries:10,
                        callback : function(page_id){
                            $scope.query_page_datas(Number(page_id) + 1, $scope.counts_per_page);
                        },
                        load_first_page : true,
                        prev_text : '上一页',
                        next_text : '下一页'
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                //alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.query_page_datas=function(nPageIndex, nCountsPerPage)
    {
        var sBegintime = $scope.params.begintime;
        var sEndtime = $scope.params.endtime;

        if ($scope.params.begintime != '' && $scope.params.endtime != '')
        {
            sBegintime = $scope.params.begintime + " 00:00:00";
            sEndtime = $scope.params.endtime + " 23:59:59";
        }

        $.ajax({
            url : './ctrl_query_t0_apply.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "platformauditflag":$scope.params.platformauditflag,
                "enableflag":$scope.params.enableflag,
                "companyname":$scope.params.companyname,
                "begintime":sBegintime,
                "endtime":sEndtime,
                "pagenum":nPageIndex,
                "pagesize":nCountsPerPage
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.params.companytype = oJson.companytype;
                    if ($scope.companytype == 0) $scope.companytype = oJson.companytype;
                    $scope.$apply(function(){
                        $scope.applydatas = oJson.data.rows;
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                //alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.query_applyt0 = function()
    {
        $scope.query_datas_counts(); 
    }

    $scope.recovery_infos=function(applydata, enableflag, platformauditflag)
    {
        var ok = window.confirm("你确认要恢复" + applydata.applycompanyname + "商户的T+0？");
        if (ok)
        {
            $.ajax({
                url : './ctrl_recovery_t0_apply.do',
                type : "post",
                dataType: 'json',
                cache : false,  
                data : {
                    "applyloanconfigid":applydata.applyloanconfigid,
                    "platformauditflag":Number(platformauditflag),
                    "enableflag":Number(enableflag),
                    "companytype":$scope.companytype
                },
                success : function(oJson)
                {
                    if (oJson.ret == 0)
                    {
                        alert("恢复T+0成功");
                        //hide_ctrl("cancel_t0_" + $scope.data_item.applycompanyid);
                        $scope.query_applyt0();
                    }
                    else
                    {
                        alert("数据提交失败，原因：" + oJson.message);
                    }
                },
                error:function(xhr, optons, thrownError)
                {
                    //alert("原始错误：<br>" + thrownError);
                }
            });
        }
    }

    // 商户取消T+0
    $scope.cancel_t0=function(applydata)
    {
        var ok = window.confirm("你确认要暂停" + applydata.applycompanyname + "商户的T+0？");
        if (ok)
        {
            $.ajax({
                url : './ctrl_cancel_t0_apply.do',
                type : "post",
                dataType: 'json',
                cache : false,  
                data : {
                    "applyloanconfigid":applydata.applyloanconfigid,
                    "companytype":$scope.companytype
                },
                success : function(oJson)
                {
                    if (oJson.ret == 0)
                    {
                        alert("取消T+0成功");
                        //hide_ctrl("cancel_t0_" + $scope.data_item.applycompanyid);
                        $scope.query_applyt0();
                    }
                    else
                    {
                        alert("数据提交失败，原因：" + oJson.message);
                    }
                },
                error:function(xhr, optons, thrownError)
                {
                    //alert("原始错误：<br>" + thrownError);
                }
            });
        }
    }

    // 提交审核意见
    $scope.submit_audit = function()
    {
        disabled_ctrl("btnsubmit", true);
        $.ajax({
            url : './ctrl_audit_t0_apply.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "companytype":$scope.companytype,
                "applyloanconfigid":$scope.data_item.applyloanconfigid,
                "auditstate":$scope.params.auditstate,
                "remark":$scope.params.remark                
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    alert("数据提交成功");
                    $('#view_info_model').modal('hide');
                    //hide_ctrl("audit" + $scope.data_item.applycompanyid);
                    $scope.query_applyt0();
                }
                else
                {
                    alert("数据提交失败，原因：" + oJson.message);                    
                }
                disabled_ctrl("btnsubmit", false);
            },
            error:function(xhr, optons, thrownError)
            {
                //alert("原始错误：<br>" + thrownError);
                disabled_ctrl("btnsubmit", false);
            }
        });        
    }

    // 修改T+0的限额
    $scope.submit_financingtopamount_data=function()
    {
        $.ajax({
            url : './ctrl_modify_t0_financingtopamount.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "applyloanconfigid":$scope.data_item.applyloanconfigid,
                "totalloanamount":$scope.data_item.totalloanamount,
                "loanpercent":$scope.data_item.loanpercent,
                "singlelimitamount":$scope.data_item.singlelimitamount,
                "loanbalance":$scope.data_item.loanbalance
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    alert("数据提交成功");
                    $('#modify_financingtopamount_info_model').modal('hide');
                    $scope.query_applyt0();
                }
                else
                {
                    alert("数据提交失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                //alert("原始错误：<br>" + thrownError);
            }
        });
    }
});

// 获取商户的三证一表等图片
function get_companycertificates_files(applycompanyid, nCertificatetypeid)
{
    $.ajax({
        url : './ctrl_query_companycertificates.do',
        type : "post",
        dataType: 'json',
        cache : false,  
        data : {"companyid":applycompanyid, "certificatetypeid":nCertificatetypeid},
        success : function(oJson)
        {
            if (oJson.ret == 0)
            {
                if (oJson.data.rows.key1 != undefined) make_certificate_pic_td(1, oJson.data.rows.key1);
                if (oJson.data.rows.key2 != undefined) make_certificate_pic_td(2, oJson.data.rows.key2);
                if (oJson.data.rows.key3 != undefined) make_certificate_pic_td(3, oJson.data.rows.key3);
                if (oJson.data.rows.key7 != undefined) make_certificate_pic_td(7, oJson.data.rows.key7);
                if (oJson.data.rows.key10 != undefined) make_certificate_pic_td(10, oJson.data.rows.key10);
                if (oJson.data.rows.key14 != undefined) make_certificate_pic_td(14, oJson.data.rows.key14);
                if (oJson.data.rows.key101 != undefined) make_certificate_pic_td(101, oJson.data.rows.key101);
            }
        },
        error:function(xhr, optons, thrownError)
        {
            //alert("原始错误：<br>" + thrownError);
        }
    });
}

function make_certificate_pic_td(nType, file_name)
{
    var pic_type_name = get_pic_type_name(nType);

    // 按分号拆分图片信息
    var files = file_name.split(";");
    var sHref = "";
    for (var i = 0; i < files.length; i++)
    {
        var nIndex = i + 1;
        sHref = sHref + make_pic_td_item(pic_type_name + nIndex, nType, files[i]);
    }
    set_span_value('span_files_' + nType, sHref);
}

function make_pic_td_item(pic_name, nType, file_name)
{
    var arrName = file_name.split("/");
    var oTemp = '<a href="javascript:void(0)" title="' + file_name + '" onclick="view_companycontract_file(\'' + arrName[0] + '\',\'' + arrName[1] + '\')">' 
                + pic_name +
                '</a>&nbsp;&nbsp;';
    return oTemp;
}

function view_companycontract_file(sPath, sFilename)
{
    var sUrl = '';
    if (sPath != '') sUrl = './images.jsp?filetype=2&filename=' + sPath + "," + sFilename;
    else sUrl = './images.jsp?filetype=2&filename=' + sFilename;
    window.open(sUrl,'查看文件信息','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
}