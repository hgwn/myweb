/**
 * Created by lhw on 2015/11/23.
 */
/*单个商户/服务商信息查看*/
operationsModule.controller("memberapply_queryCtr",["$http","$scope","$state","$stateParams",function($http,$scope,$state,$stateParams){

    //定义数组数据
    $scope.stepTabs=[
        {index:1,title:"基本信息",url:"../rboperationsmanager/tpls/memberapply/tabContent-1.html",isActive:true},
        {index:2,title:"账号信息",url:"../rboperationsmanager/tpls/memberapply/tabContent-2.html"},
        {index:3,title:"费率信息",url:"../rboperationsmanager/tpls/memberapply/tabContent-3.html"},
        {index:4,title:"审核情况",url:"../rboperationsmanager/tpls/memberapply/tabContent-4.html"}
    ]
    $scope.currentTab="../rboperationsmanager/tpls/memberapply/tabContent-1.html";

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
    //memberproperty_query
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
    //初始化函数
    $scope.init=function(){
        $scope.memberproperty_query();
    };
    //调用初始化函数
    $scope.init();
}])

