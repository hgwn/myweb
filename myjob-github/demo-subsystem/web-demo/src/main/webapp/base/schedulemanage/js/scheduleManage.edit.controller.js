angular.module('masgetWebApp.scheduleManage').controller('scheduleManageEditCtr', ['$scope', '$state', '$timeout', '$dropdown', 'utils', 'businessTypes', function ($scope, $state, $timeout, $dropdown, utils, businessTypes) {

        $scope.operateType = 'insert';
        $scope.processInfo = {
            id:""
        }
        $scope.processNodes = [];

        if($state.broadCast&&$state.broadCast.operationType === 'edit'){
            $scope.processInfo = $state.broadCast.processInfo;
            $scope.processNodes = $state.broadCast.processNodes;
            $scope.operateType = 'update';
            $.each($scope.processNodes,function(key,item){
                var users = $.map(item.users,function(item){
                    return {staffid:item.handler_id};
                });

                utils.query('/jsbweb/scheduleManage.do?type=getUsers&users='+JSON.stringify(users)).then(function(resp){
                    item.users = resp.data.rows;
                })
            });
        }

        $scope.saveOrUpdate = function () {
            var data = {
                operate_type: $scope.operateType,
                user_process_id: $scope.processInfo.id,
                business_id: $scope.processInfo.business_id,
                business_name: utils.findByKeyValue(businessTypes, 'ordertypeid', $scope.processInfo.business_id).ordername,
                process_key: $scope.processInfo.process_key,
                process_name: $scope.processInfo.process_name,
                node_base: [],
                orgs:$scope.stationTree
            };

            $.each($scope.processNodes, function (key, item) {
                if (item.node_type == 1 || (item.node_type == 2 && item.checked)) {
                    var nodeBase = {};
                    nodeBase.node_key = item.node_key;
                    nodeBase.node_name = item.node_name;
                    nodeBase.handle_url = item.handle_url;
                    nodeBase.node_sort = item.node_sort;
                    nodeBase.id=item.id?item.id:"";
                    nodeBase.users = [];
                    $.each(item.users, function (key, item) {
                        nodeBase.users.push({
                            org_type: 'org',
                            org_key: item.stationid,
                            parent_id: item.companyid,
                            user_id: item.staffid
                        });
                    })
                    data.node_base.push(nodeBase);
                }
            });

            utils.query('/jsbweb/scheduleManage.do?type=save', {type: 'post',method:'post', data: {data: JSON.stringify(data)}}).then(function (resp) {
                $alert($scope.operateType == 'insert'?"成功创建流程":'成功更新流程');
                $state.go('home.scheduleManage.list');
            }, function (resp) {

            });
        };
        7
        $scope.currentNode = {};

        $scope.nodeClickHandler = function (item) {
            if(item.node_type === 0) return;
            $.each($scope.processNodes, function (key, node) {
                node.isActive = false;
            });
            item.isActive = true;
            $scope.currentNode = item;
            $scope.workFlowNodeUserList.data = item.users;
        }

        var workFlowNodeUserGrid;
        $scope.workFlowNodeUserList = {
            useExternalPagination: false,
            useExternalSorting: false,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableColumnMenus: true,
            enableSorting: true,
            selectionRowHeaderWidth: 35,
            //点击展开时触发
            expandableRowCallBack: function (sc) {

            },
            onRegisterApi: function (gridApi) {
                workFlowNodeUserGrid = gridApi;
            },
            paginationPageSizes: [5, 10, 25],
            paginationPageSize: 5,
            //显示table的th
            columnDefs: [
                { name: '姓名', field: 'staffname' },
                { name: '登录名称', field: 'loginname' },
                { name: '所属公司', field: 'companyname' },
                { name: '工作站点', field: 'stationname' }
            ],
            data: []
        };

        var selectNodeUserGridApi;

        $scope.selectNodeUserGrid = {
            useExternalPagination: true,
            useExternalSorting: false,
            enableColumnResizing: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableColumnMenus: true,
            enableSorting: true,
            selectionRowHeaderWidth: 35,
            data:[],
            //点击展开时触发
            expandableRowCallBack: function (sc) {

            },
            onRegisterApi: function (gridApi) {
                selectNodeUserGridApi = gridApi;
                $.extend(gridApi.pagination, {
                    paginationChanged: function (currentPage, pageSize) {
                        console.log(currentPage, pageSize);
                    }
                });

            },
            paginationPageSize: 10,
            //显示table的th
            columnDefs: [
                { name: '姓名', field: 'staffname' },
                { name: '登录名称', field: 'loginname' },
                { name: '所属公司', field: 'companyname' },
                { name: '工作站点', field: 'stationname' }
            ]
        };

        $scope.businessTypes = businessTypes;

        function redrawFlowChart(){
            var clientWidth = $scope.containerElement.width()- 60;
            rowCount = Math.floor(clientWidth / 110);
            $scope.lineCount = Math.floor(($scope.processNodes.length - 1) / rowCount + 1);
            for (var i = 0; i < $scope.processNodes.length; i++) {
                var lineNum = Math.floor(i / rowCount + 1);
                var item = $scope.processNodes[i];
                if (lineNum % 2 == 0) {
                    item.isInEvenLine = true;
                } else {
                    item.isInEvenLine = false;
                }
            }

            $timeout(function () {
                var $mask , lastNode, lastLine;
                if ($scope.lineCount % 2 == 1) {
                    $mask = $(".processNodesContainer",$scope.containerElement).children().last();
                    lastNode = $mask.prev();
                    $mask.css("marginLeft", lastNode[0].offsetLeft + "px")
                } else {
                    lastLine = $(".lineContainer",$scope.containerElement).children().last();
                    lastNode = $(".processNodesContainer",$scope.containerElement).children().last();
                    lastLine.length>0 && lastLine.css("marginLeft", lastNode[0].offsetLeft + "px");
                }
                $scope.$digest();
            });
        }

        if($scope.operateType == 'insert')
        $scope.$watch('processInfo.business_id', function (newVal, oldVal) {
            utils.query("/jsbweb/scheduleManage.do?type=processnodelsel&businessid=" + newVal).then(function (resp) {
                $scope.processNodes = [
                    {node_type: 0, node_key: 'startNode', node_name: '开始节点'}
                ].concat(resp.data.nodes, [
                    {node_type: 0, node_key: 'endNode', node_name: '结束节点'}
                ]);

                $scope.processInfo.process_key = resp.data.processKey;
                $.each($scope.processNodes, function (key, item) {
                    if (item.node_type !== 0)  item.users = [];
                });
                redrawFlowChart();
            });

        });
        else{
            $scope.processNodes = [
                {node_type: 0, node_key: 'startNode', node_name: '开始节点'}
            ].concat($scope.processNodes, [
                    {node_type: 0, node_key: 'endNode', node_name: '结束节点'}
                ]);
            $scope.processInfo.process_key = $scope.processInfo.process_key;
            $.each($scope.processNodes, function (key, item) {
                if (item.node_type !== 0)  item.node_type = 1;
            });
        }


        $scope.$watch('lineCount', function (newVal, oldVal) {
            if (newVal != oldVal && newVal > 2) {
                $timeout(function () {
                    $(".lineContainer",$scope.containerElement).children().last().prev().css("marginLeft", "0px");
                })
            }
        })

        $scope.addNodeUsers = function () {
            if (!$scope.currentNode.node_key) {
                $alert("请选择流程节点");
                return;
            }
            $modal({callback: function (element, msg) {
                $.each(selectNodeUserGridApi.selection.getSelectedRows(), function (key, item) {
                    var isExisits = false;
                    $.each($scope.workFlowNodeUserList.data, function (innerkey, inneritem) {
                        if (item.staffid === inneritem.staffid)
                            isExisits = true;
                    });
                    if (!isExisits)
                        $scope.workFlowNodeUserList.data.push(item);
                    $scope.currentNode.users = $scope.workFlowNodeUserList.data;
                })
            },
                cancelCallback: function () {
                },
                scope: $scope,
                html: true,
                title: '选择人员',
                template: 'modal/modal.confirm.tpl.html',
                contentTemplate: 'base/scheduleManage/tpls/userSelectGrid.tpl.html',
                prefixEvent: 'selectUsers'
            });
        };

        $scope.deleteNodeUsers = function () {
            console.log(workFlowNodeUserGrid.selection.getSelectedRows());

            $.each(workFlowNodeUserGrid.selection.getSelectedRows(),function(key,node){
                $scope.currentNode.users = $scope.workFlowNodeUserList.data = utils.removeFromArrayByKeyValue($scope.currentNode.users,'staffid',node.staffid);
            })


        };

        $scope.lineCount = 0;

        $scope.$on('$viewContentLoaded', function (event,element) {
            $scope.containerElement = element;
            redrawFlowChart();
            $(window).resize(function () {
                redrawFlowChart();
                $scope.$digest();
            });
        });

        utils.query("/jsbweb/base/stationdatum/plist.do").then(function (resp) {
            utils.calTreeLevel(resp.data.rows,0);
            $scope.stationTree = []
            function recursiveTree(nodes,result){
                $.each(nodes,function(key,item){
                    var newItem ={
                        org_type:'org',
                        org_id:item.id,
                        org_name:item.text,
                        parent_id:item.pstationid === 0?item.companyid:item.pstationid,
                        children:[]
                    };
                    if($.isArray(item.children)&&item.children.length>0){
                        recursiveTree(item.children,newItem.children);
                    }
                    result.push(newItem);
                })
            }
            recursiveTree(resp.data.rows,$scope.stationTree);
            $scope.stationList = [{text:"全部"}].concat(resp.data.rows);
        });

        var stationDropDown;

        $scope.$on('selectUsers.show', function (modal) {
            stationDropDown = $dropdown($("#stationSelect"), {
                animation: "am-fade-and-slide-bottom",
                trigger: "hover",
                unbindBodyClick: true,
                html: "true",
                scope: $scope,
                container: "body",
                hoverHold:true,
                delay:200,
                template: "base/scheduleManage/tpls/stationList.tpl.html",
                prefixevent: "stationDropDown"
            })
        });

        $scope.stationChanged = function (newStation) {
            $scope.searchStationId = newStation.id;
            $scope.searchStationName = newStation.text;
            stationDropDown.hide();
        };

        $scope.searchUsers = function () {
            var data = JSON.stringify({
                stationid: $scope.searchStationId,
                staffname: $scope.staffname,
                pagenum: 1,
                pagesize: 10
            })
            utils.query("/jsbweb/base/companystaff/getcompanystaff.do?data=" + data).then(function (resp) {
                $scope.selectNodeUserGrid.totalItems = resp.data.total;
                $scope.selectNodeUserGrid.data = resp.data.rows;
            }, function (resp) {
                console.log(resp);
            })
        };

        $scope.toWorkFlowList = function(){
            $state.go('home.scheduleManage.list');
        }
    }]
)