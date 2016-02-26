operationsModule.controller('resourceCtrl', ['$scope', '$http', '$state', '$sce','$timeout','utils', 'Upload',function ($scope, $http, $state, $sce,$timeout,utils,Upload) {
    var resourceGridApi;
    $scope.resourceList = {

        data: [],
        useExternalPagination: true,
        useExternalSorting: false,
        enableColumnResizing: true,
        enableRowSelection: true,
        enableSelectAll: true,
        enableColumnMenus: true,
        enableSorting: true,
        selectionRowHeaderWidth: 35,
        paginationPageSizes: [10,25, 50, 75],
        paginationPageSize: 10,
        //点击展开时触发
        expandableRowCallBack: function (sc) {

        },
        onRegisterApi: function (gridApi) {
            resourceGridApi = gridApi;

            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                utils.query('/masgetweb/rboperationsmanager/base/resource.do?type=get'+utils.parseRequestData({
                    resourcename:$scope.resourceSearchInput,
                    pagesize:pageSize,
                    pagenum:newPage
                })).then(function (resp) {
                    console.log(resp.data);
                    $scope.resourceList.data = resp.data;
                });
            });
        },
        paginationPageSize: 10,
        //显示table的th
        columnDefs: [
            { name: '操作',cellTemplate: '<div class="btn-group text-center" style="padding: 2px;" role="group" aria-label="..."><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.editItem(row);">编辑</button><button type="button" class="btn btn-sm btn-default" style="padding:3px 10px;" ng-click="grid.appScope.deleteItem(row);">删除</button></div>' ,cellClass:function(){
                return 'text-center';
            }},
            { name: '资源编码', field: 'resourceid' },
            { name: '资源名称', field: 'resourcename' },
            { name: '资源权限', field: 'authen' },
            { name: '资源提示', field: 'resourcetip' }
        ]
    };

    $scope.selectedIcons = ["r", "c", "u"];
    $scope.icons = [
        {"value": "r", "label": $sce.trustAsHtml("查询")},
        {"value": "c", "label": $sce.trustAsHtml("新增")},
        {"value": "u", "label": $sce.trustAsHtml("修改")},
        {"value": "d", "label": $sce.trustAsHtml("删除")},
        {"value": "a", "label": $sce.trustAsHtml("审核")},
        {"value": "i", "label": $sce.trustAsHtml("导入")},
        {"value": "e", "label": $sce.trustAsHtml("导出")}
    ];

    $scope.addNewResource = function () {
        $scope.usePicBlob = true;
        $modal({callback: function (element, msg) {
            var data = {
                resourceid:0,
                resourcename:$scope.resource.resourcename,
                weburl:$scope.resource.weburl,
                authen:$scope.resource.selectedAuthen.join(","),
                icon:$scope.resource.icon,
                resourcetip:$scope.resource.resourcetip
            };
            utils.query("/masgetweb/rboperationsmanager/base/resource.do?type=add",{method:'post',data:{
                formData:JSON.stringify(data)
            }}).then(function(resp){
                    $alert('新增成功');
            })
        },
            cancelCallback: function () {
            },
            scope: $scope,
            html: true,
            title: '增加资源',
            template: 'modal/modal.edit.tpl.html',
            contentTemplate: 'tpls/resources/resource.edit.html'
        });
    }

    $scope.editItem = function(row){
        $scope.usePicBlob = false;
        $scope.resource = row.entity;
        $scope.resource.selectedAuthen = $scope.resource.authen&&$scope.resource.authen.split(",")
        $modal({callback: function (element, msg) {
            var data = {
                resourceid:$scope.resource.resourceid,
                resourcename:$scope.resource.resourcename,
                weburl:$scope.resource.weburl,
                authen:$scope.resource.selectedAuthen.join(","),
                icon:$scope.resource.icon,
                resourcetip:$scope.resource.resourcetip
            };
            utils.query('/masgetweb/rboperationsmanager/base/resource.do?type=modify',{type:"post",method:'post',data:{formData:JSON.stringify(data)}}).then(function (resp) {
                $alert("修改成功");
            });
        },
            cancelCallback: function () {
            },
            scope: $scope,
            html: true,
            title: '修改资源',
            template: 'modal/modal.edit.tpl.html',
            contentTemplate: 'tpls/resources/resource.edit.html'
        });
    }

    $scope.deleteItem = function(row){
        $modal({callback: function (element, msg) {
            utils.query('/masgetweb/rboperationsmanager/base/resource.do?type=delete'+utils.parseRequestData({
                enforce:0,
                resourceid:row.entity.resourceid
            })).then(function (resp) {
                $alert("删除成功");
            });
            },
            cancelCallback: function () {
            },
            scope: $scope,
            html: true,
            title: '修改资源',
            template: 'modal/modal.confirm.tpl.html',
            content: '确定要删除该资源？--'+row.entity.resourcename
        });
    }

    $scope.queryResource = function(){
        utils.query('/masgetweb/rboperationsmanager/base/resource.do?type=get'+utils.parseRequestData({
            resourcename:$scope.resourceSearchInput,
            pagesize:10,
            pagenum:1
        })).then(function (resp) {
            $scope.resourceList.data = resp.data;
            $scope.resourceList.totalItems = resp.total;
        });
    }

    $scope.fileChange = function(){

        if (!$scope.file||$scope.file.length == 0) {
            return;
        }
        Upload.upload({
            url: '/masgetweb/rboperationsmanager/base/upload.do',
            file: $scope.file
        }).progress(function (evt) {
        }).success(function (data, status, headers, config) {
            $scope.usePicBlob = true;
            $scope.resource.icon = eval("("+eval("("+data+")")+")").data.fileName;
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        })
    };

    $scope.resource = {};
    $scope.usePicBlob =false;

    utils.query('/masgetweb/rboperationsmanager/base/resource.do?type=get'+utils.parseRequestData({
        pagesize:10,
        pagenum:1
    })).then(function (resp) {
        $scope.resourceList.data = resp.data;
        $scope.resourceList.totalItems = resp.total;
    });

    $timeout(function(){
        $("#resourceSearchInput").keyup(function(e){
            e.keyCode == 13&&$scope.queryResource();
        })
    })
}])