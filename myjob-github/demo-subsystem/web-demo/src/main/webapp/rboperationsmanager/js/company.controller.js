operationsModule.controller('newcompanyCtr', ['$scope', '$http', '$state', '$timeout','$window',function ($scope, $http, $state,$timeout,$window) {
	//定义提交表单对象
    $scope.formData={};
    $scope.formData.companytypeid = 3; //表示商户
    $scope.formData.isCommitted1=false;
    $scope.formData.isCommitted2=false;
    //设置默认选择公司银行账户
    $scope.formData.pbankaccountFlag=true;
    $scope.formData.creditcardaccountflag =1;
    //设置选择个人账户，默认不选择
    $scope.formData.bankaccountFlag=false;

    //定义费率数组
    $scope.formData.ratejson = [];
    //定义费率对象
    $scope.tableOjb = {};
    //定义信用卡划账数据
    $scope.creditcardaccounts =[{id:1,name:"公账"},{id:2,name:"私账"}]
    //测试费率通道数据
    $scope.basesettlementrates=[
        {basesettlementrateid:10900000,basesettlementratename:"基准结算价"},
        {basesettlementrateid:10900001,basesettlementratename:"基准结算价22"},
        {basesettlementrateid:10900002,basesettlementratename:"基准结算价444"},
        {basesettlementrateid:10900003,basesettlementratename:"基准结算价555"}]

    //行业类型数据
    $scope.industrytypes=[
        {id:30001,value:"电商"},
        {id:30002,value:"快递"},
        {id:30003,value:"物流专线"},
        {id:30004,value:"货运代理"},
        {id:30005,value:"物流联盟"},
        {id:30006,value:"物流园"},
        {id:30007,value:"生产"},
        {id:30008,value:"制造"},
        {id:30009,value:"批发"},
        {id:300010,value:"商贸流通"}]
    //定义数组数据
    $scope.stepTabs=[
        {index:1,title:"商户基本信息",url:"../rboperationsmanager/tpls/company/step1.tpl.html",isActive:true},
        {index:2,title:"结算账户",url:"../rboperationsmanager/tpls/company/step2.tpl.html"},
        {index:3,title:"结算费率",url:"../rboperationsmanager/tpls/company/step3.tpl.html"}
    ]
    $scope.currentTab="../rboperationsmanager/tpls/company/step1.tpl.html";
    $scope.step_end=false;
    $scope.isBtnPrevDisabled=true; //设置上一步按钮不可用，默认为true
    //数组数据个数
    var len = $scope.stepTabs.length;
    //下一步函数
    $scope.btnNext=function(){
        //如果发展公司下拉显示
        if($scope.companytypeFlag){
            if($scope.formData.pmemberid ==undefined||$scope.formData.pmemberid==""){
                $.jBox.tip('请选择发展公司!', 'warning');
                return;
            }
        }
        if(document.getElementById("formDatainvalid1")){
            var invalid = document.getElementById("formDatainvalid1").value;
            $scope.formData.isCommitted1=true;
        }

        if(document.getElementById("formDatainvalid21")){
            var invalid21 = document.getElementById("formDatainvalid21").value;
            $scope.formData.isCommitted2=true;
            //调用获取公司费率通道数据
            $scope.settlementchannel_query();
        }
        if(document.getElementById("formDatainvalid22")){
            var invalid22 = document.getElementById("formDatainvalid22").value;
            //第二步form1企业账号勾选且验证不通过则不继续下一步
            if( $scope.formData.pbankaccountFlag){
                if(invalid21=="true") return;
                if($scope.formData.pbankaccount !=$scope.formData.pbankaccount2){
                    $.jBox.tip('公司银行帐号不一致!', 'warning');
                    return;
                }
            }
            //第二步form2个人账户勾选且验证不通过则不继续下一步
            if( $scope.formData.bankaccountFlag){
                if(invalid22=="true") return;
                if($scope.formData.bankaccount !=$scope.formData.bankaccount2){
                    $.jBox.tip('个人银行帐号不一致!', 'warning');
                    return;
                }
            }
            if(!$scope.formData.pbankaccountFlag&& !$scope.formData.bankaccountFlag){
                $.jBox.tip('至少要勾选一个账号信息!', 'warning');
                return;
            }

        }
        //省市区id赋值
        if($scope.formData.addressids!=undefined&&$scope.formData.addressids!=""){
            var idsArr = $scope.formData.addressids.split("&");
            console.log(idsArr);
            if(idsArr.length==1){
                $.jBox.tip('省市不能为空!', 'warning');
                return;
            }
            else{
                $scope.formData.provinceid=idsArr[0];
                $scope.formData.cityid=idsArr[1];
            }
            if(idsArr.length==3){
                $scope.formData.areaid=idsArr[2];
            }
            else{
                $scope.formData.areaid=0;//删除区id
            }
        }
        //将服务商名称赋值给企业账号
        if($scope.formData.membername !=undefined&&$scope.formData.membername!=""){
            $scope.formData.paccountname = $scope.formData.membername;
        }
        //将法人赋值给个人账号
        if($scope.formData.legalperson !=undefined&&$scope.formData.legalperson!=""){
            $scope.formData.accountname = $scope.formData.legalperson;
        }
        //将法人身份证赋值给个人身份证
        if($scope.formData.legalpersonidcard !=undefined&&$scope.formData.legalpersonidcard!=""){
            $scope.formData.idcardno = $scope.formData.legalpersonidcard;
        }
    	//console.log(typeof(invalid));
        //第一步验证不通过则不继续下一步
    	if(invalid=="true"){
    		return;
    	}


        for(var i=0; i<$scope.stepTabs.length;i++){
            //单击选中
            if($scope.stepTabs[i].isActive){
                var index = $scope.stepTabs[i].index-1;//当前索引
            }
            $scope.stepTabs[i].isActive=false;//移除所有active class样式
        }
        index++;
        //最后一项之后设置索引为0,同时去掉所有项complete 样式
        if(index>=len){
            index=0;
            for(var j=0;j<len;j++){
                $scope.stepTabs[j].isComplete=false;
            }
        }
        if(index==len-1){$scope.step_end=true;}
        //设置当前项 active样式及 url
        $scope.stepTabs[index].isActive=true;
        $scope.currentTab=$scope.stepTabs[index].url;
        console.log(index);
        //添加完成项样式 complete 样式
        for(var j=0; j<index; j++){
            $scope.stepTabs[j].isComplete=true;
        }
        //使下一步按钮可用
        //document.getElementById("btnPrev").removeAttribute("disabled");
        $scope.isBtnPrevDisabled=false;

    }
    //上一步函数
    $scope.btnPrev=function(){
        //遍历数组
        for(var i=0;i<$scope.stepTabs.length;i++){
            //判断当前项是否选中
            if($scope.stepTabs[i].isActive){
                var index=$scope.stepTabs[i].index-1; //获取当前项索引
            }
            //清空所有项active样式
            $scope.stepTabs[i].isActive=false;
        }
        index--;
        //若到了第一项，则设置索引回到末尾
        if(index<0){
            index=len-1;
        }
        //设置当前项active样式和url
        $scope.stepTabs[index].isActive=true;
        $scope.currentTab=$scope.stepTabs[index].url;
        //console.log(index);
        //去除当前项至末尾complete样式
        for(var j=index; j<len;j++){
            $scope.stepTabs[j].isComplete=false;
        }
        if(index==0){
            //document.getElementById("btnPrev").setAttribute("disabled", "disabled");
        	 $scope.isBtnPrevDisabled=true;
        }
        $scope.step_end=false;
    }
    //stepTab()函数指定跳转第几步
    $scope.stepTab=function(step){
        var index =step.index-1;  //当前索引值
        //判断是否完成项
        if(step.isComplete){
            $scope.currentTab=step.url;
            //去除当前项值末尾complete样式
            for(var j=index;j<$scope.stepTabs.length;j++){
                $scope.stepTabs[j].isComplete=false;
            }
            //去除所有项active样式
            for(var i=0;i<$scope.stepTabs.length;i++){
                $scope.stepTabs[i].isActive=false;
            }
            $scope.stepTabs[index].isActive=true;
        }
        if(index==0){
           // document.getElementById("btnPrev").setAttribute("disabled","disabled");
        	 $scope.isBtnPrevDisabled=true;
        }
        $scope.step_end=false;
    }

    //切换公司银行账户是否选择标志
    $scope.step2Checkbox=function(){
        $scope.formData.pbankaccountFlag=!$scope.formData.pbankaccountFlag;
        if(!$scope.formData.pbankaccountFlag){
            $scope.formData.creditcardaccountflag = 2;
        }
    };
    //切换个人账户是否选择标志
    $scope.bankaccountFlag=function(){
        $scope.formData.bankaccountFlag=!$scope.formData.bankaccountFlag;
        if(!$scope.formData.bankaccountFlag){
            $scope.formData.creditcardaccountflag = 1;
        }
    };

    $scope.validateNumber = function(e){
        var event = window.event || e;
        var iKeyCode = event.keyCode || event.which; //获取按钮代码
        if(iKeyCode<48 ||iKeyCode>57){   //只能输入数字
            if(document.all){
                event.returnValue = false;
            }
            else{
                if(iKeyCode!=8){
                    event.preventDefault();
                }

            }
            if(iKeyCode!=8){
                $.jBox.tip('请输入数字!', 'warning');
            }
        }
    };

    //定义查询公司数据表单对象
    $scope.companyinfoFormData={pagenum:1,pagesize:20,companytypeid:[5,99]};  //限制查询发展公司类型companytypeid=5为服务商，companytypeid=99销售
    //获取公司数据--发展公司
    $scope.fingcompanyinfo=function(){
        console.log("获取公司数据--发展公司$scope.companyinfoFormData....");
        console.log($scope.companyinfoFormData);
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/companyinfo_query.do" ,
            data :$.param($scope.companyinfoFormData),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success( function(data) {
            $scope.companydatas=data;
        }).error( function(){
            console.log( "error.....");
        });
    };

    //监听发展公司
    $scope.$watch("formData.companyinfo",function(newVal,oldVal){
        console.log("watch..");
        console.log(newVal);
        if(newVal != null){
            $scope.formData.pmemberid = newVal.companyid;      //赋值给发展公司id
            $scope.formData.pmembername = newVal.companyname;  //赋值给发展公司名称
            console.log("监听发展公司companyid.....");
            console.log($scope.formData.pmemberid);
            //监听已选择其他发展公司，则清空 基准结算价及临时数组数据
           $scope.basesettlementrates.length=0;
           $scope.formData.ratejson.length=0;
           $scope.tableOjb = {};

        }
    });
    //获取公司费率通道数据
    $scope.settlementchannel_query=function(){
        var data={pmemberid:$scope.formData.pmemberid,companytypeid:3}; // 获取费率通道数据，商户companytypeid=3；
        console.log(data);
        //var data ={companytypeid:5,pmemberid:600000083};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/settlementchannel_query.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log("获取公司费率通道数据...");
            console.log(data);
            if(data.ret==0){
                $scope.agentsettlementchannes=data.data;
            }
        }).error(function(resp){
            console.log("error...");
        });
    };
    //获取公司结算价格数据---根据select 费率通道 onchange事件
    //商户：companytypeid:3,
    $scope.settlementrate_query=function(settlementchannelid){
        if(settlementchannelid ==undefined){
            $scope.basesettlementrates.length=0;
            return;
        }
        console.log("settlementchannelid:"+settlementchannelid);
        var data ={companytypeid:3,pmemberid:$scope.formData.pmemberid,settlementchannelid:settlementchannelid};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/settlementrate_query.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log(data);
            if(data.ret==0){
                $scope.basesettlementrates=data.data;
            }
        }).error(function(resp){
            console.log("error...");
        });
    };

    //提交
    $scope.btnSubmit=function(){
        console.log("submit....");
        console.log($scope.formData);
        delete $scope.formData.companyinfo;
        if(!$scope.tableOjb.agentsettlementchannelid){
            $.jBox.tip('请选择结算通道！', 'warning');
            return;
        }
        else{
            for(var i=0; i<$scope.agentsettlementchannes.length; i++){
                if($scope.agentsettlementchannes[i].settlementchannelid ==$scope.tableOjb.agentsettlementchannelid){
                    $scope.tableOjb.agentsettlementchannelname = $scope.agentsettlementchannes[i].settlementchannelname;
                    break;
                }
            }
        }
        if(!$scope.tableOjb.basesettlementrateid){
            $.jBox.tip('请选择商户签约费率！', 'warning');
            return;
        }
        else{
            for(var i=0; i<$scope.basesettlementrates.length; i++){
                if($scope.basesettlementrates[i].rateid ==$scope.tableOjb.basesettlementrateid){
                    $scope.tableOjb.basesettlementratename = $scope.basesettlementrates[i].ratename;
                    break;
                }
            }
        }
        if(!$scope.formData.creditcardaccountflag){
            $.jBox.tip('请选择信用卡划账！', 'warning');
            return;
        }
        $scope.formData.ratejson.push($scope.tableOjb);
        var data = {data:JSON.stringify($scope.formData)};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/membernew_add.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log(data);
            if(data.ret==0){
                $.jBox.tip('添加成功！', 'success');
                $timeout(function(){
                    $window.location.reload();
                },2000);

            }
        }).error(function(resp){
            console.log("error...");
        });
    }
    //初始化函数
    $scope.init=function(){

        //获取session数据
        $http.get("/masgetweb/base/getSession.do").success(function(data){
            console.log("getSession...");
            console.log(data);
            $scope.getSession=data;
            //如果 companytypeid=1，是运维账户，则可添加发展公司，否则不可。
            if($scope.getSession.companytypeid==1){
                $scope.companytypeFlag = true;  //“发展公司”则下拉选择
            }
            else{
                $scope.companytypeFlag = false;
                $scope.formData.pmemberid =  $scope.getSession.companyid;     //赋值给发展公司id
                $scope.formData.pmembername =  $scope.getSession.companyname; //赋值给发展公司名称
            }
        });

        //无条件获取基准以上以下提成数据
        $http.get("/masgetweb/rboperationsmanager/com/agentprofitconfig_get.do")
        .success(function(data){
            console.log(data);
            if(data.ret==0){
                $scope.profitnames=data.data;
            }
        });

        //调用发展公司数据
        $scope.fingcompanyinfo();
    };

    //调用初始化函数
    $scope.init();
}])

