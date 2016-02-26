/*
  服务商进件页面 #/serviceprovider
  lihongwen 2015-11-06
*/
operationsModule.controller('serviceproviderCtr', ['$scope', '$http', '$state', '$timeout','$window',function ($scope, $http, $state,$timeout,$window) {
	//定义提交表单对象
    $scope.formData={};
    $scope.formData.companytypeid = 5; //表示添加服务商
    $scope.formData.isCommitted1=false;
    $scope.formData.isCommitted2=false;
    //设置默认选择公司银行账户
    $scope.formData.pbankaccountFlag=1; //true

    $scope.companylevelFlag = false;  //默认不显示 基准以上/以下select
    //设置表格数据
    $scope.formData.ratejson = [];
    //定义费率对象
    $scope.tableOjb = {};
    //定义费率通道数据
    $scope.agentsettlementchannes = [];
    //定义基准以上以下数据
    $scope.profitnames=[];
    //定义基准、分润结算价数据
    $scope.basesettlementrates =[];
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
    
    /*
        =====================================================================
        实现step1/step2/step3 js代码---开始部分
    */
    //定义数组数据
    $scope.stepTabs=[
        {index:1,title:"服务商基本信息",url:"../rboperationsmanager/tpls/serviceprovider/step1.tpl.html",isActive:true},
        {index:2,title:"结算账户",url:"../rboperationsmanager/tpls/serviceprovider/step2.tpl.html"},
        {index:3,title:"结算费率",url:"../rboperationsmanager/tpls/serviceprovider/step3.tpl.html"}
    ]
    $scope.currentTab="../rboperationsmanager/tpls/serviceprovider/step1.tpl.html";
    $scope.step_end=false;
    $scope.isBtnPrevDisabled=true; //设置上一步按钮不可用，默认为true
    //数组数据个数
    var len = $scope.stepTabs.length;
    //下一步函数
    $scope.btnNext=function(){
        //step1 表格forom1
        if(document.getElementById("formDatainvalid1")){
            var invalid = document.getElementById("formDatainvalid1").value;
            //如果发展公司下拉显示
            if($scope.companytypeFlag){
                if($scope.formData.pmemberid ==undefined||$scope.formData.pmemberid==""){
                     $.jBox.tip('请选择发展公司!', 'warning');
                     return;
                }
            }
            $scope.formData.isCommitted1=true; //step1 form 验证
            //省市区id赋值
            if($scope.formData.addressids!=undefined&&$scope.formData.addressids!=""){
                var idsArr = $scope.formData.addressids.split("&");
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
        //step2 表格forom21
        if(document.getElementById("formDatainvalid21")){
            
            var invalid21 = document.getElementById("formDatainvalid21").value;
            $scope.formData.isCommitted2=true;  //step2 form21、22 验证
            //调用获取公司费率通道数据
            $scope.settlementchannel_query();
            //调用获取公司类型id及公司平台级别
            $scope.companytypeplatformlevel_query();

        }
        //step2 表格forom22
        if(document.getElementById("formDatainvalid22")){
            var invalid22 = document.getElementById("formDatainvalid22").value;
            console.log("step2...");
            //判断是否勾选公司账户
            if($scope.formData.pbankaccountFlag){
                if(invalid21=="true"){
                    //$.jBox.tip('请检查form21是否正确!', 'warning');
                    return;
                }
                if($scope.formData.pbankaccount !=$scope.formData.pbankaccount2){
                    //$scope.isBtnPrevDisabled=true;
                    $.jBox.tip('公司银行帐号不一致!', 'warning');
                    return;
                }

            }else{    //个人账户
                if(invalid22=="true"){
                    // $.jBox.tip('请检查form22是否正确!', 'warning');
                    return;
                }
                if($scope.formData.bankaccount !=$scope.formData.bankaccount2){
                    // $scope.isBtnPrevDisabled=true;
                    $.jBox.tip('个人银行帐号不一致!', 'warning');
                    return;
                }

            }
        }

    	//console.log(typeof(invalid));
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
    
    /*    
        实现step1/step2/step3 js代码---结束部分
        ===========================================================
    */

    
    //切换公司银行账户是否选择标志
    $scope.step2Checkbox=function(){
        //$scope.formData.pbankaccountFlag=!$scope.formData.pbankaccountFlag;
        if($scope.formData.pbankaccountFlag){
            $scope.formData.pbankaccountFlag=0;
        }else{
            $scope.formData.pbankaccountFlag=1;
        }
    };

    //设置gridOptions表格参数
    $scope.gridOptions={
        enableColumnMenus: false,
        enableGridMenu: true,
        columnDefs:[
            { name: 'action',displayName: '操作',width:80,enableSorting: false,enableHiding: false,enableColumnResizing:false,type:'text',
                cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a class="tunnel-grid-action" ng-click="grid.appScope.delRow(row.entity)" title="删除"><span class=" glyphicon glyphicon-trash red"></span></a>' +
                '</div>'},
            { name: '费率通道',field:'agentsettlementchannelname',width:'200',type:'text'},
            { name: '基准结算价',field:'basesettlementratename',width:'200',type:'text'},
            { name: '分润结算价',field:'settlementratename',type:'text',width:'200'},
            { name: '基准以下提成',field:'baseagentprofitconfigname',type:'text',width:'120'},
            { name:'基准以上提成',field:'excessagentprofitconfigname',width:'120',type:'text'}
        ]
    };
    
    //对ui-grid表格数据进行赋值
    $scope.gridOptions.data=$scope.formData.ratejson;

    //添加至右边表格
    $scope.toTableBtn=function(){
        var tempOjb = angular.copy($scope.tableOjb);                       //将选择的数据对象copy给临时对象
        var agentsettlementchannelid = tempOjb.agentsettlementchannelid;             // 获取费率通道id
        var basesettlementrateid = tempOjb.basesettlementrateid;           //获取基准结算价id
        var settlementrateid = tempOjb.settlementrateid;                   //分润结算价id
        var baseagentprofitconfigid = tempOjb.baseagentprofitconfigid;     //基准以下提成id
        var excessagentprofitconfigid = tempOjb.excessagentprofitconfigid; //基准以上提成id
        if(agentsettlementchannelid==undefined){
            $.jBox.tip('请选择费率通道!', 'warning');
            return;
        }
        if(basesettlementrateid==undefined){
            $.jBox.tip('请选择基准结算价!', 'warning');
            return;
        }
        if(settlementrateid==undefined){
            $.jBox.tip('请选择分润结算价!', 'warning');
            return;
        }
        
        if($scope.companylevelFlag){
            if(baseagentprofitconfigid==undefined){
            $.jBox.tip('请选择基准以下提成!', 'warning');
            return;
        }
            if(excessagentprofitconfigid==undefined){
                $.jBox.tip('请选择基准以上提成!', 'warning');
                return;
            }
        }
        
        //遍历费率通道数组，将费率通道名称赋值临时对象
        for(var i=0; i<$scope.agentsettlementchannes.length; i++){
            if($scope.agentsettlementchannes[i].settlementchannelid==agentsettlementchannelid){
                tempOjb.agentsettlementchannelname =$scope.agentsettlementchannes[i].settlementchannelname;
                break;
            }
        }
        //遍历数组将基准结算价赋值临时对象
        for(var i=0; i<$scope.basesettlementrates.length; i++){
            if($scope.basesettlementrates[i].rateid==basesettlementrateid){
                tempOjb.basesettlementratename = $scope.basesettlementrates[i].ratename;
            }
            if($scope.basesettlementrates[i].rateid==settlementrateid){
                tempOjb.settlementratename = $scope.basesettlementrates[i].ratename;
            }
        }

        //遍历数组将基准以上/以下提成赋值临时对象
        for(var i=0; i<$scope.profitnames.length; i++){
            if($scope.profitnames[i].profitid==baseagentprofitconfigid){
                tempOjb.baseagentprofitconfigname = $scope.profitnames[i].profitname;
            }
            if($scope.profitnames[i].profitid==excessagentprofitconfigid){
                tempOjb.excessagentprofitconfigname = $scope.profitnames[i].profitname;
            }
        }
        console.log(tempOjb);
        for(var i=0; i<$scope.gridOptions.data.length; i++){
            if($scope.gridOptions.data[i].agentsettlementchannelid==agentsettlementchannelid){
                var name= $scope.gridOptions.data[i].agentsettlementchannelname;
                $.jBox.tip('费率通道：'+name+'<br/>已经存在,请选择其他数据!', 'warning');
                return;
            }
        }
        $scope.formData.ratejson.push(tempOjb);
    };


    //删除表格记录
    $scope.delRow=function(row){
        var agentsettlementchannelid = row.agentsettlementchannelid;
        for(var i=0; i<$scope.formData.ratejson.length; i++){
            if($scope.formData.ratejson[i].agentsettlementchannelid==agentsettlementchannelid){
                $scope.formData.ratejson.splice(i,1);
                break;
            }
        }
        console.log($scope.formData.ratejson);
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
    

    //查询公司类型id以及公司平台级别
    $scope.companytypeplatformlevel_query=function(){
        //判断获取getsession的companyid是否=1，
        //若是，则是运维账户登陆，可以下拉选择发展公司
        //否则，则取getsession的companyid
        if($scope.getSession.companytypeid!=1){
            var companyid = $scope.getSession.companyid;
        }else{
            var companyid = $scope.formData.companyinfo.companyid;
        }
        var data={companyid:companyid};
        $http({
            method:'POST',
            url:'/masgetweb/rboperationsmanager/com/companytypeplatformlevel_query.do',
            data: $.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log("查询公司类型id以及公司平台级别....");
            console.log(data);
            if(data.ret==0){
                $scope.formData.companylevel=data.data[0].platformlevel;
                $scope.formData.platformlevel = data.data[0].platformlevel;
                //如果发展公司的公司级别platformlevel为0，则表示进件一级服务商的信息。则界面显示：select 费率通道/基准结算价/分润结算价/，还有 基准以上以下提成
                //如果发展公司的公司级别platformlevel大于0，则不显示  基准以上以下提成
                if($scope.formData.companylevel==0){ //表示一级服务商
                    $scope.companylevelFlag = true;  //则显示 基准以上以下提成(默认隐藏)
                }
                else{
                    $scope.companylevelFlag = false;  //则隐藏 基准以上以下提成
                }
            }
        }).error(function(resp){
            console.log("error....");
        });
    };
    //获取公司费率通道数据
    $scope.settlementchannel_query=function(){
        var data={pmemberid:$scope.formData.pmemberid,companytypeid:5}; // 获取费率通道数据，服务商companytypeid=5；
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
    $scope.settlementrate_query=function(settlementchannelid){
        if(settlementchannelid ==undefined){
            $scope.basesettlementrates.length=0;
            return;
        }
        console.log("settlementchannelid:"+settlementchannelid);
        //var data ={companytypeid:5,pmemberid:600000083,settlementchannelid:settlementchannelid};
        var data ={companytypeid:5,pmemberid:$scope.formData.pmemberid,settlementchannelid:settlementchannelid};
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
        if($scope.formData.ratejson.length==0){
            $.jBox.tip('至少需要配置一组费率！', 'warning');
            return;
        }
        var data = {data:JSON.stringify($scope.formData)};
         $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/member_add.do" ,
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
    
    //统一初始化函数
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
        
       //调用获取公司数据--发展公司
       $scope.fingcompanyinfo();
        
        
    };
    
    //调用初始化函数
    $scope.init();

    //只输入数字
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
    
}])

