angular.module('masgetWebApp.Faccount')
    .controller('confirmController',['$scope', '$state', 'utils','$modal','$alert','$http','$timeout','$window','session','uiGridConstants','i18nService',
        function ($scope, $state, utils,$modal,$alert,$http,$timeout,$window,session,uiGridConstants,i18nService) {
            $scope.session = session;
            //ui-grid 分页汉化
            i18nService.setCurrentLang('zh-cn');

            var dayTime=60*60*24*1000*7;
            var afTime=60*60*24*1000*1;
            var backTime=new Date().getTime()-dayTime;
            var afterTime=new Date().getTime()+afTime;
            $scope.confirmModel={
                begincreatedtime:new Date(backTime).format("yyyy-MM-dd"),
                endcreatedtime:new Date(afterTime).format("yyyy-MM-dd"),
                pagesize:15,
                pagenum:1
            }

            //查询所有者钱包数据
            $scope.check = function(){
                var obj = {
                    pagesize:$scope.confirmModel.pagesize,
                    pagenum:$scope.confirmModel.pagenum,
                    objectname:$scope.confirmModel.objectname,
                    begincreatedtime:$scope.confirmModel.begincreatedtime,
                    endcreatedtime:$scope.confirmModel.endcreatedtime
                }
                var url = "/jsbweb/enterprise/FundAccount/rechargeget.do"
                utils.query(url,{method:'POST',data:{data:JSON.stringify(obj)}},true).then(function(resp){
                    angular.forEach(resp.data.rows,function(item,key)
                    {
                        item.zhaiyao = "充值";
                    })
                    $scope.gridOptions.data = resp.data.rows;
                    $scope.gridOptions.totalItems = resp.data.total;
                },function(resp){

                });
            }
            $scope.check();

            //确认收款
            $scope.confirm = function(item){
                var obj = angular.copy(item);
                $modal({html:true,scope:$scope,title:"提示",content: "是否确认该笔收款已经到账？", template: 'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback:function(a,b,c){
                    obj.rechargestatus = 2;
                    $scope.iconFlag = "add";
                    $scope.context = "正在操作中..."
                    utils.query('/jsbweb/enterprise/FundAccount/providerconfirm.do',{method:'POST',data:{data:JSON.stringify(item)}},true).then(function(resp){
                        $alert({title: '提示：', content:"确认收款成功", placement: 'masget-top',duration:2, type: 'info', show: true});
                        $scope.iconFlag = "";
                        $scope.check();
                    },function(resp){
                        $scope.iconFlag = "";
                        $alert({title: '提示：', content: "确认收款失败", placement: 'masget-top',duration:2, type: 'info', show: true});
                        $scope.check();
                    });
                }})
            }

            //扣款
            $scope.del = function(item){
                $modal({html:true,scope:$scope,title:"提示",content: "是否确认删除该笔收款？", template: 'modal/modal.confirm.tpl.html',animation:'am-fade-and-scale',callback:function(a,b,c){
                    $scope.iconFlag = "add";
                    $scope.context = "正在操作中..."
                    utils.query('/jsbweb/enterprise/PrepaymentManagement/rechargeadd.do',{method:'POST',data:{data:JSON.stringify($scope.rechargeData)}},true).then(function(resp){
                        $alert({title: '提示：', content:"扣款成功", placement: 'masget-top',duration:2, type: 'info', show: true});
                        $scope.iconFlag = "";
                    },function(resp){
                        $scope.iconFlag = "";
                        $scope.button = false;
                        $alert({title: '提示：', content: "扣款失败", placement: 'masget-top',duration:2, type: 'info', show: true});
                    });
                }})
            }

            $scope.gridOptions = {
                //显示table的th
                columnDefs: [
                    { name: '序号',field:'id', width:60,cellTemplate:
                        '<div class="ui-grid-cell-contents" style="text-align:center">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>'
                    },
                    {name:'操作', field:'',
                        cellTemplate: '<div class="ui-grid-cell-contents">' +
                        '<a href="" ng-if="row.entity.rechargestatus == 1&&row.entity.rechargetype == 3" class="link_edit" ng-click="grid.appScope.confirm(row.entity)">确认收款</a>' +
                        //'&nbsp;&nbsp;<a href="" class="link_edit" ng-click="grid.appScope.del(row.entity)">删除</a>' +
                        '</div>'
                    },
                    //{ name: '支付流水号',field:'waternum'},
                    { name: '经销商名称',field:'objectname'},
                    { name: '日期',field:'updatetime',
                        sort: {
                            direction: uiGridConstants.DESC,
                            priority: 1
                        }
                    },
                    { name: '摘要',field:'zhaiyao'},
                    { name: '金额',field:'amount'	},
                    { name: '充值方式',field:'',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.stateToName(row.entity.rechargetype)}}</div>'
                    },
                    { name: '状态',field:'',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.rechargestatusToName(row.entity.rechargestatus)}}</div>'
                    },
                    { name: '备注',field:'rechargedesc'}
                ],
                paginationPageSizes: [5, 10, 15,20,25,50,100],
                paginationPageSize: 15,
                useExternalPagination: true,
                enableGridMenu: true,
                enableColumnMenus: false,
                onRegisterApi: function(gridApi){
                    $scope.gridApi = gridApi;
                    $scope.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                        if($scope.getPage) {
                            $scope.getPage(newPage, pageSize);
                        }
                    });
                }
            };

            $scope.rechargestatusToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "待支付";
                    case 2:
                        return "充值中";
                    case 3:
                        return "充值成功";
                    case 4:
                        return "充值失败";
                    default :
                        return "";
                }
            };

            $scope.stateToName = function(orderstate){
                switch (orderstate){
                    case 1:
                        return "pos机";
                    case 2:
                        return "网银";
                    case 3:
                        return "线下转账";
                    default :
                        return "";
                }
            };

            $scope.getPage = function(pagenum, pagesize) {
                $scope.confirmModel.pagenum = pagenum
                $scope.confirmModel.pagesize = pagesize;
                $scope.check();
            };

        }
    ])
