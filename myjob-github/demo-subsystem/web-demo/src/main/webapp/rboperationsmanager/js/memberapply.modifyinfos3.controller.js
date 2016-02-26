/**
 * Created by lhw on 2015/11/25.
 */
/*商户修改*/
operationsModule.controller("modifyinfos3Ctrl",["$http","$scope","$state","$stateParams","$modal","$alert","operationsmanagerService",function($http,$scope,$state,$stateParams,$modal,$alert,operationsmanagerService){
    //定义提交数据
    $scope.formData= {isCommit:false};
    $scope.agentsettlementchannes = []; //定义结算通道
    $scope.basesettlementrates = []; //定义商户签约费率
    $scope.tableOjb = {};
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
    //src/main/webapp/rboperationsmanager/tpls/memberapply/companymodify/infos3.step1.tpl.html
    $scope.stepTabs=[
        {index:1,title:"基本信息",url:"../rboperationsmanager/tpls/memberapply/companymodify/infos3.step1.tpl.html",isActive:true},
        {index:2,title:"账号信息",url:"../rboperationsmanager/tpls/memberapply/companymodify/infos3.step2.tpl.html"},
        {index:3,title:"费率信息",url:"../rboperationsmanager/tpls/memberapply/companymodify/infos3.step3.tpl.html"},
        {index:4,title:"审核情况",url:"../rboperationsmanager/tpls/memberapply/tabContent-4.html"}
    ]
    $scope.currentTab="../rboperationsmanager/tpls/memberapply/companymodify/infos3.step1.tpl.html";

    //stepTab
    $scope.stepTab=function(step){
        var index = step.index;
        for(var i=0; i<$scope.stepTabs.length; i++){
            $scope.stepTabs[i].isActive = false;
            if($scope.stepTabs[i].index==index){
                $scope.stepTabs[i].isActive = true;
                $scope.currentTab = $scope.stepTabs[i].url;
            }
        }
    };

    //memberproperty_query获取详情数据
    $scope.memberproperty_query=function(){
       // console.log("$stateParams....");
        //console.log($stateParams);
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/memberproperty_query.do" ,
            data :$.param($stateParams),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success( function(data) {
            for(var x in data.mgbase_companyinfo[0]){
                data[x]=data.mgbase_companyinfo[0][x];
            };
            for(var x in data.mgbase40_companystaff[0]){
                data[x]= data.mgbase40_companystaff[0][x];
            };
            for(var x in data.mgbase40_companystations[0]){
                data[x] = data.mgbase40_companystations[0][x];
            };
            for(var x in data.mgbase_upsmercharinfo[0]){
                data[x] = data.mgbase_upsmercharinfo[0][x];
            };
            for(var x in data.mgbase_companycertificates[0]){
                data[x] = data.mgbase_companycertificates[0][x];
            };
            for(var x in data.mgsettlement_companymerchant[0]){
                data[x] = data.mgsettlement_companymerchant[0][x];
            };
            for(var x in data.mgsettlement_agentsettlementrate[0]){
                data[x] = data.mgsettlement_agentsettlementrate[0][x];
            };

            $scope.queryData = angular.copy(data);
            $scope.formData = angular.copy(data);
            $scope.formData.industrytype = $scope.formData.industrytypeid;
            //拼接省市县
            if($scope.formData.provincename !=null){
                $scope.formData.pca = $scope.formData.provincename;
            }
            if($scope.formData.cityname !=null){
                $scope.formData.pca = $scope.formData.pca +" " + $scope.formData.cityname;
            }
            if($scope.formData.areaname !=null){
                $scope.formData.pca = $scope.formData.pca +" " + $scope.formData.areaname;
            }
            //账户信息
            for(var i=0; i<$scope.formData.mgsettlement_companyaccountinfo.length; i++){
                //接口返回的数据：accounttype==1私账; accounttype==0公账
                if($scope.formData.mgsettlement_companyaccountinfo[i].accounttype==1){  //私账
                    for(var x in $scope.formData.mgsettlement_companyaccountinfo[i]){
                        $scope.formData[x] =  $scope.formData.mgsettlement_companyaccountinfo[i][x];
                    }
                }
                if($scope.formData.mgsettlement_companyaccountinfo[i].accounttype==0){  //公账
                    for(var x in $scope.formData.mgsettlement_companyaccountinfo[i]){
                        $scope.formData["p"+x] =  $scope.formData.mgsettlement_companyaccountinfo[i][x];
                    }
                }
            };
            //creditcardaccountflag     信用卡划帐账户标志，1=公账，2=私账
            if($scope.formData.mgsettlement_masgetsettlementrate[0].creditcardaccountflag==1){  //公账
                $scope.formData.pbankaccountFlag=true;
                $scope.formData.creditcardaccountflag = 1;
            }
            else{
                $scope.formData.bankaccountFlag=true;  //私账
                $scope.formData.creditcardaccountflag = 2;
            }
            if($scope.formData.pbankaccount!=null){
                $scope.formData.pbankaccount2 = $scope.formData.pbankaccount;//赋值确认公账账户
            }
            if($scope.formData.bankaccount!=null){
                $scope.formData.bankaccount2 = $scope.formData.bankaccount;//赋值确认私账账户
            }
            $scope.tableOjb = angular.copy($scope.formData.mgsettlement_masgetsettlementrate[0]); //赋值费率信息
            console.log('$scope.queryData...');
            console.log($scope.queryData);
            //费率通道数据
            $scope.settlementchannel_query();
            //商户签约费率
            $scope.settlementrate_query($scope.tableOjb.agentsettlementchannelid);
        }).error( function(){
            console.log( "error.....");
        });
    };


    //changetoName
    $scope.changetoName=function(flag){
        switch (flag){
            case 1:{
                return "已审核待取号";
                break;
            }
            case 2:{
                return "审核不通过";
                break;
            }
            case 3:{
                return "待审核";
                break;
            }
            case 4:{
                return "已取号";
                break;
            }
            case 5:{
                return "取号失败";
                break;
            }
            default :{
                return "error";
            }
        };
    };

    //切换公司银行账户是否选择标志
    $scope.step2Checkbox=function(){
        $scope.formData.pbankaccountFlag=!$scope.formData.pbankaccountFlag;
        if(!$scope.formData.pbankaccountFlag){
            //creditcardaccountflag     信用卡划帐账户标志，1=公账，2=私账
            $scope.formData.creditcardaccountflag = 2;
        }
    };
    //切换个人账户是否选择标志
    $scope.bankaccountFlag=function(){
        $scope.formData.bankaccountFlag=!$scope.formData.bankaccountFlag;
        if(!$scope.formData.bankaccountFlag){
            //creditcardaccountflag     信用卡划帐账户标志，1=公账，2=私账
            $scope.formData.creditcardaccountflag = 1;
        }
    };

    //获取公司费率通道数据
    $scope.settlementchannel_query=function(){
        var data={pmemberid:$scope.formData.pmemberid,companytypeid:3}; // 获取费率通道数据，商户companytypeid=3；
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/settlementchannel_query.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            if(data.ret==0){
                $scope.agentsettlementchannes=data.data;
            }
        }).error(function(resp){
            console.log("error...");
        });
    };
    //获取公司结算价格数据---根据select 费率通道 onchange事件
    //商户：companytypeid:3
    $scope.settlementrate_query=function(settlementchannelid){
        if(settlementchannelid ==undefined){
            $scope.basesettlementrates.length=0;
            return;
        }
        var data ={companytypeid:3,pmemberid:$scope.formData.pmemberid,settlementchannelid:settlementchannelid};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/settlementrate_query.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            if(data.ret==0){
                $scope.basesettlementrates=data.data;
            }
        }).error(function(resp){
            console.log("error...");
        });
    };

    //提交修改
    $scope.submit_btn = function(){
        $scope.formData.isCommitted1 = true;
        if($scope.formData.pbankaccountFlag){
            $alert({title: '提示：', content: '公账！', placement: 'masget-top',duration:3, type: 'info', show: true});
            return;
        }
        if($scope.formData.bankaccountFlag){
            $alert({title: '提示：', content: '私账！', placement: 'masget-top',duration:3, type: 'info', show: true});
            return;
        }
        if(!$scope.formData.pbankaccountFlag&&!$scope.formData.pbankaccountFlag){
            $alert({title: '提示：', content: '请至少勾选一个账号类型！', placement: 'masget-top',duration:3, type: 'info', show: true});
            return;
        }
        //删除不必要的数据
        delete $scope.formData.message;
        delete $scope.formData.ret;
        delete $scope.formData.mgbase40_companystaff;
        delete $scope.formData.mgbase40_companystations;
        delete $scope.formData.mgbase_companycertificates;
        delete $scope.formData.mgbase_companyinfo;
        delete $scope.formData.mgbase_companyinfoauditlog;
        delete $scope.formData.mgsettlement_agentsettlementrate;
        delete $scope.formData.mgsettlement_companyaccountinfo;
        delete $scope.formData.mgsettlement_companymerchant;
        delete $scope.formData.mgsettlement_masgetsettlementrate;
        delete $scope.formData.mgbase_upsmercharinfo;
        //获取结算通道值
        if($scope.tableOjb.agentsettlementchannelid){
            for(var index =0; index<$scope.agentsettlementchannes.length; index++){
                if($scope.agentsettlementchannes[index].agentsettlementchannelid ==$scope.tableOjb.agentsettlementchannelid){
                    $scope.tableOjb.agentsettlementchannelname = $scope.agentsettlementchannes[index].agentsettlementchannelname;
                    break;
                }
            }
        }
        //获取商户签约费率值
        if($scope.tableOjb.basesettlementrateid){
            for(var index =0; index<$scope.basesettlementrates.length; index++){
                if($scope.basesettlementrates[index].rateid ==$scope.tableOjb.basesettlementrateid){
                    $scope.tableOjb.basesettlementratename = $scope.basesettlementrates[index].ratename;
                    break;
                }
            }
        }
        $scope.tableOjb.creditcardaccountflag  = $scope.formData.creditcardaccountflag;  //信用卡划账标志
        $scope.formData.memberid = $stateParams.companyid;
        $scope.formData.modifyFlag = 0; //"modifyFlag": ,  商户信息修改标志,1=表示申请修改；0=表示修改
        $scope.formData.ratejson = []; //定义提交费率信息数据
        $scope.formData.ratejson.push($scope.tableOjb);
        console.log("$scope.formData...");
        console.log($scope.formData);
        if($scope.formData.pbankaccountFlag){
            $scope.formData.pbankaccountFlag=1;
        }
        else{
            $scope.formData.pbankaccountFlag=0;
        }
        var data ={data:JSON.stringify($scope.formData)};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/memberapply_modify.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log(data);
        }).error(function(resp){
            console.log("error...");
        });
    };
    //初始化函数
    $scope.init=function(){
        //调用获取详情数据
        $scope.memberproperty_query();
    };
    $scope.init();

}])
