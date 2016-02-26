/**
 * Created by lhw on 2015/11/20.
 */
/*商户/服务商信息查询*/
operationsModule.controller('auditcompany_queryCtr',['$http','$scope','$rootScope','$timeout','$alert','$state',function($http,$scope,$rootScope,$timeout,$alert,$state){
    //定义表单查询对象
    $scope.queryDataForm={pagesize:10,pagenum:1,auditstate:0,agentflag:0}
    //设置gridOptions表格参数
    $scope.gridOptions={
        paginationPageSizes: [10, 20, 50, 100],
        paginationPageSize: 10,
        useExternalPagination: true,
        useExternalSorting: true,
        enableSorting : true,
        enableColumnMenus: false,
        enableGridMenu: true,
        columnDefs:[
            { name:'序号',field:'id',type:'text',enableHiding: false,  enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
            { name: 'action',displayName: '操作',width:150,enableSorting: false,enableHiding: false,enableColumnResizing:false,type:'text',
                cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a class="tunnel-grid-action" ui-sref="memberapply_query({companyid:row.entity.companyid})"  title="详细">详细</a>' +
                '<a class="tunnel-grid-action" ui-sref="memberapply_audit({companyid:row.entity.companyid})" title="审核" ng-if="grid.appScope.getauditflag(row.entity)">审核</a>'+
                '<a class="tunnel-grid-action" title="申请修改" ng-if="grid.appScope.getrpmodifyflag(row.entity)">申请修改</a>'+
                '<a class="tunnel-grid-action" title="修改" ui-sref="modifyinfos3({companyid:row.entity.companyid})"  ng-if="grid.appScope.getmodifyflag3(row.entity)">修改3</a>'+
                '<a class="tunnel-grid-action" title="修改" ui-sref="modifyinfos5({companyid:row.entity.companyid})"  ng-if="grid.appScope.getmodifyflag5(row.entity)">修改5</a>'+
                '</div>'},
            { name: '提交时间',field:'createtime',width:166,type:'text'},
            { name: '商户编号',field:'companyid',width:120,type:'text'},
            { name:'商户名称',field:'companyname',width:200,type:'text'},
            { name:'负责人',field:'companyleander',width:80,type:'text'},
            { name:'负责人电话',field:'companyleanderphone',width:120,type:'text'},
            { name:'状态',field:'auditflag',width:120,type:'text',cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getState(row.entity.auditflag)}}</div>'},
            { name:'地址',field:'address',width:200,type:'text'},
            { name:'创建时间',field:'createtime',width:166,type:'text'},
            { name:'销售',field:'saler',width:120,type:'text'},
           // { name:'服务商ID',field:'pcompanyid',width:120,type:'text'},
            { name:'所属服务商',field:'pcompanyname',width:160,type:'text'},
           // { name:'审核公司ID',field:'currentauditid',width:120,type:'text'},
            { name:'审核公司',field:'currentauditname',width:160,type:'text'}
        ],
        onRegisterApi:function(gridApi){
            $scope.gridApi = gridApi;
           // console.log("onRegisterApi00...");
           // console.log($scope.gridApi);
            //分页
            $scope.gridApi.pagination.on.paginationChanged($scope,function(newPage, pageSize){
                //console.log($scope);
                //console.log(newPage+":"+pageSize);
                //调用分页函数
                $scope.getpage(newPage,pageSize);
            });
        }
    };

    //分页函数
    $scope.getpage=function(pagenum,pagesize){
        $scope.queryDataForm.pagenum = pagenum;
        $scope.queryDataForm.pagesize = pagesize;
        //调用查询函数
        $scope.query();
    }

    //查询
    $scope.query=function(){
        if($scope.queryDataForm.acquirebankid){
            for(var i=0; i< $scope.acquirebanks.length; i++){
                if($scope.queryDataForm.acquirebankid == $scope.acquirebanks[i].acquirebankid ){
                    $scope.queryDataForm.i_acqinscode = $scope.acquirebanks[i].acquirebank;
                    break;
                }
            }
        }
        else{
            $scope.queryDataForm.i_acqinscode="";
        }
        var starttime = $scope.queryDataForm.begintime;
        var endtime =$scope.queryDataForm.endtime;
        if(starttime !=null&&endtime!=null){
            if( $scope.CompareDateTime(starttime,endtime)){
                $alert({title: '提示：', content: '开始时间不能大于结束时间', placement: 'masget-top',duration:3, type: 'info', show: true});
                return;
            }
        }
        console.log($scope.queryDataForm);
        $http({
            method : 'POST',
            url : '/masgetweb/rboperationsmanager/com/auditcompany_query.do',
            data : $.param($scope.queryDataForm),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log("查询..........");
            console.log(data);
            if(data.ret==0){
                $scope.gridOptions.data=data.data;
                $scope.gridOptions.totalItems=data.total;
            }
            if(data.ret==1000){
                //$alert({title: '提示：', content: '请先登陆', placement: 'masget-top',duration:5, type: 'info', show: true});
            }
            if(data.ret==1){
                $scope.gridOptions.data=[];
                $scope.gridOptions.totalItems=0;
                $alert({title: '提示：', content: '查无数据', placement: 'masget-top',duration:5, type: 'info', show: true});
            }


        }).error(function(resp){
            console.log("error...");
        });
    };

    //getState
    $scope.getState=function(state){
        switch(state){
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
                return ""
            };
        }
    };
    //查询所有收单行数据
    $scope.acquirerinfo_get = function(){
        $http.get("/masgetweb/rboperationsmanager/com/acquirerinfo_get.do")
            .then(function(data){
                $scope.acquirebanks = data.data.data;
            });
    };
    //日期控件2
    $scope.addloadData = function(){
        $("#begintime,#endtime").datetimepicker({
            language: 'zh-CN',
            autoclose: true,
            todayBtn: true,
            pickerPosition: "bottom-left",
            todayHighlight: true,
            startView: 2,
            minView: 0,
            minuteStep:1,
            format: 'yyyy-mm-dd hh:ii:ss'
        });
    };

    $scope.CompareDateTime = function(startTime,endTime){
        return ((new Date(startTime.replace(/-/g,"\/"))) > (new Date(endTime.replace(/-/g,"\/"))));
    };

    //审核链接：（auditflag=3 or auditflag=2） and currentauditid=登录者公司ID
    $scope.getauditflag=function(row){
        if((row.auditflag==2 || row.auditflag==3) && row.currentauditid==$rootScope.getSession.companyid){
            return true;
        }
        return false;
    };
    //申请修改：auditflag=1 and pcompanyid=登录者公司ID
    $scope.getrpmodifyflag=function(row){
        if(row.auditflag==1 && row.pcompanyid==$rootScope.getSession.companyid){
            return true;
        }
        return false;
    };
    //修改：（auditflag=2 or auditflag=3） and pcompanyid=登录者公司ID
    /*$scope.getmodifyflag=function(row){
        if((row.auditflag==2||row.auditflag==3) && row.pcompanyid==$rootScope.getSession.companyid){
            return true;
        }
        else{
            return false;
        }
    }*/

    //修改：（auditflag=2 or auditflag=3） and pcompanyid=登录者公司ID
    //companytype==3 修改商户
    $scope.getmodifyflag3=function(row){
        if((row.auditflag==2||row.auditflag==3) && row.pcompanyid==$rootScope.getSession.companyid && row.companytype==3){
            return true;
        }
        else{
            return false;
        }
    }

    //修改：（auditflag=2 or auditflag=3） and pcompanyid=登录者公司ID
    //companytype==5 修改服务商
    $scope.getmodifyflag5=function(row){
        if((row.auditflag==2||row.auditflag==3) && row.pcompanyid==$rootScope.getSession.companyid && row.companytype==5){
            return true;
        }
        else{
            return false;
        }
    }

    //modify_sref
    $scope.modify_sref=function(row){
        var companytype = row.companytype;
        if(companytype==3){
           return "modifyinfos3({companyid:row.companyid})";
        }
        else{
           return "modifyinfos5({companyid:row.companyid})";
        }
    };
   //获取session数据
    $http.get("/masgetweb/base/getSession.do").success(function(data){
        console.log("getSession...");
        $rootScope.getSession=data;
        console.log($rootScope.getSession);
    });
    //初始化函数
    $scope.init=function(){
        $scope.acquirerinfo_get();
        //调用查询
        $scope.query();
    };
    //调用初始化函数
    $scope.init();
}])