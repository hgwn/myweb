angular.module('masgetWebApp.workflow').controller('workflowListCtr',['$scope','$rootScope','$state','i18nService','utils','businessTypes','session',function($scope,$rootScope,$state,i18nService,utils,businessTypes,session){
        $rootScope.businessTypes = [{ordername:"全部"}].concat(businessTypes);
        var columnHead = {
            "business_name": "业务类型",
            "process_name": "流程模板名称",
            "status": "状态",
            "create_time": "创建时间"
        },grid;

        $scope.workFlowList = {
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
                $.extend(gridApi.edit.raise,{
                    beginCellEdit:function(rowEntity,colDef,triggerEvent){
                        console.log('beginCellEdit');
                    },
                    afterCellEdit:function(rowEntity,colDef,newValue,oldValue){
                        console.log('afterCellEdit');
                    },
                    cancelCellEdit:function(rowEntity,colDef){
                        console.log('cancelCellEdit');
                    }
                });
            },
            paginationPageSizes: [5, 10, 25],
            paginationPageSize: 5,
            //显示table的th
            columnDefs: [
                { name: "操作",enableCellEdit:false,cellTemplate: '<div class="text-center"><button class="btn btn-sm btn-primary" style="height: 28px;" ng-click="grid.appScope.editItem(row.entity)";">编&nbsp;&nbsp;辑</button>&nbsp;&nbsp;&nbsp;&nbsp;<button class="btn btn-sm btn-warning" style="height: 28px;" ng-click="grid.appScope.deleteItem(row.entity)";">删&nbsp;&nbsp;除</button></div>'},
                { name: columnHead['process_name'],field:'process_name' },
                { name: columnHead['business_name'],field:'business_name' },
                { name: columnHead['status'],field:'status' },
                { name: columnHead['create_time'],field:'create_time' }
            ]
        };

        $scope.$watch("selectedBusinessType",function(newVal,oldVal){
            utils.query("/jsbweb/workflow.do?type=processsel"+utils.parseRequestData({
                companyid:session.companyid,
                businessid:newVal
            })).then(function(resp){
                if(resp.data === "") {
                    $scope.workFlowList.data = [];
                    return;
                }
                $scope.workFlowList.data= resp.data.rows;
            });

            if(typeof newVal === "undefined") return;
            utils.query("/jsbweb/commonUtils.do?type=orderState"+utils.parseRequestData({
                ordertypeid:newVal
            })).then(function(resp){
                console.log(resp);
                $scope.status = resp.data.rows;
            });
        });

        $scope.add = function(){
            $state.go('home.workflow.edit');
            $state.broadCast = false;
        }

        $scope.editItem = function(item){
              utils.query("/jsbweb/workflow.do?type=userprocessnodes&user_process_id="+item.id).then(function(resp){
                    $state.go("home.workflow.edit");
                    $state.broadCast = {
                        processInfo : item,
                        processNodes:resp.data,
                        operationType:"edit"
                    };
              })
        };

        $scope.deleteItem = function(item){
            utils.query("/jsbweb/workflow.do?type=delete&user_process_id="+item.id).then(function(resp){
                $scope.workFlowList.data = utils.removeFromArrayByKeyValue($scope.workFlowList.data,'id',item.id);
            });
        }

        $scope.delSelected = function(){
            $.each(grid.selection.getSelectedRows(),function(key,item){
                $scope.deleteItem(item);
            })
        }
    }]
)