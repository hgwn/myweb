/*
 * 主要用于操作T+0的用户注册、撤销等
 */
angular.module("t0App", [])
.controller('t0FinancingproductsController', function($scope) {
	$scope.financingproducts = [];

    window.onload=function()
    {
        // 获取所有的资方公司以及产品信息
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
                    $scope.$apply(function(){ $scope.financingproducts = jQuery.parseJSON(oJson.t0product); });
                }                
            },
            error:function(xhr, optons, thrownError)
            {
                alert("原始错误：<br>" + thrownError);
            }
        });
    }

    $scope.apply_t0=function(financingproduct)
    {
        
    }
});