/**
 * Created by Administrator on 2015/11/12.
 */
operationsModule.controller("osroleresource_modifyCtr",["$scope","$http","$modal","$sce","i18nService","operationsmanagerService","Upload","$alert",function($scope,$http,$modal,$sce,i18nService,operationsmanagerService,Upload,$alert){
    //定义查询表单对象
    $scope.queryDataForm={pagenum:1,pagesize:10};
    //定义提交表单对象
    $scope.editFormData = {};
   //定义权限数据

    $scope.icons = [
        {"value": "r", "label": $sce.trustAsHtml("查询")},   //Attempting to use an unsafe value in a safe context.
        {"value": "c", "label": $sce.trustAsHtml("新增")},
        {"value": "u", "label": $sce.trustAsHtml("修改")},
        {"value": "d", "label": $sce.trustAsHtml("删除")},
        {"value": "a", "label": $sce.trustAsHtml("审核")},
        {"value": "i", "label": $sce.trustAsHtml("导入")},
        {"value": "e", "label": $sce.trustAsHtml("导出")}
    ];



    //ui-grid 分页汉化
    i18nService.setCurrentLang('zh-cn');
    //设置gridOptions表格参数
    $scope.gridOptions={
        paginationPageSizes: [10, 20, 50, 100],
        paginationPageSize: 10,
        useExternalPagination: true,
        useExternalSorting: true,
        //enableSorting : true,
        enableColumnMenus: false,
        //enableGridMenu: true,
        columnDefs:[
            { name:'序号',field:'id',type:'text',enableHiding: false,  enableSorting: false, enableColumnResizing:false,  width:'55', cellTemplate: '<div class="ui-grid-cell-contents" style="text-align:center;">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'},
            { name: 'action',displayName: '操作',width:80,enableSorting: false,enableHiding: false,enableColumnResizing:false,type:'text',
                cellTemplate: '<div class="ui-grid-cell-contents">' +
                '<a class="tunnel-grid-action" ng-click="grid.appScope.editRow(row.entity)" title="编辑"><span class=" glyphicon glyphicon-pencil green"></span></a>' +
                '</div>'},
            { name: '菜单名称',field:'resourcename',type:'text'},
            { name: '权限',field:'tempauthen',type:'text'},
            { name:'创建时间',field:'createdtime',width:150,type:'text'}
        ],
        onRegisterApi:function(gridApi){
            $scope.gridApi = gridApi;
            console.log("onRegisterApi00...");
            console.log($scope.gridApi);
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
        $scope.querySource();
    }

    //编辑
    $scope.editRow = function(item){
        console.log(item);
        $scope.editFormData = angular.copy(item);
        if($scope.editFormData.authen){
            $scope.editFormData.authen=$scope.editFormData.authen.split(",");
        }else{
            $scope.editFormData.authen=[];
        }
        if($scope.editFormData.icon==null ||$scope.editFormData.icon==""){
            $scope.file = false;
        }
        else{
            $scope.file = true;
        }
        console.log($scope.editFormData);
        $("#editModal").modal("show");
       /* $modal({
            html:true,
            scope:$scope,
            title:"编辑菜单",
            //template:'tpls/companyinfo/companyInfo.modal.tpl.html',
            contentTemplate: 'tpls/osroleresource/osroleresource.edit.html',
            callback:function(){
            }
        })*/
        };
    //提交
    $scope.onClickToSave= function () {
        console.log("edit....");
        console.log($scope.editFormData);
        var tempRow = angular.copy($scope.editFormData);
        tempRow.authen = tempRow.authen.join(",");
        var data ={data:JSON.stringify(tempRow)};
        console.log(data);
        $http({
            method : 'POST',
            url : '/masgetweb/rboperationsmanager/com/osroleresource_modify.do',
            data : $.param(data),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log(data);
            if(data.ret==0){
                $.jBox.tip('添加成功！', 'success');
                $("#editModal").modal("hide");
                $scope.querySource();
            }
        }).error(function(resp){
            console.log("error...");
        });
    }

    //图标上传
    $scope.upload = function (files) {
        //console.log(files);
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: '/masgetweb/base/fileUpload.do',
                    fields: {'username': $scope.username},
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log(data);
                    $scope.editFormData.icon = data.data.file;  //将图片url赋值
                    $scope.file = true;   //设置删除按钮 显示 ，默认隐藏
                }).error(function(){
                    console.log("error");
                });
            }
        }
    };

    //删除图标
    $scope.deletePic=function(img){
        console.log(img);
        $scope.editFormData.icon="";
        $scope.file = false;
    }


    //获取系统环境数据
    $scope.getosenvinrmentData=function(){
        var url =operationsmanagerService.getosenvinrmentUrl();
        operationsmanagerService.httpGet(url,function(data){
            if(data.ret==0){
                $scope.osenvinrmentFormData=data.data.rows;
            }
        })
    };

    //获取公司类型数据
    $scope.getcompanytypetData=function(){
        var url =operationsmanagerService.getcompanytypeUrl();
        operationsmanagerService.httpGet(url,function(data){
            if(data.ret==0){
                $scope.companytypeFormData=data.data.rows;
            }
            else{
                console.log(data);
            }
        })
    };

    //获取角色类型数据
    $scope.getroletype=function(){
        var url = operationsmanagerService.getroletypeUrl();
        operationsmanagerService.httpGet(url,function(data){
            console.log(data);
            if(data.ret==0){
                $scope.roletypeFormData = data.data.rows;
            }
        });
    }

    //查询
    $scope.querySource=function(){
        console.log($scope.queryDataForm);
        $http({
            method : 'POST',
            url : '/masgetweb/rboperationsmanager/com/osroleresourcelist_query.do',
            data : $.param($scope.queryDataForm),
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded'
            }
        }).success(function(data){
            console.log(data);
            if(data.ret==0){
                $scope.gridOptions.data=data.data.rows;
                $scope.gridOptions.totalItems=data.data.total;
                for(var i=0;i<$scope.gridOptions.data.length; i++){
                    var temprow =  $scope.gridOptions.data[i];
                    if(temprow.authen){
                        temprow.tempauthen = temprow.authen.split(",");
                        for(var j=0; j<temprow.tempauthen.length; j++){
                            if(temprow.tempauthen[j]=="r"){
                                temprow.tempauthen[j] ="查询";
                            }
                            if(temprow.tempauthen[j]=="c"){
                                temprow.tempauthen[j] ="新增";
                            }
                            if(temprow.tempauthen[j]=="u"){
                                temprow.tempauthen[j] ="修改";
                            }
                            if(temprow.tempauthen[j]=="d"){
                                temprow.tempauthen[j] ="删除";
                            }
                            if(temprow.tempauthen[j]=="a"){
                                temprow.tempauthen[j] ="审核";
                            }
                            if(temprow.tempauthen[j]=="i"){
                                temprow.tempauthen[j] ="导入";
                            }
                            if(temprow.tempauthen[j]=="e"){
                                temprow.tempauthen[j] ="导出";
                            }
                        }
                        temprow.tempauthen = temprow.tempauthen.join(",");
                    }
                }
            }
        }).error(function(resp){
            console.log("error...");
        });
    };
    //初始化函数
    $scope.init=function(){
        //获取系统环境数据
        $scope.getosenvinrmentData();
        //获取公司类型数据
        $scope.getcompanytypetData();
        //获取角色类型数据
        $scope.getroletype();
        //查询
        $scope.querySource();
    };
    //调用初始化函数
    $scope.init();
}])
//指令监听图标上传
.directive('onFinishRenderFilters', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watch('files', function () {
                    scope.upload(scope.files);
                });
            }
        };
    })