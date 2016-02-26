/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0ApplyController', function($scope) {
	$scope.financingproducts = [];
    $scope.params = {"loanpercent":100, "singlelimitamount":1, "loanbalance":0, "bankloanflag":1, "bankloanflag":0, "applyloanconfigid":0};
    $scope.params.selected_financingproductid = 0;

    window.onload=function()
    {
        var applyloanconfigid = get_value("modify_applyloanconfigid");
        var selected_financingproductid = get_value("selected_financingproductid");
        $scope.params.selected_financingproductid = Number(selected_financingproductid);

        if (Number(applyloanconfigid) > 0)
        {
            $scope.query_modify_infos(applyloanconfigid);            
        }
        else
        {
            // 获取所有的资方公司以及产品信息
            $scope.query_financingproduct();
        }
        
        // 获取公司所有的三证一表
        get_companycertificates_files(0);
    }

    $scope.query_financingproduct=function()
    {
        $.ajax({
            url : './ctrl_query_financingproduct.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {},
            success : function(oJson)
            {
                // {"message":"success","ret":0,"t0product":"[{\"financingproductid\":1,\"financingproductname\":\"融资产品名称\",\"financingproductnumericroduce\":null,\"conditiondesc\":\"融资产品条件描述\",\"loanbankid\":1,\"loanbankname\":\"资方公司名称\",\"financingtopamount\":300000.0,\"regulatorreportflag\":1,\"transactionflowperiod\":0,\"auditcompanyqty\":2,\"companycontractno\":\"1001\",\"enableflag\":1,\"remark\":\"备注\",\"auditstaffid\":0,\"auditstaffname\":null,\"auditstafftime\":null,\"createdby\":1,\"createdbyname\":\"me\",\"createdtime\":\"2015-05-11 18:19:06\"},{\"financingproductid\":2,\"financingproductname\":\"融资产品名称\",\"financingproductnumericroduce\":\"融资产品介绍\",\"conditiondesc\":\"融资产品条件描述\",\"loanbankid\":1,\"loanbankname\":\"资方公司名称\",\"financingtopamount\":300000.0,\"regulatorreportflag\":1,\"transactionflowperiod\":0,\"auditcompanyqty\":2,\"companycontractno\":\"1002\",\"enableflag\":1,\"remark\":\"备注\",\"auditstaffid\":0,\"auditstaffname\":null,\"auditstafftime\":null,\"createdby\":1,\"createdbyname\":\"notme\",\"createdtime\":\"2015-05-20 20:08:23\"}]"}
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){ 
                        $scope.financingproducts = jQuery.parseJSON(oJson.t0product); 

                        for (var i = 0; i < $scope.financingproducts.length; i++)
                        {
                            if ($scope.params.bankloanflag > 0)
                            {
                                if ($scope.financingproducts[i].financingproductid == $scope.params.bankloanflag)
                                {
                                    $scope.financingproduct = $scope.financingproducts[i];
                                    $scope.change_financingproduct();
                                    break;
                                }
                            }
                            
                            if ($scope.params.selected_financingproductid > 0)
                            {
                                if ($scope.financingproducts[i].financingproductid == $scope.params.selected_financingproductid)
                                {
                                    $scope.financingproduct = $scope.financingproducts[i];
                                    $scope.change_financingproduct();
                                    hide_ctrl("cmbfinancingproduct");
                                    break;
                                }
                            }
                        }
                    });

                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                
            }
        });
    }

    $scope.change_financingproduct = function()
    {
        $.ajax({
            url : './ctrl_query_companycontract.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {"companycontractno":$scope.financingproduct.companycontractno},
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    var sType = "";
                    var sTr = "";

                    for (var i = 0; i < oJson.data.length; i++)
                    {
                        // {"ret":0,"data":[{"contractdemopath":"contract_2015489725.pdf","maincontractno":null,"contractdemoid":1,"contractdemono":"1001","attachedflag":null,"contractdemoname":"电子合同模板"}],"message":"查询成功"}
                        if (oJson.data[i].attachedflag == 1) sType = "主合同";
                        else if (oJson.data[i].attachedflag == 2) sType = "附加合同";
                        else sType = "未知";
                        var sTemp = '<tr><td>' +oJson.data[i].contractdemoname+ '</td><td>'+ sType +
                            '</td><td><a href="javascript:void(0)" onclick="view_companycontract_file(\'\', \''+oJson.data[i].contractdemopath+ 
                            '\')">查看</a>&nbsp&nbsp</td></tr>';
                        sTr = sTr + sTemp;
                    }
                    document.getElementById("companycontract_body").innerHTML = sTr;
                }
            },
            error:function(xhr, optons, thrownError)
            {
                
            }
        });
    }

    // 查询修改的信息
    $scope.query_modify_infos=function(applyloanconfigid)
    {
        $.ajax({
            url : './ctrl_query_member_infos_by_applyloanconfigid.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "applyloanconfigid":applyloanconfigid
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    $scope.$apply(function(){ 
                        if (oJson.data.length > 0)
                        {
                            $scope.params = oJson.data[0];
                            if ($scope.params.loanpercent <= 1) $scope.params.loanpercent = $scope.params.loanpercent * 100;
                            $scope.query_financingproduct();
                        }
                    });
                }
                else
                {
                    alert("数据查询失败，原因：" + oJson.message);
                }
            },
            error:function(xhr, optons, thrownError)
            {
                
            }
        });
    }

    function search_pic(nUploadtype)
    {
        get_companycertificates_files(nUploadtype);
    }

	$scope.submit_applyt0 = function()
    {
        if ($scope.params.singlelimitamount > 50000 || $scope.params.singlelimitamount > $scope.financingproduct.financingtopamount)
        {
            alert("单笔最高不能超过50000元，同时也不能超过最高限额" + $scope.financingproduct.financingtopamount + "元");
            return;
        }

        $.ajax({
            url : './ctrl_submit_t0_apply.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {                
                "loanbankid":$scope.financingproduct.loanbankid,                // 资方公司
                "applyloanaccountname":$scope.params.applyloanaccountname,      // 申请融资产品公司收款户名
                "loanpercent":$scope.params.loanpercent,                        // 货款可贷款百分比.小于等于1
                "singlelimitamount":$scope.params.singlelimitamount,            // 融资产品结算单笔最高限额
                "loanbalance":$scope.params.loanbalance,                        // 结算可用余额
                "creditcardallowflag":1,                                        // 信用卡T结算标志 1=不允许 2=允许
                "financingproductname":$scope.financingproduct.financingproductname, // 融资产品名称
                "loanbankname":$scope.financingproduct.loanbankname, // 资方公司名称
                "bankloanflag":$scope.financingproduct.financingproductid, // 金融产品id
                "bank":$scope.params.bank, // 申请融资产品公司收款账户开户行
                "applyloanbankaccount":$scope.params.applyloanbankaccount,        // 申请融资产品公司收款帐号
                "bankcode":$scope.params.bankcode, // 申请融资产品公司收款开户行的联行号
                "bankaddress":$scope.params.bankaddress, // 申请融资产品公司收款开户行地址
                "totalloanamount":$scope.financingproduct.financingtopamount, // 融资产品最高限额
                "idcardno":$scope.params.idcardno,                    // 收款人身份证号码
                "companycontractno":"", // 主电子合同模板编号
                "accounttype":$scope.params.accounttype // 账号类型
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    alert("T+0申请成功");
                    document.getElementById("btnsubmit").style.display="none";
                }
                else
                {
                    alert("T+0申请失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
	}

    $scope.back_to_applyt0 = function()
    {
        window.location = 'statet0.jsp';
    }

    $scope.modify_applyt0 = function()
    {
        $.ajax({
            url : './ctrl_modify_t0_apply.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "applyloanconfigid":$scope.params.applyloanconfigid,
                "loanbankid":$scope.financingproduct.loanbankid, // 资方公司
                "applyloanaccountname":$scope.params.applyloanaccountname, // 申请融资产品公司收款户名
                "loanpercent":$scope.params.loanpercent, // 货款可贷款百分比.小于等于1
                "singlelimitamount":$scope.params.singlelimitamount, // 融资产品结算单笔最高限额
                "loanbalance":$scope.params.loanbalance,                 // 结算可用余额
                "creditcardallowflag":1,         // 信用卡T结算标志 1=不允许 2=允许
                "financingproductname":$scope.financingproduct.financingproductname, // 融资产品名称
                "loanbankname":$scope.financingproduct.loanbankname, // 资方公司名称
                "bankloanflag":$scope.financingproduct.financingproductid, // 金融产品id
                "bank":$scope.params.bank, // 申请融资产品公司收款账户开户行
                "applyloanbankaccount":$scope.params.applyloanbankaccount,        // 申请融资产品公司收款帐号
                "bankcode":$scope.params.bankcode, // 申请融资产品公司收款开户行的联行号
                "bankaddress":$scope.params.bankaddress, // 申请融资产品公司收款开户行地址
                "totalloanamount":$scope.financingproduct.financingtopamount, // 融资产品最高限额
                "idcardno":$scope.params.idcardno,                    // 收款人身份证号码
                "companycontractno":"", // 主电子合同模板编号
                "accounttype":$scope.params.accounttype // 账号类型
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    alert("T+0修改成功");
                    window.location = 'statet0.jsp';
                }
                else
                {
                    alert("T+0修改失败，原因：" + oJson.message);                    
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    // 用于操作T+0的各种方法

    // 向导的第一步
    function check_wizard_first()
    {
        if ($scope.financingproduct == undefined)
        {
            alert("请选择一个资方公司的产品");
            return false;
        }
        return true;
    }

    // 向导的第二步
    function check_wizard_second()
    {
        if ($scope.params.applyloanaccountname == undefined || $scope.params.applyloanaccountname.length < 2)
        {
            alert("公司收款户名必须要填写，并且长度不少于2个字符");
            return false;
        }

        if ($scope.params.applyloanbankaccount == undefined || isNaN($scope.params.applyloanbankaccount))
        {
            alert("收款帐号必须要填写，全部为数字，最少为8位");
            return false;
        }

        if ($scope.params.idcardno == undefined || isNaN($scope.params.idcardno.substr(0, $scope.params.idcardno.length - 1)))
        {
            alert("身份证号码必须要填写，前面全部为数字，最后一位可以是X");
            return false;
        }

        if ($scope.params.bank == undefined)
        {
            alert("开户行必须要填写");
            return false;
        }

        if ($scope.params.bankaddress == undefined)
        {
            alert_message("开户行地址必须要填写");
            return false;
        }        

        // applyloanaccountname = trim_all($scope.params.applyloanaccountname);
        return true;
    }

    // 向导的第三步
    function check_wizard_three()
    {
        if ($scope.params.loanpercent == undefined || isNaN($scope.params.loanpercent))
        {
            alert("可贷款百分比必须要填写，为数字");
            return false;
        }

        if ($scope.params.singlelimitamount == undefined || isNaN($scope.params.singlelimitamount))
        {
            alert("单笔最高限额要填写，为数字");
            return false;
        }

        if ($scope.params.loanbalance == undefined || isNaN($scope.params.loanbalance))
        {
            alert("结算可用余额必须要填写，为数字");
            return false;
        }
    }
});

function view_companycontract_file(sPath, sFilename)
{
    var sUrl = '';
    if (sPath != '') sUrl = './images.jsp?filetype=1&filename=' + sPath + "," + sFilename;
    else sUrl = './images.jsp?filetype=1&filename=' + sFilename;
    window.open(sUrl,'查看文件信息','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
}

function view_certificate_file(sPath, sFilename)
{
    var sUrl = '';
    if (sPath != '') sUrl = './images.jsp?filetype=2&filename=' + sPath + "," + sFilename;
    else sUrl = './images.jsp?filetype=2&filename=' + sFilename;
    window.open(sUrl,'查看文件信息','left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
}


// 获取对应公司所有的三证一表等资料
/*
    {"ret":0,"data":{"total":15,"rows":{"2":"mgcompanycas/10101020_6000000000000388_2_1092199341_20150411111041_2051593278.jpg","3":"mgcompanycas/10101020_6000000000000388_3_1724641652_20150411113123_1465461605.png;mgcompanycas/10101020_6000000000000388_3_834422157_20150411111946_1064977789.png","7":"mgcompanycas/10101020_6000000000000388_7_1689338627_20150411111946_833007002.png","10":"mgcompanycas/10101020_6000000000000388_10_902787821_20150411111946_1182941492.png;mgcompanycas/10101020_6000000000000388_10_953252227_20150411113026_1082172569.jpg;mgcompanycas/10101020_6000000000000388_10_294052118_20150411111946_774075479.png;mgcompanycas/10101020_6000000000000388_10_1413091442_20150411113043_806213521.jpg","14":"mgcompanycas/10101020_6000000000000388_14_1207008642_20150411111946_1063716532.png;mgcompanycas/10101020_6000000000000388_14_1375656924_20150411112012_856978066.png;mgcompanycas/10101020_6000000000000388_14_57534833_20150411112012_620297081.png;mgcompanycas/10101020_6000000000000388_14_69536612_20150411112012_470733916.jpg;mgcompanycas/10101020_6000000000000388_14_56698787_20150411112012_1601257488.png;mgcompanycas/10101020_6000000000000388_14_399640401_20150411112012_1574855438.png;mgcompanycas/10101020_6000000000000388_14_859397191_20150411112012_2061063062.png"}},"message":"查询成功"}
*/
function get_companycertificates_files(nCertificatetypeid)
{
    $.ajax({
        url : './ctrl_query_companycertificates.do',
        type : "post",
        dataType: 'json',
        cache : false,  
        data : {"companyid":0, "certificatetypeid":nCertificatetypeid},
        success : function(oJson)
        {
            if (oJson.ret == 0)
            {
                if (nCertificatetypeid == 0)
                {
                    make_certificate_pic_tr(1, oJson.data.rows.key1);
                    make_certificate_pic_tr(2, oJson.data.rows.key2);
                    make_certificate_pic_tr(3, oJson.data.rows.key3);
                    make_certificate_pic_tr(7, oJson.data.rows.key7);
                    make_certificate_pic_tr(10, oJson.data.rows.key10);
                    make_certificate_pic_tr(14, oJson.data.rows.key14);
                    make_certificate_pic_tr(101, oJson.data.rows.key101);
                }
                else
                {
                    if (nCertificatetypeid == 1) make_certificate_pic_tr(1, oJson.data.rows.key1);
                    if (nCertificatetypeid == 2) make_certificate_pic_tr(2, oJson.data.rows.key2);
                    if (nCertificatetypeid == 3) make_certificate_pic_tr(3, oJson.data.rows.key3);
                    if (nCertificatetypeid == 7) make_certificate_pic_tr(7, oJson.data.rows.key7);
                    if (nCertificatetypeid == 10) make_certificate_pic_tr(10, oJson.data.rows.key10);
                    if (nCertificatetypeid == 14) make_certificate_pic_tr(14, oJson.data.rows.key14);
                    if (nCertificatetypeid == 101) make_certificate_pic_tr(101, oJson.data.rows.key101);
                }
            }
        },
        error:function(xhr, optons, thrownError)
        {
            alert("原始错误：<br>" + thrownError);
        }
    });
}

function make_certificate_pic_tr(nType, file_name)
{
    var sHref = "";
    var sOptions = '';
    var pic_type_name = get_pic_type_name(nType);

    if (file_name == undefined || file_name == '')
    {
        set_span_value('span_files_' + nType, '');
    }
    else
    {
        // 按分号拆分图片信息
        var files = file_name.split(";");
        
        for (var i = 0; i < files.length; i++)
        {
            var nIndex = i + 1;
            sHref = sHref + make_pic_tr_item(pic_type_name + nIndex, nType, files[i]);

            if (i == 0) sOptions = sOptions + '<option value="' + files[i] + '" selected>' + pic_type_name + nIndex + '</option>';
            else sOptions = sOptions + '<option value="' + files[i] + '">' + pic_type_name + nIndex + '</option>';
        }
        set_span_value('span_files_' + nType, sHref);
    }

    // 设置删除的下拉列表框
    var oSelect = document.getElementById("select_files_" + nType);
    oSelect.innerHTML = sOptions;
}

function make_pic_tr_item(pic_name, nType, file_name)
{
    var arrName = file_name.split("/");
    var oTemp = '<a href="javascript:void(0)" title="' + file_name + '" onclick="view_certificate_file(\'' + arrName[0] + '\',\'' + arrName[1] + '\')">' 
                + pic_name +
                '</a>&nbsp;&nbsp;';
    return oTemp;
}

function set_upload_statue(nUploadtype, sInfo)
{
    set_span_value('progress_text_' + nUploadtype, sInfo);
}

function search_pic(nUploadtype)
{
    get_companycertificates_files(nUploadtype);
}

function remove_pic(nType)
{
    //var oSelect = document.getElementById("select_files_" + nType);
    var sFile = get_value("select_files_" + nType);
    if (sFile == undefined || sFile == '') return;
    var ok = window.confirm("你确认要删除此图片？");
    if (ok)
    {
        $.ajax({
            url : './ctrl_remove_companycertificates.do',
            type : "post",
            dataType: 'json',
            cache : false,  
            data : {
                "type":nType, 
                "picname":sFile
            },
            success : function(oJson)
            {
                if (oJson.ret == 0)
                {
                    get_companycertificates_files(nType);
                }
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }
}