angular.module('masgetWebApp.leagueapply')
    .filter('mapGender',function() {
        var genderHash = {
            1: 'male',
            2: 'female'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return genderHash[input];
            }
        };
    })
    .controller('auditCtr',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','session','platformData','sceneData',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout,session,platformData,sceneData) {
            $scope.sceneData = sceneData;
            $scope.auditFlag = true;
            $scope.platFlag = false;
            //判断是否平台管理员
            angular.forEach(platformData,function(item,key){
                if(session.companyid == item.platformcompanyid && session.stationid == item.platformstationid){
                    $scope.platFlag = true;
                }
            })

            //时间戳的计算
            var dayTime=60*60*24*1000*1;
            var beforeTime=60*60*24*1000*30;
            var backTime=new Date().getTime()+dayTime;
            var backbeTime = new Date().getTime()-beforeTime;

            $scope.leagueapplyList = {
                screatedtime:new Date(backbeTime).format("yyyy-MM-dd"),
                ecreatedtime:new Date(backTime).format("yyyy-MM-dd"),
                state:"",
                addressgroupid:'',
                pageSize:10,
                pageNum:1
            }

            $scope.Check = function(){
                var obj = {};
                obj.pagenum = $scope.leagueapplyList.pageNum;
                obj.pagesize = $scope.leagueapplyList.pageSize;
                if($scope.leagueapplyList.state != null && $scope.leagueapplyList.state != ""){
                    obj.state = $scope.leagueapplyList.state;
                }
                if($scope.leagueapplyList.screatedtime != null ){
                    obj.screatedtime = $scope.leagueapplyList.screatedtime;
                }else{
                    obj.screatedtime = new Date(backbeTime).format("yyyy-MM-dd");
                }
                if($scope.leagueapplyList.ecreatedtime != null ){
                    obj.ecreatedtime = $scope.leagueapplyList.ecreatedtime;
                }else{
                    obj.ecreatedtime = new Date(backTime).format("yyyy-MM-dd");
                }
                var data ={};
                data.data = JSON.stringify(obj);
                var url = "/jsbweb/base/leagueapply/get.do";
                utils.query(url,{method:'POST',data:data}).then(function(resp){
                    if(resp.ret == 0){
                        $scope.leagueapplyData = resp.data.rows;
                        $scope.total = resp.data.total;
                        angular.forEach(resp.data.rows,function(item,key){
                            angular.forEach($scope.sceneData,function(val,index){
                                if(item.addressgroupid == val.addressgroupid){
                                    item.addressgroupname = val.addressgroupname;
                                }
                            })
                            item.platFlag = $scope.platFlag;
                        })
                        $scope.selected = [];
                        //$scope.gridOptions.data = resp.data.rows;
                        //$scope.gridOptions.totalItems = resp.data.total;
                    }
                });
            }
            $scope.Check();

            //$scope.gridOptions = {
            //    //显示table的th
            //    columnDefs: [
            //        {name:'操作', field:'',enableCellEdit: false,
            //            cellTemplate: '<div class="ui-grid-cell-contents">' +
            //            '<span ng-if="row.entity.state == 1&&row.entity.platFlag">' +
            //                '<span ng-if="!row.entity.hasAction">' +
            //                    '<a href="" ng-click="grid.appScope.auditAgree(row.entity)">通过</a>&nbsp;&nbsp;' +
            //                    '<a href="" ng-click="grid.appScope.auditDelete(row.entity)">不通过</a>' +
            //                '</span>' +
            //                '<span ng-if="row.entity.hasAction" >无操作</span>' +
            //            '</span>' +
            //            '<span ng-if="row.entity.state != 1&&row.entity.platFlag">无操作</span>' +
            //            '</div>'
            //        },
            //        {
            //            name:'人脉分组',
            //            field:'addressgroupname',
            //            editType: 'dropdown',
            //            enableCellEdit: true,
            //            editableCellTemplate: 'ui-grid/dropdownEditor',
            //            editDropdownOptionsArray: $scope.sceneData,
            //            editDropdownIdLabel: 'addressgroupname',
            //            editDropdownValueLabel: 'addressgroupname',
            //            cellTemplate: '<div class="ui-grid-cell-contents">' +
            //            '<span ng-if="row.entity.state == 2 && !row.entity.hasSeFlag" >{{row.entity.addressgroupname}}</span>' +
            //            '<span ng-if="row.entity.state == 3 || row.entity.state == 4 || row.entity.hasDeau" >无分组信息</span>' +
            //            '</div>'
            //        },
            //        { name: '平台名称',field:'platformname',enableCellEdit: false },
            //        { name: '申请公司',field:'appcompanyname',enableCellEdit: false},
            //        { name: '申请站点',field:'appstationname',enableCellEdit: false},
            //        { name: '申请人',field:'appstaffname',enableCellEdit: false},
            //        { name: '申请状态',field:'statename',enableCellEdit: false},
            //        { name: '审核人',field:'auditorname',enableCellEdit: false},
            //        { name: '审核时间',field:'audittime',enableCellEdit: false},
            //        { name: '备注',field:'remark',enableCellEdit: false}
            //
            //    ],
            //    paginationPageSizes: [5, 10, 15,20,25,50,100],
            //    paginationPageSize: 15,
            //    selectionRowHeaderWidth: 35,
            //    useExternalPagination: true,
            //    enableGridMenu: true,
            //    enableCellEditOnFocus: true,
            //    enableColumnMenus: false,
            //    onRegisterApi: function(gridApi){
            //        $scope.gridApi = gridApi;
            //        $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            //            if($scope.getPage) {
            //                $scope.getPage(newPage, pageSize);
            //            }
            //        });
            //    }
            //};
            //
            //$scope.getPage = function(pagenum, pagesize, orders,orderkey) {
            //    $scope.leagueapplyList.pageNum = pagenum
            //    $scope.leagueapplyList.pageSize = pagesize;
            //    $scope.Check();
            //};

            //审核通过
            $scope.auditAdd = function(){
                $scope.hasLeagueapply = true;
                $scope.iconFlag = 'add';
                $scope.context = "正在审核中...";
                var objAdd = {};
                $scope.auditArray = new Array();
                angular.forEach($scope.leagueapplyData,function(item,key){
                    if(item.selected){
                        var obj ={};
                        if(item.addressgroupid == undefined && item.stateData != 3 || item.addressgroupid == '' && item.stateData != 3){
                            $scope.hasLeagueapply = false;
                        }
                        obj.leagueapplyid = item.leagueapplyid;
                        obj.state = item.stateData;
                        obj.addressgroupid = item.addressgroupid;
                        $scope.auditArray.push(obj);
                    }
                })
                if($scope.auditArray.length != 0 && $scope.hasLeagueapply){
                    objAdd.leagueapply = $scope.auditArray;
                    var data ={};
                    data.data = JSON.stringify(objAdd);
                    var url = "/jsbweb/base/leagueapply/audit.do";
                    utils.query(url,{method:'POST',data:data}).then(function(resp){
                        if(resp.ret == 0){
                            $alert({title: '提示：', content: '审核成功', placement: 'masget-top',duration:1,type: 'info', show: true});
                            $scope.iconFlag = '';
                            $scope.Check();
                            $scope.selected = [];
                        }
                    });
                }else{
                    $scope.iconFlag = '';
                    $alert({title: '提示：', content: '请选择人脉分组', placement: 'masget-top',duration:2,type: 'info', show: true});
                }
            }

            //通过
            $scope.auditAgree = function(item){
                item.hasAction = true;
                item.hasSeFlag = true;
                item.hasDeau = false;
                item.stateData = 2;
                $scope.isSelected(item.leagueapplyid);
                $scope.updateSelection(true, item.leagueapplyid);
            }

            //不通过
            $scope.auditDelete = function(item){
                item.hasAction = true;
                item.hasSeFlag = false;
                item.hasDeau = true;
                item.stateData = 3;
                $scope.isSelected(item.leagueapplyid);
                $scope.updateSelection(true, item.leagueapplyid);
            }

            //全选、反选开始
            $scope.selected = [];
            var updateSelected = function (action, leagueapplyid) {
                if (action == 'add' & $scope.selected.indexOf(leagueapplyid) == -1) $scope.selected.push(leagueapplyid);
                if (action == 'remove' && $scope.selected.indexOf(leagueapplyid) != -1) $scope.selected.splice($scope.selected.indexOf(leagueapplyid), 1);
            }

            $scope.updateSelection = function ($event, leagueapplyid) {
                var action = ($event ? 'add' : 'remove');
                if($scope.leagueapplyData!=null){
                    for (var i = 0; i < $scope.leagueapplyData.length; i++) {
                        var entity = $scope.leagueapplyData[i];
                        if(entity.selected){
                            if(entity.leagueapplyid == leagueapplyid&&!$event){
                                entity.selected = false;
                            }
                        }else{
                            if(entity.leagueapplyid == leagueapplyid&&$event){
                                entity.selected = true;
                            }else{
                                entity.selected = false;
                            }
                        }
                    }
                }
                updateSelected(action, leagueapplyid);
            };

            $scope.selectAll = function ($event) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                for (var i = 0; i < $scope.leagueapplyData.length; i++) {
                    var entity = $scope.leagueapplyData[i];
                    if(checkbox.checked == true){
                        entity.selected = true;
                    }else{
                        entity.selected = false;
                    }
                    updateSelected(action, entity.leagueapplyid);
                }
            };

            $scope.getSelectedClass = function (entity) {
                return $scope.isSelected(entity.leagueapplyid) ? 'selected' : '';
            };

            $scope.isSelected = function (leagueapplyid) {
                return $scope.selected.indexOf(leagueapplyid) >= 0;
            };

            //something extra I couldn't resist adding :)
            $scope.isSelectedAll = function () {
                if($scope.leagueapplyData != null){
                    return $scope.selected.length === $scope.leagueapplyData.length;
                }
            };
            //全选、反选结束
        }
    ])