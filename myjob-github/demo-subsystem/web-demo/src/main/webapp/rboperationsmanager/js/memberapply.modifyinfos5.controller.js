/**
 * Created by lhw on 2015/11/25.
 */
/*服务商修改*/
operationsModule.controller("modifyinfos5Ctrl",["$http","$scope","$state","$stateParams","$modal","$alert","operationsmanagerService",function($http,$scope,$state,$stateParams,$modal,$alert,operationsmanagerService){
    //定义提交数据
    $scope.formData= {isCommit:false,companyid:$stateParams.companyid};
    //定义数组数据
    $scope.stepTabs=[
        {index:1,title:"基本信息",url:"../rboperationsmanager/tpls/memberapply/memberproperty.audit.info.html",isActive:true},
        {index:2,title:"审核情况",url:"../rboperationsmanager/tpls/memberapply/tabContent-4.html"}
    ]
    $scope.currentTab="../rboperationsmanager/tpls/memberapply/memberproperty.audit.info.html";

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
        console.log("$stateParams....");
        console.log($stateParams);
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
            console.log('$scope.queryData...');
            console.log($scope.queryData);

            //调用收单行
            $scope.acquirerinfochannel_query();
        }).error( function(){
            console.log( "error.....");
        });
    };

    $scope.memberproperty_query();
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

    //获取session数据
    $http.get("/masgetweb/base/getSession.do").success(function(data){
        console.log("getSession...");
        $scope.getSessionData = data;
        console.log($scope.getSessionData);
        //如果登录者公司ID为10101020(荣邦科技广州分公司)、
        // 10101010(荣邦科技北京分公司)、
        // 10101021(荣邦科技上海分公司)、
        // 10101028(荣邦科技成都分公司)这四个ID中的一个，则表示为最终的审核。
        if(data.companyid==10101020 ||data.companyid==10101010||data.companyid==10101021||data.companyid==10101028){
            $scope.endauditFlag = true;
        }
    });

    //获取取号收单行
    $scope.acquirerinfochannel_query=function(){
        var data={provinceid:$scope.queryData.provinceid,cityid:$scope.queryData.cityid,areaid:$scope.queryData.areaid};
        $http({
            method : 'POST',
            url :"/masgetweb/rboperationsmanager/com/acquirerinfochannel_query.do" ,
            data :$.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success( function(data) {
            if(data.ret==0){
                $scope.acquirerinfochannels = data.data;
                console.log(data);
            }
        }).error( function(){
            console.log( "error.....");
        });
    };
    //提交审核
    $scope.audit=function(auditstate,invalid){
        $scope.formData.isCommit = true;
        //验证不通过则不执行
        if(invalid){
            $scope.auditCommitFlg = false;
            return;
        }
        $scope.formData.auditstate = auditstate;
        $scope.formData.companyname = $scope.queryData.companyname;
        for(var i=0; i<$scope.acquirerinfochannels.length; i++){
            if($scope.acquirerinfochannels[i].acquirebankid == $scope.formData.acquirebankid){
                $scope.formData.acquirebank = $scope.acquirerinfochannels[i].acquirebank;
                $scope.formData.transauditflag = $scope.acquirerinfochannels[i].transauditflag;
                break;
            }
        };
        //审核状态 1审核通过 2审核不通过
        if(auditstate==1){
            var modalTitle = "审核通过";
        }
        else{
            var modalTitle = "审核不通过";
        }
        var data = {data:JSON.stringify($scope.formData)};
        $modal({html: true, title: "提示", content: "确定"+modalTitle+"吗？", template: 'modal/modal.confirm.tpl.html', animation: 'am-fade-and-scale', callback: function () {
            //console.log("ok");
            $http({
                method : 'POST',
                url :"/masgetweb/rboperationsmanager/com/memberproperty_audit.do" ,
                data :$.param(data),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                }
            }).success(function(data){
                console.log(data);
                if(data.ret==0){
                    $alert({title: '提示：', content: '审核成功', placement: 'masget-top',duration:5, type: 'info', show: true});
                    $scope.auditCommitFlg = true;
                }
            }).error(function(){
                console.log("error..");
            });
            ;
        }});
    };
}])
