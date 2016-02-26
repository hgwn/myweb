angular.module('masgetWebApp.scheduleManage').controller('scheduleManageListCtr',['$scope','$rootScope','$state','i18nService','utils',function($scope,$rootScope,$state,i18nService,utils){
        i18nService.setCurrentLang("zh-cn");
        var grid,type = "add";

        $scope.scheduleManageList = {
            useExternalPagination: false,
            useExternalSorting: false,
            enableColumnResizing:true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableColumnMenus: true,
            enableSorting:true,
            selectionRowHeaderWidth: 35,
            data:[],
            //点击展开时触发
            expandableRowCallBack:function(sc){
            },
            onRegisterApi:function(gridApi){
                grid = gridApi;
            },
            paginationPageSizes: [5, 10, 25],
            paginationPageSize: 5,
            //显示table的th
            columnDefs: [
                { name: "操作",minWidth:200,enableCellEdit:false,cellTemplate: '<div class="text-center"><button class="btn btn-sm btn-primary" style="height: 28px;" ng-click="grid.appScope.startJob(row.entity)";">启用</button>&nbsp;<button class="btn btn-sm btn-primary" style="height: 28px;" ng-click="grid.appScope.stopJob(row.entity)";">停用</button>&nbsp;<button class="btn btn-sm btn-primary" style="height: 28px;" ng-click="grid.appScope.pauseJob(row.entity)";">暂停</button>&nbsp;<button class="btn btn-sm btn-primary" style="height: 28px;" ng-click="grid.appScope.resumeJob(row.entity)";">恢复</button></div>'},
                { name: "任务名称",field:'jobName' },
                { name: "任务key",field:'jobId' },
                { name: "启用状态",field:'getJobStatus()'},
                { name: "执行时间",field:'cronExpression' },
                { name: "功能描述",field:'desc' },
                { name: "接口类型",field:'serviceType' },
                { name: "接口名称",field:'serviceName' },
                { name: "接口url",field:'serviceUrl' },
                { name: "参数",field:'paramJson' },
                { name: "下次执行时间",field:'nextExecuteStartTime' }
            ]
        };

        utils.query("/jsbweb/jobSchedule.do?type=list").then(function(resp){
            $.each(resp.data,function(key,item){
                item.getJobStatus = function(){
                    var status=''
                    $.each($scope.jobStatusOptions,function(key,innerItem){
                        if(item.jobStatus == innerItem.id){
                            status = innerItem.text;
                            return false;
                        }
                    });
                    return status;
                }
            })
            $scope.scheduleManageList.data = resp.data;
        });

        $scope.scheduleObj = {
            job:{jobStatus:1,serviceType:1}
        };

        $scope.edit = function(){
            $modal({
                callback: function (element, msg) {
                    utils.query("/jsbweb/jobSchedule.do?type="+(type=='add'?'createnew':'update'),{method:"post",data:{
                        data:JSON.stringify($scope.scheduleObj)
                    }}).then(function(resp){
                        $alert("修改成功");
                    });
                },
                cancelCallback: function () {

                },
                scope: $scope,
                html: true,
                title:type=='add'?'新增计划任务':'修改计划任务',
                contentTemplate: 'base/schedulemanage/tpls/edit.tpl.html'
            });
        };

        $scope.add = function(){
            type = 'add';
            $scope.scheduleObj = {
                job:{jobStatus:1,serviceType:1}
            };
            $scope.edit();
        }

        $scope.modify = function(){
            var rows = grid.selection.getSelectedRows();
            if(rows.length == 0){
                $alert("请选择一条记录");
                return;
            }

            utils.query("/jsbweb/jobSchedule.do?type=detail&jobId="+rows[0].jobId).then(function(resp){
                $scope.scheduleObj.job = resp.data;
                $scope.scheduleObj.tel_phone = resp.data.failSendUsers[0].tel_phone;
                $scope.scheduleObj.email = resp.data.failSendUsers[0 ].email;
                type = 'edit';
                $scope.edit();
            });


        }

        $scope.editItem = function(item){

        };

        $scope.deleteItem = function(item){
            utils.query("/jsbweb/scheduleManage.do?type=delete&user_process_id="+item.id).then(function(resp){
                $scope.scheduleManageList.data = utils.removeFromArrayByKeyValue($scope.scheduleManageList.data,'id',item.id);
            });
        }

        $scope.delSelected = function(){
            $.each(grid.selection.getSelectedRows(),function(key,item){
                $scope.deleteItem(item);
            })
        }

        $scope.toScheduleManageList = function(){
            $state.go('home.scheduleManage.list');
        }

        $scope.sharedDate = "2015-11-10T01:00:05.352Z";

        $scope.serviceTypes = [{
            id:1,text:'内部API'
        },{
            id:2,text:'第三方接口'
        }];

        $scope.jobStatusOptions = [{
            id:1,text:'已启用'
        },{
            id:2,text:'已停止'
        },{
            id:3,text:'已暂停'
        },{
            id:4,text:'已恢复'
        }];

        $scope.startJob = function(job){
            utils.query("/jsbweb/jobSchedule.do?type=use&jobId="+job.jobId).then(function(resp){
                    job.jobStatus = 1;
                    $alert("该任务已启用");
            });

        };

        $scope.stopJob = function(job){
            utils.query("/jsbweb/jobSchedule.do?type=stop&jobId="+job.jobId).then(function(resp){
                job.jobStatus = 2;
                $alert("该任务已停止");
            });
        };

        $scope.pauseJob = function(job){
            utils.query("/jsbweb/jobSchedule.do?type=pause&jobId="+job.jobId).then(function(resp){
                job.jobStatus = 3;
                $alert("该任务已暂停");
            });
        };

        $scope.resumeJob = function(job){
            utils.query("/jsbweb/jobSchedule.do?type=resume&jobId="+job.jobId).then(function(resp){
                job.jobStatus = 4;
                $alert("该任务已恢复");
            });
        };
    }]
)